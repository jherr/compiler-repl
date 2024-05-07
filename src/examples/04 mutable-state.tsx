import { useState } from "react";

export default function Hello() {
  const [name, setName] = useState("Jack");
  return (
    <div>
      <p>Hi: {name}</p>
      <strong>Static Content</strong>
    </div>
  );
}
