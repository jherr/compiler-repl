"use client";
import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark } from "@uiw/codemirror-theme-github";

import { Button } from "@/components/ui/button";

export default function Repl({
  exampleFiles,
}: {
  exampleFiles: Record<string, string>;
}) {
  const [code, setCode] = useState(Object.values(exampleFiles)[0] ?? "");
  const [transpiledCode, setTranspiledCode] = useState("");
  const [stderr, setStderr] = useState("");

  console.log(JSON.stringify(Object.keys(exampleFiles)));

  function transpile(code: string) {
    fetch("/api/transpile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then(({ stdout, stderr }) => {
        setTranspiledCode(stdout);
        setStderr(stderr);
      });
  }

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      transpile(code);
    }, 200);
  }, [code]);

  return (
    <div>
      <div className="mt-5 mx-5 flex flex-wrap gap-2">
        {Object.keys(exampleFiles).map((file) => (
          <Button
            key={file}
            onClick={() => {
              setCode(exampleFiles[file]);
              transpile(exampleFiles[file]);
            }}
          >
            {file.replace(".jsx", "")}
          </Button>
        ))}
      </div>

      <div className="flex px-5 pt-5 h-[90vh]">
        <div className="w-1/3 px-2 h-full">
          <CodeMirror
            theme={githubDark}
            extensions={[javascript({ jsx: true })]}
            value={code}
            height="100%"
            onChange={(v) => setCode(v)}
            className="h-full"
          />
        </div>
        <div className="w-2/3 px-2 h-full">
          <CodeMirror
            extensions={[javascript({ jsx: true })]}
            theme={githubDark}
            value={transpiledCode}
            height="100%"
            className="h-[90%]"
          />
          <CodeMirror
            theme={githubDark}
            value={stderr}
            height="100%"
            className="h-[8%] mt-3"
          />
        </div>
      </div>
    </div>
  );
}
