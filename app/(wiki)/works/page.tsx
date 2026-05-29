import type { Metadata } from "next";
import { EntryList } from "@/components/wiki/entry-list";
import { works } from "@/lib/content";

export const metadata: Metadata = {
  title: "Works",
};

export default function WorksPage() {
  return (
    <>
      <header className="wiki-index-header">
        <p className="wiki-kicker">Works</p>
        <h1 className="wiki-index-title">Texts and works</h1>
        <p className="wiki-index-copy">
          Primary texts and durable works that should become reference anchors.
        </p>
      </header>
      <EntryList entries={works} />
    </>
  );
}
