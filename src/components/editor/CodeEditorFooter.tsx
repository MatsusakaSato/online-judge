import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface CodeEditorFooterProps {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export function CodeEditorFooter({
  onSubmit,
  isSubmitting,
}: CodeEditorFooterProps) {
  return (
    <div className="flex items-center justify-end px-4 py-3 border-t bg-white">
      <Button
        onClick={() => void onSubmit()}
        className="gap-2"
        variant="outline"
        disabled={isSubmitting}
      >
        <Play className="h-4 w-4" />
        {isSubmitting ? "判题中..." : "提交代码"}
      </Button>
    </div>
  );
}
