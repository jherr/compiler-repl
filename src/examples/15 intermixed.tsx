import { useMemo } from "react";

export function SortedList({ names }: { names: string[] }) {
  const sortedNames = useMemo(() => names.toSorted(), [names]);

  return (
    <ul>
      {sortedNames.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}

export function Header() {
  return (
    <header>
      <h1>My App</h1>
    </header>
  );
}
