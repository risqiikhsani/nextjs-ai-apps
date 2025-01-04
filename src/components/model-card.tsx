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
    <Card className="flex flex-col w-full transform transition duration-300 hover:scale-105 shadow-lg min-h-[500px] bg-transparent border-0">
      <CardHeader>
        <div className="flex flex-col items-center text-center">
          <CardTitle className="text-xl font-semibold">
            {item.title}
          </CardTitle>
          <Badge variant="outline" className="">
            {item.type}
          </Badge>
        </div>

        <CardDescription className=" text-center">
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
