import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <section className="relative overflow-hidden container mx-auto max-w-7xl py-20">
      <div className="container">
        <div className="magicpattern absolute inset-x-0 top-0 -z-10 flex h-full w-full items-center justify-center opacity-100" />
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="z-10 flex flex-col items-center gap-6 text-center">
            <Image
            width={200}
            height={200} src="/icons/keyboard.png" alt="logo" className="" />
            <Badge variant="outline">About</Badge>
            <div>
              <h1 className="mb-6 text-pretty text-2xl font-bold lg:text-5xl">
                All in one AI Apps
              </h1>
              <p className="text-muted-foreground lg:text-xl">
                Discover what AI can do
              </p>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button>
                <Link href="/dashboard">Get Started</Link>
              </Button>
              <Button variant="outline">
                Learn more <ExternalLink className="ml-2 h-4" />
              </Button>
            </div>
            <div className="mt-20 flex flex-col items-center gap-4">
              <p className="text-center: text-muted-foreground lg:text-left">
                Built with open-source technologies
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3",
                  )}
                >
                  <Image
                  width={200}
                  height={200}
                    src="https://shadcnblocks.com/images/block/logos/shadcn-ui-small.svg"
                    alt="company logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3",
                  )}
                >
                  <Image
                  width={200}
                  height={200}
                    src="https://shadcnblocks.com/images/block/logos/typescript-small.svg"
                    alt="company logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>

                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3",
                  )}
                >
                  <Image
                  width={200}
                  height={200}
                    src="https://shadcnblocks.com/images/block/logos/react-icon.svg"
                    alt="company logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3",
                  )}
                >
                  <Image
                  width={200}
                  height={200}
                    src="https://shadcnblocks.com/images/block/logos/tailwind-small.svg"
                    alt="company logo"
                    className="h-4 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
