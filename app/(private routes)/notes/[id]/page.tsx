import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import { serverFetchNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = params;

  try {
    const cookieStore = await cookies();
    const note = await serverFetchNoteById(cookieStore, id);

    return {
      title: `${note.title} | NoteHub`,
      description: note.content,
    };
  } catch {
    return {
      title: "Note details | NoteHub",
      description: "Note details page",
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = params;

  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => serverFetchNoteById(cookieStore, id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
