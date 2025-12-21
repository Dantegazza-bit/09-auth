// app/notes/filter/layout.tsx
import type { ReactNode } from "react";
import LayoutNotes from "@/components/LayoutNotes/LayoutNotes";

interface FilterLayoutProps {
  children: ReactNode;
  // робимо додаткові слоти НЕобов’язковими,
  // щоб LayoutProps<"/notes/filter"> (тільки children)
  // підходив під цей інтерфейс
  modal?: ReactNode;
  sidebar?: ReactNode;
}

export default function FilterLayout({
  children,
  modal,
  sidebar,
}: FilterLayoutProps) {
  return (
    <LayoutNotes sidebar={sidebar}>
      {children}
      {modal}
    </LayoutNotes>
  );
}
