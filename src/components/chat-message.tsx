import React from 'react';

// Define the action-to-emoji mapping
const actionToEmojiMap: Record<string, string> = {
  "giggles": "😂",
  "winks": "😉",
  "laughs": "😂",
  "sad": "😢",
  "angry": "😠",
  "happy": "😊",
  "excited": "😃",
  "surprised": "😲",
  "confused": "😕",
  "love": "❤️",
  "thumbsup": "👍",
  "thumbsdown": "👎",
  "smiles brightly": "😁",
  "smiles softly": "🙂",
  "rolls eyes": "🙄",
  "shrugs": "🤷",
  "cries softly": "😭",
  "claps": "👏",
  "nods": "🙌",
  "facepalms": "🤦",
  "waves": "👋",
  "thinks deeply": "🤔",
  // Add more multi-word actions here
};

const parseTextWithEmojis = (text: string) => {
  // Regex to find text inside *...*
  const regex = /\*(.*?)\*/g;
  return text.replace(regex, (match, action) => {
    const emoji = actionToEmojiMap[action.toLowerCase().trim()];
    return emoji ? emoji : match; // If no match, keep the original text
  });
};

export default function ChatMessage({ message }: { message: string }) {
  return (
    <div>
      <p>{parseTextWithEmojis(message)}</p>
    </div>
  );
}
