import React from 'react';

interface MarkdownDisplayProps {
  text: string;
}

const MarkdownDisplay = ({ text }: MarkdownDisplayProps) => {
  // Helper function to process the text line by line
  const processText = (text: string) => {
    // First split by code blocks
    const parts = text.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith('```')) {
        // Extract language and code
        const lines = part.split('\n');
        const language = lines[0].slice(3).trim();
        const code = lines.slice(1, -1).join('\n');
        
        return (
          <div key={index} className="my-4">
            {language && (
              <div className="bg-gray-800 text-gray-200 px-4 py-1 text-sm rounded-t-md">
                {language}
              </div>
            )}
            <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto rounded-b-md">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      // Process regular text
      const lines = part.split('\n');
      return lines.map((line, lineIndex) => {
        // Check for numbered lists
        const numberedListMatch = line.match(/^(\d+)\.\s+(.+)/);
        if (numberedListMatch) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, number, content] = numberedListMatch;
          return processLine(content, `${index}-${lineIndex}`, true, number);
        }
        
        // Check for bullet points
        const bulletMatch = line.match(/^\s*\*\s+(.+)/);
        if (bulletMatch) {
          return processLine(bulletMatch[1], `${index}-${lineIndex}`, false);
        }
        
        return processLine(line, `${index}-${lineIndex}`);
      });
    });
  };

  // Helper function to process bold text and other formatting
  const processLine = (line: string, key: string, isNumbered = false, number?: string) => {
    // Skip empty lines
    if (!line.trim()) {
      return <div key={key} className="h-4"></div>;
    }

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