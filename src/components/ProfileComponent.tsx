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
  //TODO 完善头像上传功能
  //解决页面刷新后信息不会立即更新的问题
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
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-xl shadow-slate-200/70">
      <div className="p-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">个人资料</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            管理你的用户名、邮箱和头像信息
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* 头像上传 */}
          <div className="relative">
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer flex items-center justify-center h-24 w-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary transition-colors"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
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
          </div>

          {/* 用户信息表单 */}
          <div className="w-full space-y-4">
            <Form {...form}>
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="username">用户名</FormLabel>
                    <FormControl>
                      <Input id="username" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="email">邮箱</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
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
