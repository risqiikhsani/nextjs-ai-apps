import ModelCard from "@/components/model-card";
import { audio_items, text_items, visual_items } from "@/const/links";

export default function Page() {
  return (
    <div className="container mx-auto flex flex-col justify-center items-center pt-20 gap-12">
      <h1 className="text-4xl font-bold mt-16 mb-8 text-blue-600">
        Natural Language Processing
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {text_items.map((item, index) => (
          <ModelCard item={item} key={index} />
        ))}
      </div>

      <h1 className="text-4xl font-bold mt-16 mb-8 text-blue-600">
        Computer Vision
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {visual_items.map((item, index) => (
          <ModelCard item={item} key={index} />
        ))}
      </div>

      <h1 className="text-4xl font-bold mt-16 mb-8 text-blue-600">Audio</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {audio_items.map((item, index) => (
          <ModelCard item={item} key={index} />
        ))}
      </div>
    </div>
  );
}
