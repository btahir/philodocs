import { MDXContent } from "@content-collections/mdx/react";
import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

export function WikiMdxContent({ code }: { code: string }) {
  return (
    <div className="wiki-prose" data-pagefind-body>
      <MDXContent code={code} components={{ a: MdxLink }} />
    </div>
  );
}

function MdxLink({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href?.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
