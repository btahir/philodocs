import type { Metadata } from "next";
import { SearchClient } from "@/components/search/search-client";
import { WikiFrame } from "@/components/wiki/wiki-frame";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the PhiloDocs philosophy wiki.",
};

export default function SearchPage() {
  return (
    <WikiFrame>
      <header className="wiki-index-header">
        <p className="wiki-kicker">Search</p>
        <h1 className="wiki-index-title">Full text search</h1>
        <p className="wiki-index-copy">
          Find names, concepts, works, and notes across the reference corpus.
        </p>
      </header>
      <SearchClient
        limit={18}
        placeholder="Search thinkers, schools, works, concepts..."
      />
    </WikiFrame>
  );
}
