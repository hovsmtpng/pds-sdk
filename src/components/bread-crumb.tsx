import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Crumb {
  text: string;
  href: string;
  disabled: boolean;
}

interface GenerateBreadcrumbProps {
  crumbs: Crumb[];
}

const GenerateBreadcrumb: React.FC<GenerateBreadcrumbProps> = ({ crumbs }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem>
              {!crumb.disabled && (index < crumbs.length - 1) ? (
                <BreadcrumbLink href={crumb.href}>{crumb.text}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.text}</BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {index < crumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default GenerateBreadcrumb;
