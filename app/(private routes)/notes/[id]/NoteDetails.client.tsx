// app/notes/[id]/NoteDetails.client.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

import css from "./NoteDetails.module.css";

interface NoteDetailsProps {
  id?: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsProps) {
  const params = useParams();
  const router = useRouter();

  // id з пропів або з URL
  const routeRawId = params?.id;
  const rawId = id ?? routeRawId;
  const finalId = Array.isArray(rawId) ? rawId[0] : rawId;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note, Error>({
    queryKey: ["note", finalId],
    queryFn: () => fetchNoteById(finalId as string),
    enabled: typeof finalId === "string",
    refetchOnMount: false,
  });

  if (!finalId) {
    return <p>Note id is missing</p>;
  }

  if (isLoading) {
    return (
      <main className={css.main}>
        <div className={css.container}>
          <p className={css.content}>Loading, please wait...</p>
        </div>
      </main>
    );
  }

  if (isError || !note) {
    return (
      <main className={css.main}>
        <div className={css.container}>
          <p className={css.content}>Something went wrong.</p>
          <button
            type="button"
            className={css.backBtn}
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={css.main}>
      <div className={css.container}>
        <button
          type="button"
          className={css.backBtn}
          onClick={() => router.back()}
        >
          Back
        </button>

        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            {note.tag && <span className={css.tag}>{note.tag}</span>}
          </div>

          <p className={css.content}>{note.content}</p>

          <p className={css.date}>
            {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </main>
  );
}
