import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import { serverFetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
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

  // ✅ tag завжди явно, НЕ undefined
  const normalizedTag = tag === "all" ? "" : tag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page: 1, search: "", tag: normalizedTag }],
    queryFn: () =>
      serverFetchNotes(cookieStore, {
        page: 1,
        perPage: 10,
        search: "",
        tag: normalizedTag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={normalizedTag} />
    </HydrationBoundary>
  );
}
