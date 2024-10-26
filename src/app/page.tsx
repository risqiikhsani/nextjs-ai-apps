import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { text_items, visual_items } from "@/const/links";
import Image from "next/image";

export default function Page() {
  return (
    <div className="container mx-auto flex flex-col justify-center items-center pt-20 gap-12">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">Natural Language Processing</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {text_items.map((item, index) => (
          <Card
            key={index}
            className="w-full transform transition duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500 hover:shadow-lg rounded-lg"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-700">{item.title}</CardTitle>
              <CardDescription className="text-gray-600">{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src={item.image}
                height={300}
                width={500}
                alt="image"
                className="rounded-md"
              />
            </CardContent>
            <CardFooter>
              <Link href={item.url}>
                <Button className="hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out">Learn More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h1 className="text-4xl font-bold mt-16 mb-8 text-blue-600">Computer Vision</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {visual_items.map((item, index) => (
          <Card
            key={index}
            className="w-full transform transition duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500 hover:shadow-lg rounded-lg"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-700">{item.title}</CardTitle>
              <CardDescription className="text-gray-600">{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src={item.image}
                height={300}
                width={500}
                alt="image"
                className="rounded-md"
              />
            </CardContent>
            <CardFooter>
              <Link href={item.url}>
                <Button className="hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out">Learn More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
