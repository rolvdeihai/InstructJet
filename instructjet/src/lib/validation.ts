// src/lib/validation.ts

const BAD_WORDS = [
  'fuck', 'shit', ' ass ', 'bitch', 'damn', 'crap', 'stupid', 'idiot',
  'dick', 'pussy', 'cock', 'cunt', 'whore', 'slut', 'bastard',
  // add more as needed
];

export function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(word => lower.includes(word));
}

export function isGibberish(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 3) return true; // too short
  
  // Check repeated characters (>60% same char)
  const charCounts: Record<string, number> = {};
  for (const ch of trimmed) {
    if (ch !== ' ') {
      charCounts[ch] = (charCounts[ch] || 0) + 1;
    }
  }
  const maxCount = Math.max(...Object.values(charCounts));
  if (maxCount / trimmed.length > 0.6) return true;
  
  // Check if less than 50% are letters
  const letters = trimmed.replace(/[^a-zA-Z]/g, '').length;
  if (letters / trimmed.length < 0.5) return true;
  
  return false;
}

export function validateGuideContent(title: string, content: string): string[] {
  const errors: string[] = [];
  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters.');
  } else if (containsProfanity(title)) {
    errors.push('Title contains inappropriate language.');
  } else if (isGibberish(title)) {
    errors.push('Title appears to be gibberish. Please provide a meaningful title.');
  }
  
  if (!content || content.trim().length < 100) {
    errors.push('Guide content must be at least 100 characters.');
  } else if (containsProfanity(content)) {
    errors.push('Guide content contains inappropriate language.');
  } else if (isGibberish(content)) {
    errors.push('Guide content appears to be gibberish. Please provide meaningful content.');
  }
  return errors;
}

export function validateListingDetails(description: string, category: string): string[] {
  const errors: string[] = [];
  if (!description || description.trim().length < 20) {
    errors.push('Description must be at least 20 characters.');
  } else if (containsProfanity(description)) {
    errors.push('Description contains inappropriate language.');
  } else if (isGibberish(description)) {
    errors.push('Description appears to be gibberish. Please provide a meaningful description.');
  }
  
  if (category && category.trim().length > 0) {
    if (containsProfanity(category)) {
      errors.push('Category contains inappropriate language.');
    } else if (isGibberish(category)) {
      errors.push('Category appears to be gibberish.');
    } else if (!/^[a-zA-Z0-9\s\-]+$/.test(category)) {
      errors.push('Category can only contain letters, numbers, spaces and hyphens.');
    }
  }
  return errors;
}