import { Cpu } from "lucide-react";

export const text_items = [
  {
    title: "Chat Basic",
    url: "/chat",
    icon: Cpu,
    image: "/icons/keyboard.png",
    type:"inference",
    description:
      "Engage in real-time, responsive basic chat interactions with our streamlined chat model for quick, efficient responses.",
  },
  {
    title: "Chat Conversation",
    url: "/chat-conv",
    icon: Cpu,
    image: "/icons/keyboard.png",
    type:"inference",
    description:
      "Experience a dynamic conversational chat model that offers more natural and context-aware responses across a session.",
  },
  {
    title: "Text Summarization",
    url: "/summarization",
    icon: Cpu,
    image: "/icons/keyboard.png",
    type:"inference",
    description:
      "Transform lengthy text into concise summaries, capturing key points and saving time with our advanced summarization tool.",
  },
  {
    title: "Text Classification",
    url: "/text-classification",
    icon: Cpu,
    image: "/icons/keyboard.png",
    type:"inference",
    description:
      "Analyze and organize text data by categorizing information based on customized tags and themes with ease and precision.",
  },
];

export const visual_items = [
  {
    title: "Image Generator",
    url: "/text-to-image",
    icon: Cpu,
    image: "/icons/gpu.png",
    type:"inference",
    description:
      "Generate unique images from descriptive text, creating visualizations that match your imagination with high fidelity.",
  },
  {
    title: "Image To Text",
    url: "/image-to-text",
    icon: Cpu,
    image: "/icons/gpu.png",
    type:"inference",
    description:
      "Extract descriptive text from images, converting visual information into readable content with high accuracy.",
  },
  {
    title: "Image Classification",
    url: "/image-classification",
    icon: Cpu,
    image: "/icons/gpu.png",
    type:"inference",
    description:
      "Identify objects, scenes, and other elements within images, providing detailed classification to enrich your data insights.",
  },
  {
    title: "Image Classification 2",
    url: "/image-classification-2",
    icon: Cpu,
    image: "/icons/gpu.png",
    type:"mediapipe",
    description:
      "Identify objects, scenes, and other elements within images, providing detailed classification to enrich your data insights.",
  },
  {
    title: "Object Detection Image",
    url: "/object-detection",
    icon: Cpu,
    image: "/icons/gpu.png",
    type:"mediapipe",
    description:
      "Identify objects, scenes, and other elements within images, providing detailed classification to enrich your data insights.",
  },
  {
    title: "Object Detection Video",
    url: "/object-detection-video",
    icon: Cpu,
    image: "/icons/gpu.png",
    type:"mediapipe",
    description:
      "Identify objects, scenes, and other elements within images, providing detailed classification to enrich your data insights.",
  },
  {
    title: "Image Illustrator",
    url: "/image-to-image",
    icon: Cpu,
    image: "/icons/gpu.png",
    type:"inference",
    description:
      "Transform images into stylized illustrations, blending creativity and technology to redefine your visuals.",
  },
];

export const audio_items = [
  {
    title: "Text to Speech",
    url: "/text-to-speech",
    icon: Cpu,
    image: "/icons/voice.png",
    type:"inference",
    description: "Convert your text to speech.",
  },
  {
    title: "Speech to Text",
    url: "/speech-to-text",
    icon: Cpu,
    image: "/icons/voice.png",
    type:"inference",
    description: "Convert your speech audio file to text.",
  },
];
