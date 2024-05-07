import { useMemo } from "react";

export default function SortedList({ names, extraStuff }: { names: string[] }) {
  const sortedNames = useMemo(() => names.toSorted(), [names]);

  return (
    <ul>
      {sortedNames.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}
