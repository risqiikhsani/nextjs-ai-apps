import React from 'react';

const MarkdownDisplay = ({ text }: { text: string }) => {
  // Helper function to process the text line by line
  const processText = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Check for numbered lists (e.g., "1. ", "2. ")
      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)/);
      if (numberedListMatch) {
        const [_, number, content] = numberedListMatch;
        return processLine(content, lineIndex, true, number);
      }
      
      // Check for bullet points
      const bulletMatch = line.match(/^\s*\*\s+(.+)/);
      if (bulletMatch) {
        return processLine(bulletMatch[1], lineIndex, false);
      }
      
      return processLine(line, lineIndex);
    });
  };
  
  // Helper function to process bold text and other formatting
  const processLine = (line: string, key: number, isNumbered = false, number?: string) => {
    // Split the line by bold markers
    const parts = line.split(/(\*\*.*?\*\*)/g);
    
    const processedParts = parts.map((part, index) => {
      // Check if part is bold (surrounded by **)
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <span key={index} className="font-bold">
            {boldText}
          </span>
        );
      }
      return part;
    });
    
    if (isNumbered) {
      return (
        <div key={key} className="flex gap-2 my-1">
          <span className="font-medium">{number}.</span>
          <span>{processedParts}</span>
        </div>
      );
    }
    
    // For bullet points
    if (line.trim().startsWith('*')) {
      return (
        <div key={key} className="flex gap-2 my-1 ml-6">
          <span className="text-gray-600">•</span>
          <span>{processedParts}</span>
        </div>
      );
    }
    
    // Regular line
    return <div key={key} className="my-1">{processedParts}</div>;
  };
  
  return (
    <div className="space-y-1 text-gray-800 mt-10">
      {processText(text)}
    </div>
  );
};

export default MarkdownDisplay;