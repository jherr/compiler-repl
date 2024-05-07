"use client";
import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark } from "@uiw/codemirror-theme-github";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { transpile as transpileCode } from "./server-actions";

export default function Repl({
  exampleFiles,
}: {
  exampleFiles: Record<string, string>;
}) {
  const [code, setCode] = useState(Object.values(exampleFiles)[0] ?? "");
  const [compiledCode, setCompiledCode] = useState("");
  const [currentCode, setCurrentCode] = useState("");
  const [stderr, setStderr] = useState("");

  async function transpile(code: string) {
    transpileCode(code).then(({ stderr, stdout }) => {
      setCompiledCode(stdout);
      setStderr(stderr);
    });
    transpileCode(code, "no-compiler.babelrc.json").then(({ stdout }) => {
      setCurrentCode(stdout);
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
            </TabsList>
            <TabsContent value="compiler" className="h-full">
              <CodeMirror
                extensions={[javascript({ jsx: true })]}
                theme={githubDark}
                value={compiledCode}
                height="100%"
                className="h-[90%]"
              />
              <CodeMirror
                theme={githubDark}
                value={stderr}
                height="100%"
                className="h-[8%] mt-3"
              />
            </TabsContent>
            <TabsContent value="current" className="h-full">
              <CodeMirror
                extensions={[javascript({ jsx: true })]}
                theme={githubDark}
                value={currentCode}
                height="100%"
                className="h-[90%]"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
