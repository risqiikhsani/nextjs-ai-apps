"use client";

import { Button } from "@/components/ui/button";
import { useCompletion } from "ai/react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Function to highlight differences
function highlightChanges(input: string, completion: string) {
  const inputWords = input.split(" ");
  const completionWords = completion.split(" ");
  const highlightedResult = [];

  // Iterate through the words and highlight changes
  for (
    let i = 0;
    i < Math.max(inputWords.length, completionWords.length);
    i++
  ) {
    if (inputWords[i] === completionWords[i]) {
      // If words are the same, show them as normal
      highlightedResult.push(
        <span key={i} className="text-gray-700">
          {completionWords[i]}{" "}
        </span>
      );
    } else {
      // Highlight differences: red for input, green for completion
      if (inputWords[i]) {
        highlightedResult.push(
          <span key={`input-${i}`} className="text-red-500 line-through">
            {inputWords[i]}{" "}
          </span>
        );
      }
      if (completionWords[i]) {
        highlightedResult.push(
          <span key={`completion-${i}`} className="text-green-500">
            {completionWords[i]}{" "}
          </span>
        );
      }
    }
  }

  return highlightedResult;
}

export default function Chat() {
  const [language, setLanguage] = useState("english");
  const { completion, input, handleInputChange, handleSubmit, error } =
    useCompletion({
      api: "/api/genai/langchain/grammar-fixer",
      body: {
        language: language,
      },
    });

  return (
    <Card className="p-6 flex flex-col md:flex-row gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select onValueChange={(value) => setLanguage(value)} value={language}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="indonesian">Indonesian</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          className="w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Type your sentence to fix here"
          onChange={handleInputChange}
        />
        <Button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded shadow hover:bg-blue-600"
        >
          Submit
        </Button>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1 flex-col">
          {error && (
            <div className="fixed top-0 left-0 w-full p-4 text-center text-white bg-red-500">
              {error.message}
            </div>
          )}
          <p>
            {completion
              ? highlightChanges(input, completion)
              : "Output will be shown here"}
          </p>

          {completion && (
            <div>
              <h1 className="font-bold text-md">Corrected sentence</h1>
              <p>{completion}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Card>
  );
}
