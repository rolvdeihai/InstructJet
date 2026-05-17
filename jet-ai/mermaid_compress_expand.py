# mermaid_compress_expand.py
import spacy
import re
import random
from typing import List, Tuple

# Load once at module level
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading en_core_web_sm...")
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

STOPWORDS = {"the", "a", "an"}
CAUSAL_VERBS = {"cause", "trigger", "force", "lead", "produce", "create", "generate"}
SEQUENCE_WORDS = {"then", "after", "before", "next", "subsequently"}
SKIP_VERBS = {"be", "have", "do", "thank", "say", "know", "like", "want"}

def subtree_text(token):
    return " ".join(t.text for t in token.subtree)

def clean(text):
    return re.sub(r"\s+", " ", text).strip()

def normalise_entity(text: str) -> str:
    text = text.lower().strip()
    words = text.split()
    while words and words[0] in STOPWORDS:
        words.pop(0)
    if not words:
        return ""
    words[-1] = words[-1].rstrip(",.!?;:-")
    return " ".join(words)

def get_subject(verb):
    for child in verb.children:
        if child.dep_ in ("nsubj", "nsubjpass"):
            return clean(subtree_text(child))
    return None

def get_objects(verb):
    objects = []
    for child in verb.children:
        if child.dep_ in ("dobj", "attr", "oprd"):
            objects.append(clean(subtree_text(child)))
        elif child.dep_ == "prep":
            prep_text = child.text
            for pobj in child.children:
                if pobj.dep_ == "pobj":
                    full = f"{prep_text} {clean(subtree_text(pobj))}"
                    objects.append(full)
        elif child.dep_ in ("xcomp", "ccomp"):
            objects.append(clean(subtree_text(child)))
    return objects

def classify_relation(verb):
    if verb.lemma_ in CAUSAL_VERBS:
        return "causes"
    sent_lower = verb.sent.text.lower()
    if any(x in sent_lower for x in SEQUENCE_WORDS):
        return "then"
    return "acts_on"

def extract_edges_from_sentence(sent) -> List[Tuple[str, str, str, str]]:
    edges = []
    for token in sent:
        if token.pos_ != "VERB" or token.lemma_ in SKIP_VERBS:
            continue
        subject = get_subject(token)
        if not subject:
            continue
        objects = get_objects(token)
        if not objects:
            continue
        rel_type = classify_relation(token)
        for obj in objects:
            edges.append((subject, token.lemma_, rel_type, obj))
    return edges

def text_to_edges(text: str) -> List[Tuple[str, str, str, str]]:
    doc = nlp(text)
    all_edges = []
    for sent in doc.sents:
        all_edges.extend(extract_edges_from_sentence(sent))
    unique = []
    seen = set()
    for edge in all_edges:
        if edge not in seen:
            seen.add(edge)
            unique.append(edge)
    return unique

def encode(text):
    return text.replace(" ", "_")

def decode(text):
    return text.replace("_", " ")

def edges_to_mermaid(edges):
    return [f"{encode(subj)} -- {verb}:{rel} --> {encode(obj)}" for subj, verb, rel, obj in edges]

TEMPLATES = {
    "acts_on": ["{subj} {verb} {obj}.", "{subj} needs to {verb} {obj}."],
    "causes": ["{subj} {verb}, which leads to {obj}.", "{subj} {verb} and therefore {obj}."],
    "then": ["After {subj} {verb}, then {obj}.", "{subj} {verb}. Subsequently, {obj}."],
}

def conjugate(verb, subject):
    singular = {"he", "she", "it"}
    return verb + "s" if subject.lower() in singular else verb

def expand_line(line):
    pattern = r"(.+?)\s*--\s*(\w+):(\w+)\s*-->\s*(.+)"
    m = re.match(pattern, line)
    if not m:
        return line
    subj, verb, rel, obj = m.groups()
    subj = decode(subj)
    obj = decode(obj)
    template = random.choice(TEMPLATES.get(rel, ["{subj} {verb} {obj}."]))
    return template.format(subj=subj, verb=conjugate(verb, subj), obj=obj)

def mermaid_to_text(mermaid_lines):
    return " ".join(expand_line(l) for l in mermaid_lines)

def compress_text_to_mermaid(text: str) -> str:
    """Full pipeline: text -> edges -> mermaid string (one line per edge)"""
    edges = text_to_edges(text)
    mermaid_lines = edges_to_mermaid(edges)
    return "\n".join(mermaid_lines)

def expand_mermaid_to_text(mermaid_str: str) -> str:
    """Convert a multi-line mermaid string back to natural language"""
    lines = mermaid_str.strip().split("\n")
    return mermaid_to_text(lines)