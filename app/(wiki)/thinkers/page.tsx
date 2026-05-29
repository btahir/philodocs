import type { Metadata } from "next";
import { EntryList } from "@/components/wiki/entry-list";
import { thinkers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Thinkers",
};

export default function ThinkersPage() {
  return (
    <>
      <header className="wiki-index-header">
        <p className="wiki-kicker">Thinkers</p>
        <h1 className="wiki-index-title">Thinkers</h1>
        <p className="wiki-index-copy">
          Biographical nodes for philosophers, theologians, critics, founders,
          and major figures in the history of thought.
        </p>
      </header>
      <EntryList entries={thinkers} />
    </>
  );
}
