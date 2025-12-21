import { cookies } from "next/headers";
import type { Metadata } from "next";

import NotesClient from "./Notes.client";
import { serverFetchNotes } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";

  return {
    title: `Notes: ${tag} | NoteHub`,
    description: `Filtered notes by tag: ${tag}`,
  };
}

export default async function FilterNotesPage({ params }: Props) {
  const cookieStore = await cookies();

  const { slug } = await params;
  const tag = slug?.[0] ?? "all";
  const normalizedTag = tag === "all" ? undefined : tag;

  const initialData = await serverFetchNotes(cookieStore, {
    page: 1,
    search: "",
    tag: normalizedTag,
  });

  return <NotesClient initialData={initialData} tag={tag} />;
}
