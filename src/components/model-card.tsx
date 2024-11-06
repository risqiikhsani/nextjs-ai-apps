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
    <Card className="flex flex-col w-full transform transition duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500 hover:shadow-lg rounded-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-2">
          <CardTitle className="text-xl font-semibold text-blue-700">
            {item.title}
          </CardTitle>
          <Badge variant="outline" className="bg-orange-500 rounded-2xl">
            {item.type}
          </Badge>
        </div>

        <CardDescription>
          {item.description}
        </CardDescription>
      </CardHeader>
      <div className="flex-1"></div>
      <CardContent className="flex items-center justify-center">
        <Image
          src={item.image}
          height={200}
          width={200}
          alt="image"
          className="rounded-md"
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          className="hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out"
          asChild
        >
          <Link href={item.url}>Open</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
