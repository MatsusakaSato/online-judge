"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "@/components/editor/CodeEditor";
import MdViewComponent from "@/components/MdViewComponent";

export default function CodingPage() {
  const problemContent = `# A+B Problem (高精度进阶版)

## 题目描述
输入两个正整数 A 和 B，计算它们的和。
注意：A 和 B 的长度最多可达 10^5 位。

## 输入格式
输入共两行：
- 第一行：整数 A
- 第二行：整数 B

## 输出格式
输出一行，即 A + B 的值。

## 输入输出样例

### 样例输入
\`\`\`
123456789012345678901234567890
987654321098765432109876543210
\`\`\`

### 样例输出
\`\`\`
1111111110111111111011111111100
\`\`\`

## 数据范围
- 1 ≤ |A|, |B| ≤ 10^5
- A 和 B 均为非负整数
- 结果不超过 2 × 10^5 位

## 提示
由于 A 和 B 的长度可能超过普通整型变量的范围，需要使用**高精度加法**算法。

### 高精度加法步骤
1. 将两个数按位存储在数组中（低位在前）
2. 从低位开始逐位相加，处理进位
3. 输出结果时注意去掉前导零

### 示例代码 (C++)
\`\`\`cpp
#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

string addStrings(string num1, string num2) {
    string result;
    int carry = 0;
    int i = num1.size() - 1;
    int j = num2.size() - 1;
    
    while (i >= 0 || j >= 0 || carry > 0) {
        int digit1 = (i >= 0) ? num1[i--] - '0' : 0;
        int digit2 = (j >= 0) ? num2[j--] - '0' : 0;
        int sum = digit1 + digit2 + carry;
        carry = sum / 10;
        result.push_back((sum % 10) + '0');
    }
    
    reverse(result.begin(), result.end());
    return result;
}

int main() {
    string a, b;
    cin >> a >> b;
    cout << addStrings(a, b) << endl;
    return 0;
}
\`\`\`

## 注意事项
- 输入可能包含前导零
- 结果不应有前导零（除非结果为 0）
- 注意时间复杂度，应控制在 O(n) 以内
`;
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
          <MdViewComponent value={problemContent} />
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
