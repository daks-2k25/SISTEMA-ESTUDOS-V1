"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}

export default function CodeEditor({ value, onChange, ariaLabel }: CodeEditorProps) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      height="380px"
      theme={oneDark}
      extensions={[
        javascript({ typescript: true }),
        EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
      ]}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: false,
        highlightActiveLineGutter: false,
      }}
    />
  );
}
