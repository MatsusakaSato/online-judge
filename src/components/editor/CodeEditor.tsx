"use client";

import { CodeEditorHeader } from "@/components/editor/CodeEditorHeader";
import { CodeEditorFooter } from "@/components/editor/CodeEditorFooter";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { useCodeEditor } from "@/hooks/useCodeEditor";
import { LANGUAGE_OPTIONS } from "@/constants/codeEditor";

interface CodeEditorProps {
  problemId: number;
  onSubmissionStart?: () => void;
  onSubmissionSettled?: () => void | Promise<void>;
}

export default function CodeEditor({
  problemId,
  onSubmissionStart,
  onSubmissionSettled,
}: CodeEditorProps) {
  const {
    selectedLanguage,
    code,
    isSubmitting,
    handleEditorChange,
    handleLanguageChange,
    handleSubmit,
    handleEditorMount,
  } = useCodeEditor({
    problemId,
    onSubmissionStart,
    onSubmissionSettled,
  });

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden border">
      <CodeEditorHeader
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        languageOptions={LANGUAGE_OPTIONS}
      />
      <MonacoEditor
        language={selectedLanguage}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
      />
      <CodeEditorFooter onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
