import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LinkType } from "@/types/links";
import Image from "next/image";
import Link from "next/link";

export default function ModelCard({ item }: { item: LinkType }) {
  return (
    <Card
      className="w-full transform transition duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500 hover:shadow-lg rounded-lg"
    >
      <CardHeader>
        <div className="flex gap-2">
        <CardTitle className="text-xl font-semibold text-blue-700">
          {item.title}
        </CardTitle>
        <Badge variant="outline" className="bg-orange-500">{item.type}</Badge>
        </div>
        
        <CardDescription className="text-gray-600">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Image
          src={item.image}
          height={200}
          width={200}
          alt="image"
          className="rounded-md"
        />
      </CardContent>
      <CardFooter>
        <Link href={item.url}>
          <Button className="hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out">
            Learn More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
