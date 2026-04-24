"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MdEditorComponent from "@/components/markdown/MdEditorComponent";
import { Plus, Trash2, Save } from "lucide-react";
import { ProblemSelectModel } from "@/schema/problem.schema";
import {
  getProblemByTitle,
  createProblem,
  updateProblem,
} from "@/repository/problem.repo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const judgeCaseSchema = z.object({
  input: z.string().min(1, "输入不能为空"),
  output: z.string().min(1, "输出不能为空"),
});

const judgeConfigSchema = z.object({
  timeLimit: z
    .number()
    .min(1, "时间限制必须大于0")
    .max(10000, "时间限制不能超过10000ms"),
  memoryLimit: z
    .number()
    .min(2, "内存限制不能低于2MB")
    .max(1024, "内存限制不能超过1024MB"),
});

const createProblemSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(512, "标题不能超过512个字符"),
  content: z.string().min(1, "题目内容不能为空"),
  tags: z.array(z.string()).optional(),
  answer: z.string().optional(),
  judgeCase: z.array(judgeCaseSchema).min(1, "至少需要一个测试用例"),
  judgeConfig: judgeConfigSchema,
});

type CreateProblemFormValues = z.infer<typeof createProblemSchema>;

interface JudgeCaseFieldProps {
  index: number;
  onRemove: () => void;
}

function JudgeCaseField({ index, onRemove }: JudgeCaseFieldProps) {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">测试用例 {index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          name={`judgeCase.${index}.input`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>输入</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="输入测试数据..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={`judgeCase.${index}.output`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>输出</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="期望输出..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

function TagsInput({ value, onChange }: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleAddTag = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入标签后按回车添加"
        />
        <Button type="button" variant="outline" onClick={handleAddTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface CreateProblemFormProps {
  initialValue?: Partial<ProblemSelectModel>;
  onSubmit?: (data: CreateProblemFormValues) => void;
  userId?: number;
}

export default function CreateProblemForm({
  initialValue,
  userId = 1,
}: CreateProblemFormProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState("");
  const [dialogDescription, setDialogDescription] = React.useState("");
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(
    null,
  );

  const form = useForm<CreateProblemFormValues>({
    resolver: zodResolver(createProblemSchema),
    defaultValues: {
      title: initialValue?.title || "",
      content: initialValue?.content || "",
      tags: initialValue?.tags || [],
      answer: initialValue?.answer || "",
      judgeCase: initialValue?.judgeCase || [{ input: "", output: "" }],
      judgeConfig: initialValue?.judgeConfig || {
        timeLimit: 1000,
        memoryLimit: 256,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "judgeCase",
  });

  React.useEffect(() => {
    if (initialValue) {
      form.reset({
        title: initialValue.title || "",
        content: initialValue.content || "",
        tags: initialValue.tags || [],
        answer: initialValue.answer || "",
        judgeCase: initialValue.judgeCase || [{ input: "", output: "" }],
        judgeConfig: initialValue.judgeConfig || {
          timeLimit: 1000,
          memoryLimit: 256,
        },
      });
    }
  }, [initialValue, form]);

  const handleFormSubmit = async (data: CreateProblemFormValues) => {
    const exist = await getProblemByTitle(data.title);

    if (exist) {
      setDialogTitle(`题目 "${data.title}" 已经存在`);
      setDialogDescription("是否要更新该题目？");
      setPendingAction(() => async () => {
        try {
          const result = await updateProblem(exist.id, data);
          if (result) {
            toast.success("题目更新成功");
          } else {
            toast.error("题目更新失败");
          }
        } catch (error) {
          toast.error("题目更新失败：" + error);
          console.error("Update error:", error);
        }
        setShowDialog(false);
      });
    } else {
      setDialogTitle(`确定要新增题目 "${data.title}" 吗？`);
      setDialogDescription("此操作将创建一个新的题目。");
      setPendingAction(() => async () => {
        try {
          const result = await createProblem({ ...data, userId } as any);
          if (result) {
            toast.success("题目创建成功");
            router.refresh(); 
          } else {
            toast.error("题目创建失败");
          }
        } catch (error) {
          toast.error("题目创建失败");
          console.error("Create error:", error);
        }
        setShowDialog(false);
      });
    }

    setShowDialog(true);
  };

  const handleConfirm = async () => {
    if (pendingAction) {
      await pendingAction();
    }
  };

  return (
    <div className="flex h-full min-h-0 min-w-[700px] flex-col rounded-2xl border bg-card shadow-sm">
      <div className="border-b px-6 py-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          {initialValue ? "编辑题目" : "创建题目"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          维护题目描述、官方题解、测试用例和判题配置。
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="mx-auto max-w-4xl space-y-6 px-6 py-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>题目标题</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入题目标题" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value || []}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <p className="text-[0.8rem] text-muted-foreground">
                      添加标签如：数组、动态规划、二叉树等
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>题目描述</FormLabel>
                    <FormControl>
                      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                        <MdEditorComponent
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>官方题解（可选）</FormLabel>
                    <FormControl>
                      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                        <MdEditorComponent
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <p className="text-[0.8rem] text-muted-foreground">
                      提供官方解题思路和代码示例
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">测试用例</h2>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <JudgeCaseField
                      key={field.id}
                      index={index}
                      onRemove={() => remove(index)}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ input: "", output: "" })}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    添加测试用例
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">判题配置</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="judgeConfig.timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>时间限制（毫秒）</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <p className="text-[0.8rem] text-muted-foreground">
                          程序运行的最大时间，单位：毫秒
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="judgeConfig.memoryLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>内存限制（MB）</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <p className="text-[0.8rem] text-muted-foreground">
                          程序运行的最大内存，单位：MB，最少 2MB
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline">
                  取消
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  保存题目
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
