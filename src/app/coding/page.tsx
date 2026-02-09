"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "@/components/editor/CodeEditor";
import MdViewComponent from "@/components/MdViewComponent";

export default function CodingPage() {
  const problemContent = `# [模板] A+B Problem (高精度进阶版)

## 题目描述
输入两个正整数 $A$ 和 $B$，计算它们的和。
注意：$A$ 和 $B$ 的长度最多可达 $10^5$ 位。

## 输入格式
... (此处省略部分内容内容)

### 示例代码 (C++)
\`\`\`cpp
#include <iostream>
int main() {
    return 0;
}
\`\`\` `;
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
          {/* <MdViewComponent value={problemContent} /> */}
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
