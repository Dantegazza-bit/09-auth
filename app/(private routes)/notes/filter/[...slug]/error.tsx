// app/notes/filter/[...slug]/error.tsx
"use client";

interface FilterErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function FilterError({ error, reset }: FilterErrorProps) {
  return (
    <div style={{ padding: "24px" }}>
      <h2>Something went wrong while loading filtered notes 😢</h2>
      <p>{error.message}</p>

      <button
        type="button"
        onClick={() => reset()}
        style={{ marginTop: "12px" }}
      >
        Try again
      </button>
    </div>
  );
}
