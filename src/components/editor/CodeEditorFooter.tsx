import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";

interface CodeEditorFooterProps {
  onAnalyze: () => Promise<void>;
  onSubmit: () => Promise<void>;
  isAnalyzing: boolean;
  isSubmitting: boolean;
}

export function CodeEditorFooter({
  onAnalyze,
  onSubmit,
  isAnalyzing,
  isSubmitting,
}: CodeEditorFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 px-4 py-3 border-t bg-white">
      <Button
        onClick={() => void onAnalyze()}
        className="gap-2"
        disabled={isSubmitting || isAnalyzing}
      >
        <Sparkles className="h-4 w-4" />
        {isAnalyzing ? "分析中..." : "AI 分析"}
      </Button>
      <Button
        onClick={() => void onSubmit()}
        className="gap-2"
        variant="outline"
        disabled={isSubmitting || isAnalyzing}
      >
        <Play className="h-4 w-4" />
        {isSubmitting ? "判题中..." : "提交代码"}
      </Button>
    </div>
  );
}
