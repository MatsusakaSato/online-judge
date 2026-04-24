"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { updateUserInfoAction } from "@/action/user.action";
import { useRouter } from "next/navigation";
import { UserSelectModel } from "@/schema/user.schema";
import { Mail, Shield, Sparkles, Upload, UserRound } from "lucide-react";

interface ProfileProps {
  user: Partial<UserSelectModel>;
}

const ProfileComponent = ({ user }: ProfileProps) => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      username: user.username,
      email: user.email,
    },
  });

  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const displayName = user.username || "未命名用户";
  const roleText = user.role === "admin" ? "管理员" : "普通用户";

  // TODO 完善头像上传功能
  // 解决页面刷新后信息不会立即更新的问题
  const handleUpdateUserInfo = async () => {
    const formData = form.getValues();
    const userDTO = {
      username: formData.username,
      email: formData.email,
      id: user.id,
    };
    await updateUserInfoAction(userDTO);
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border bg-card shadow-lg">
      <div className="relative overflow-hidden border-b bg-muted/40 px-6 py-5">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute bottom-0 right-12 h-20 w-20 rounded-full bg-accent blur-xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <label
                htmlFor="avatar-upload"
                className="group flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border bg-background shadow-sm transition hover:bg-accent"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
                    <Upload className="mb-1.5 h-5 w-5 transition group-hover:-translate-y-0.5" />
                    <span>上传头像</span>
                  </div>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setAvatarPreview(event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <div className="absolute -bottom-1.5 -right-1.5 rounded-full border-4 border-card bg-primary p-1" />
            </div>

            <div>
              <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Online Judge Profile
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {displayName}
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                管理你的账户资料，保持联系信息准确，获得更好的平台使用体验。
              </p>
            </div>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2 md:w-64 md:grid-cols-1">
            <div className="rounded-xl border bg-background px-3 py-2 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                当前身份
              </div>
              <div className="mt-1 font-medium">{roleText}</div>
            </div>
            <div className="rounded-xl border bg-background px-3 py-2 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                绑定邮箱
              </div>
              <div className="mt-1 truncate font-medium">
                {user.email || "暂未设置"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[220px_1fr]">
        <div className="space-y-3">
          <div className="rounded-2xl border bg-muted/30 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-semibold">账户信息</h3>
            <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
              用户名会展示在页面顶部；邮箱用于身份识别和后续通知扩展。
            </p>
          </div>

          <div className="rounded-2xl border border-dashed bg-background p-4 text-sm leading-5 text-muted-foreground">
            头像目前仅支持本地预览，保存资料时不会上传头像文件。
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">编辑资料</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              修改后点击保存即可更新你的个人信息。
            </p>
          </div>

          <div className="w-full space-y-3">
            <Form {...form}>
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel htmlFor="username">用户名</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="username" {...field} className="w-full pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel htmlFor="email">邮箱</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          {...field}
                          className="w-full pl-9"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-2 w-full"
                onClick={handleUpdateUserInfo}
              >
                保存修改
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
