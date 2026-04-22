"use client";

import { CodeEditorHeader } from "@/components/editor/CodeEditorHeader";
import { CodeEditorFooter } from "@/components/editor/CodeEditorFooter";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { useCodeEditor } from "@/hooks/useCodeEditor";
import { LANGUAGE_OPTIONS } from "@/constants/codeEditor";
import { CodeAnalysisReport } from "@/types/problemAnalysis";

interface CodeEditorProps {
  problemId: number;
  onSubmissionStart?: () => void;
  onSubmissionSettled?: () => void | Promise<void>;
  onAnalysisStart?: () => void;
  onAnalysisComplete?: (
    report: CodeAnalysisReport,
  ) => void | Promise<void>;
  onAnalysisError?: (message: string) => void | Promise<void>;
}

export default function CodeEditor({
  problemId,
  onSubmissionStart,
  onSubmissionSettled,
  onAnalysisStart,
  onAnalysisComplete,
  onAnalysisError,
}: CodeEditorProps) {
  const {
    selectedLanguage,
    code,
    isSubmitting,
    isAnalyzing,
    handleEditorChange,
    handleLanguageChange,
    handleSubmit,
    handleAnalyze,
    handleEditorMount,
  } = useCodeEditor({
    problemId,
    onSubmissionStart,
    onSubmissionSettled,
    onAnalysisStart,
    onAnalysisComplete,
    onAnalysisError,
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
      <CodeEditorFooter
        onAnalyze={handleAnalyze}
        onSubmit={handleSubmit}
        isAnalyzing={isAnalyzing}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
