// Basic list of profane words (expand as needed)
const PROFANITY_LIST = [
  'fuck', 'shit', 'asshole', 'bitch', 'cunt', 
  // ... add more
];

export function validateListingContent(description: string, category: string, title: string) {
  const errors: string[] = [];

  // 1. Length checks
  if (description.trim().length < 20) {
    errors.push('Description must be at least 20 characters.');
  }
  if (description.trim().length > 5000) {
    errors.push('Description is too long (max 5000 characters).');
  }
  if (category.trim().length < 2) {
    errors.push('Category must be at least 2 characters.');
  }

  // 2. Profanity check (case insensitive)
  const lowerDesc = description.toLowerCase();
  const lowerCategory = category.toLowerCase();
  const combined = lowerDesc + ' ' + lowerCategory;
  for (const word of PROFANITY_LIST) {
    if (combined.includes(word)) {
      errors.push(`Content contains inappropriate language: "${word}".`);
      break;
    }
  }

  // 3. Gibberish detection: check for repeated characters, excessive punctuation, etc.
  // e.g., more than 20% of characters are repeated non-letter characters
  const letters = description.replace(/[^a-zA-Z]/g, '').length;
  const total = description.length;
  if (total > 0 && letters / total < 0.3) {
    errors.push('Description seems to contain too few letters; please write a proper description.');
  }

  // 4. Check for excessive emojis (more than 10% of characters)
  const emojiCount = (description.match(/[\u{1F600}-\u{1F9FF}]/gu) || []).length;
  if (emojiCount / total > 0.15) {
    errors.push('Description contains too many emojis; please use text.');
  }

  // 5. Check for all caps (more than 80% uppercase letters)
  const upperCaseCount = (description.match(/[A-Z]/g) || []).length;
  if (upperCaseCount / letters > 0.8 && letters > 20) {
    errors.push('Description appears to be in ALL CAPS; please use normal case.');
  }

  return { valid: errors.length === 0, errors };
}