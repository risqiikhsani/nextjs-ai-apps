"use client";

import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCompletion } from "ai/react";
import { useState } from "react";

export default function Page() {
  const [positionName, setPositionName] = useState("");
  // const [jobUrl, setJobUrl] = useState("");

  const { completion, input, handleInputChange, handleSubmit, error } =
    useCompletion({
      api: "/api/genai/langchain/resume-polisher",
      body: {
        position_name: positionName,
        // job_url: jobUrl,
      },
    });

  return (
    <Card className="p-6 flex flex-col md:flex-row gap-6">
      <form onSubmit={handleSubmit} className="flex-1 flex-col gap-4">
        <Textarea
          className="w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={positionName}
          placeholder="Position Name"
          onChange={(event) => setPositionName(event.target.value)}
        />

        {/* <Textarea
          className="w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={jobUrl}
          placeholder="Job Url (optional)"
          onChange={(event) => setJobUrl(event.target.value)}
        /> */}

        <Textarea
          className="w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Your Resume Content"
          onChange={handleInputChange}
        />
        <Button type="submit" className="">
          Submit
        </Button>
      </form>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1 flex-col">
          {error && (
            <div className="fixed top-0 left-0 w-full p-4 text-center text-white bg-red-500">
              {error.message}
            </div>
          )}
          <Markdown>{completion && completion}</Markdown>
        </CardContent>
      </Card>
    </Card>
  );
}
