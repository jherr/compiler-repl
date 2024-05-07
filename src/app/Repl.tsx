"use client";
import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark } from "@uiw/codemirror-theme-github";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Loader() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-b-8 border-gray-300"></div>
    </div>
  );
}

export default function Repl({
  exampleFiles,
}: {
  exampleFiles: Record<string, string>;
}) {
  const [code, setCode] = useState(Object.values(exampleFiles)[0] ?? "");
  const [compiledCode, setCompiledCode] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState<string | null>(null);
  const [eslintOutput, setEslintOutput] = useState<string | null>(null);
  const [stderr, setStderr] = useState<string | null>(null);

  const currentRequest = useRef(0);
  async function transpile(code: string) {
    const requestId = ++currentRequest.current;
    setCompiledCode(null);
    setCurrentCode(null);
    setEslintOutput(null);
    setStderr(null);

    fetch("/api/babel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then(({ stderr, stdout }) => {
        if (requestId !== currentRequest.current) {
          return;
        }
        setCompiledCode(stdout);
        setStderr(stderr);
      });

    fetch("/api/babel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, config: "no-compiler.babelrc.json" }),
    })
      .then((res) => res.json())
      .then(({ stdout }) => {
        if (requestId !== currentRequest.current) {
          return;
        }
        setCurrentCode(stdout);
      });

    fetch("/api/eslint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then(({ stdout }) => {
        if (requestId !== currentRequest.current) {
          return;
        }
        setEslintOutput(stdout);
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
          <Tabs defaultValue="compiler" className="w-full h-full">
            <TabsList>
              <TabsTrigger value="compiler">React Compiler</TabsTrigger>
              <TabsTrigger value="current">Current Transpiler</TabsTrigger>
              <TabsTrigger value="eslint">ESlint</TabsTrigger>
            </TabsList>
            <TabsContent value="compiler" className="h-full">
              {compiledCode ? (
                <CodeMirror
                  extensions={[javascript({ jsx: true })]}
                  theme={githubDark}
                  value={compiledCode}
                  height="100%"
                  className="h-[90%]"
                />
              ) : (
                <Loader />
              )}
              {stderr ? (
                <CodeMirror
                  theme={githubDark}
                  value={stderr}
                  height="100%"
                  className="h-[8%] mt-3"
                />
              ) : (
                <Loader />
              )}
            </TabsContent>
            <TabsContent value="current" className="h-full">
              {currentCode ? (
                <CodeMirror
                  extensions={[javascript({ jsx: true })]}
                  theme={githubDark}
                  value={currentCode}
                  height="100%"
                  className="h-[90%]"
                />
              ) : (
                <Loader />
              )}
            </TabsContent>
            <TabsContent value="eslint" className="h-full">
              {eslintOutput !== null ? (
                <CodeMirror
                  theme={githubDark}
                  value={eslintOutput}
                  height="100%"
                  className="h-[90%]"
                />
              ) : (
                <Loader />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
