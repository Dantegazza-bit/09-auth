// app/@modal/(.)notes/[id]/NotePreview.client.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  let body;

  if (isLoading) {
    body = <p className={css.state}>Loading...</p>;
  } else if (isError || !note) {
    body = <p className={css.state}>Failed to load note.</p>;
  } else {
    body = (
      <>
        <div className={css.header}>
          <h2 className={css.title}>{note.title}</h2>

          <button
            type="button"
            className={css.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </>
    );
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.wrapper}>{body}</div>
    </Modal>
  );
}
