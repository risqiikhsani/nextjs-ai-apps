"use client";
import ModelCard from "@/components/model-card";
import {
  audio_items,
  genai_items,
  text_items,
  visual_items,
} from "@/const/links";
import { LinkType } from "@/types/links";
import { Brain, Eye, Mic } from "lucide-react";

export default function Page() {
  return (
      <div className="flex flex-col gap-6">
        {/* Generative AI Examples */}
        <Section
          title="Generative AI Examples"
          icon={<Brain />}
          items={genai_items}
        />

        {/* Natural Language Section */}
        <Section title="Natural Language" icon={<Brain />} items={text_items} />

        {/* Computer Vision Section */}
        <Section title="Computer Vision" icon={<Eye />} items={visual_items} />

        {/* Audio Section */}
        <Section title="Audio" icon={<Mic />} items={audio_items} />
      </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Section = ({
  title,
  icon,
  items,
}: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any;
}) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 rounded-lg">{icon}</div>
      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-l from-purple-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text">{title}</h2>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {items.map((item: LinkType, index: number) => (
        <ModelCard item={item} key={index} />
      ))}
    </div>
  </div>
);
