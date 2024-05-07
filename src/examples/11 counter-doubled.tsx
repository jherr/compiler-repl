import { useState, useMemo } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  const doubledCount = useMemo(() => count * 2, []);

  return (
    <div>
      <p>Count: {doubledCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
