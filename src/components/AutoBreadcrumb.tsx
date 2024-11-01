
"use client"

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, MoreHorizontal } from "lucide-react";

const AutoBreadcrumb = () => {
  const pathname = usePathname();
  const [showEllipsis, setShowEllipsis] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null); // Explicitly type as HTMLDivElement


  // Generate breadcrumb items from pathname
  const getPathSegments = () => {
    const segments = pathname
      .split('/')
      .filter(segment => segment !== '');
    
    return [{ name: 'Home', path: '/' }, ...segments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path: '/' + segments.slice(0, index + 1).join('/')
    }))];
  };

  const pathSegments = getPathSegments();

  // Check if we need to show ellipsis based on container width
  React.useEffect(() => {
    const checkOverflow = () => {
      const container = containerRef.current;
      if (container) {
        setShowEllipsis(container.scrollWidth > container.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [pathname]);

  // Always show first and last two items
  const visibleSegments = pathSegments.length > 4 && showEllipsis
    ? [
        pathSegments[0],
        ...pathSegments.slice(-2)
      ]
    : pathSegments;

  // Hidden segments for dropdown
  const hiddenSegments = pathSegments.length > 4 && showEllipsis
    ? pathSegments.slice(1, -2)
    : [];

  return (
    <div ref={containerRef} className="w-full overflow-hidden mt-10">
      <Breadcrumb>
        <BreadcrumbList>
          {visibleSegments.map((segment, index) => (
            <React.Fragment key={segment.path}>
              <BreadcrumbItem>
                {index === visibleSegments.length - 1 ? (
                  <BreadcrumbPage className="text-sm">{segment.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={segment.path}
                    className="text-sm hover:text-blue-500"
                  >
                    {segment.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {index < visibleSegments.length - 1 && (
                <>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  
                  {index === 0 && hiddenSegments.length > 0 && (
                    <>
                      <BreadcrumbItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center gap-1 hover:text-blue-500">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Show more</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {hiddenSegments.map((hiddenSegment) => (
                              <DropdownMenuItem key={hiddenSegment.path}>
                                <Link 
                                  href={hiddenSegment.path}
                                  className="w-full hover:text-blue-500"
                                >
                                  {hiddenSegment.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                    </>
                  )}
                </>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AutoBreadcrumb;