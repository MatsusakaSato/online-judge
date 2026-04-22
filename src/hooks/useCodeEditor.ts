import { useState, useEffect, useCallback } from "react";
import {
  Language,
  CodeEditorState,
  CodeEditorHandlers,
} from "@/types/codeEditor";
import { ResponseResult } from "@/common/ApiResponse";
import { SubmissionRecord } from "@/types/judge";
import {
  CODE_TEMPLATES,
  DEFAULT_LANGUAGE,
  MONACO_DIAGNOSTICS_OPTIONS,
} from "@/constants/codeEditor";
import { toast } from "sonner";

interface UseCodeEditorOptions {
  problemId: number;
  onSubmissionStart?: () => void;
  onSubmissionSettled?: () => void | Promise<void>;
}

export function useCodeEditor({
  problemId,
  onSubmissionStart,
  onSubmissionSettled,
}: UseCodeEditorOptions): CodeEditorState & CodeEditorHandlers {
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(DEFAULT_LANGUAGE);
  const [code, setCode] = useState<string>(CODE_TEMPLATES[DEFAULT_LANGUAGE]);
  const [editorMounted, setEditorMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditorChange = useCallback((value: string | undefined) => {
    setCode(value ?? "");
  }, []);

  const handleLanguageChange = useCallback((language: Language) => {
    setSelectedLanguage(language);
    setCode(CODE_TEMPLATES[language]);
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      toast.error("请先输入代码后再提交");
      return;
    }

    setIsSubmitting(true);
    onSubmissionStart?.();

    try {
      const response = await fetch(`/api/problems/${problemId}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: trimmedCode,
          language: selectedLanguage,
        }),
      });

      const result: ResponseResult<SubmissionRecord> = await response.json();

      if (!response.ok || result.code !== 0) {
        toast.error(result.msg || "提交失败，请稍后重试");
        return;
      }

      const judgeStatus = result.data?.judgeInfo.status || "提交成功";
      toast.success(`判题完成：${judgeStatus}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "提交失败，请稍后重试";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      await onSubmissionSettled?.();
    }
  }, [code, onSubmissionSettled, onSubmissionStart, problemId, selectedLanguage]);

  const handleEditorMount = useCallback((editor: any, monaco: any) => {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
      MONACO_DIAGNOSTICS_OPTIONS,
    );
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
      MONACO_DIAGNOSTICS_OPTIONS,
    );
    setEditorMounted(true);
  }, []);

  useEffect(() => {
    if (editorMounted) {
      window.dispatchEvent(new Event("resize"));
    }
  }, [editorMounted]);

  return {
    selectedLanguage,
    code,
    editorMounted,
    isSubmitting,
    handleEditorChange,
    handleLanguageChange,
    handleSubmit,
    handleEditorMount,
  };
}
