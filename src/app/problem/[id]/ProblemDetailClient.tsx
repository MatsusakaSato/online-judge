"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "@/components/editor/CodeEditor";
import MdViewComponent from "@/components/markdown/MdViewComponent";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ProblemDetailClientProps {
  content: string;
}

export default function ProblemDetailClient({
  content,
}: ProblemDetailClientProps) {
  return (
    <div className="h-screen bg-muted p-4">
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-full border-collapse"
      >
        <ResizablePanel
          defaultSize="50%"
          className="rounded-xl bg-card shadow-lg overflow-hidden"
        >
          <Tabs defaultValue="detail" className="h-full">
            <div className="flex items-center justify-between px-4 py-1 border-b bg-white">
              <TabsList>
                <TabsTrigger value="detail">题目详情</TabsTrigger>
                <TabsTrigger value="solution">查看题解</TabsTrigger>
                <TabsTrigger value="submission">提交记录</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="detail"
              className="h-[calc(100%-64px)] p-4 overflow-auto"
            >
              <MdViewComponent value={content} />
            </TabsContent>
            <TabsContent
              value="solution"
              className="h-[calc(100%-64px)] p-4 overflow-auto"
            >
              <div className="text-center text-muted-foreground py-8">
                题解内容将在此显示
              </div>
            </TabsContent>
            <TabsContent
              value="submission"
              className="h-[calc(100%-64px)] p-4 overflow-auto"
            >
              <div className="text-center text-muted-foreground py-8">
                提交记录将在此显示
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-transparent" />
        <ResizablePanel
          defaultSize="50%"
          className="rounded-xl bg-card shadow-lg overflow-hidden"
        >
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
