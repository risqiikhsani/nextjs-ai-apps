'use client';

import { useChat } from 'ai/react';
import { useRef, useState } from 'react';
import Image from 'next/image';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/genai/vercel/chat-multimodal",
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch gap-4">
      {messages.map(m => (
        <div key={m.id} className={`whitespace-pre-wrap rounded-xl p-2 border shadow-md ${
              m.role === "user"
                ? " self-end "
                : " self-start "
            }`}>
          {m.role === 'user' ? 'User: ' : (
            <Image
                width={32}
                height={32}
                alt="logo"
                src="/icons/keyboard.png"
                className='rounded-full w-10 h-10 bg-white mb-6'
            />
          )}
          {m.content}
          <div>
            {m?.experimental_attachments
              ?.filter(attachment =>
                attachment?.contentType?.startsWith('image/'),
              )
              .map((attachment, index) => (
                <Image
                  key={`${m.id}-${index}`}
                  src={attachment.url}
                  width={500}
                  height={500}
                  alt={attachment.name ?? `attachment-${index}`}
                  className='rounded-md border-2 border-primary'
                />
              ))}
          </div>
        </div>
      ))}

      <form
        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
        onSubmit={event => {
          handleSubmit(event, {
            experimental_attachments: files,
          });

          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <input
          type="file"
          className=""
          onChange={event => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}