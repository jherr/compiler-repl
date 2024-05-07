import { useMemo } from "react";

export default function SortedList({ names }) {
  const sortedNames = () => names.toSorted();

  return (
    <ul>
      {sortedNames.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}
