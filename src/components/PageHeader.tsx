"use client"
import { usePathname } from 'next/navigation';

import capitalize from 'lodash/capitalize';
import AutoBreadcrumb from './AutoBreadcrumb';

function PageHeader() {

  const pathname = usePathname();
  
  // Extract the last part of the path to generate a title
  const pathSegments = pathname.split('/');
  const pageTitle = pathSegments[pathSegments.length - 1];
  
  // Capitalize and format the title
  const title = pageTitle ? capitalize(pageTitle.replace(/-/g, ' ')) : 'Home';

  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="breadcrumb">
        {/* Render breadcrumb here */}
        <AutoBreadcrumb/>
      </nav>
      
      {/* Auto-generated Title */}
      <h1 className="page-title text-4xl font-extrabold my-4">{title}</h1>
    </div>
  );
}

export default PageHeader;
