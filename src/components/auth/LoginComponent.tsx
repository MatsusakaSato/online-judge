"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { request } from "@/common/Request";
import { UserVO } from "@/types/vo.types";
import userStore from "@/store/user.store";

// 1. 定义表单验证规则（Zod Schema）
// 登录表单规则
const loginSchema = z.object({
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  password: z.string().min(6, { message: "密码至少6位" }),
});

// 注册表单规则
const registerSchema = z
  .object({
    email: z.email({ message: "请输入有效的邮箱地址" }),
    username: z
      .string()
      .min(3, { message: "用户名至少3位" })
      .max(20, { message: "用户名最多20位" }),
    password: z.string().min(6, { message: "密码至少6位" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"], // 错误提示定位到确认密码字段
  });

// 类型导出（TS类型提示）
type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function LoginRegisterForm() {
  const router = useRouter();
  const setUser = userStore((s) => s.setUser);

  // 2. 状态管理：密码显隐（登录+注册各一个）+ 当前 Tab（注册成功后切到登录）
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showRegisterPwd, setShowRegisterPwd] = useState(false);
  const [showRegisterConfirmPwd, setShowRegisterConfirmPwd] = useState(false);

  // 3. 初始化登录表单
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 4. 初始化注册表单
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 5. 表单提交处理
  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      const user = await request.post<UserVO>("/api/user/login", values);
      if (user) {
        setUser(user);
        toast.success("登录成功");
        router.push("/");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "登录失败，请重试");
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      await request.post<UserVO>("/api/user/register", values);
      toast.success("注册成功，请登录");
      setActiveTab("login");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "注册失败，请重试");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-8 p-6 bg-card rounded-lg shadow-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* 登录/注册标签切换 */}
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">登录</TabsTrigger>
          <TabsTrigger value="register">注册</TabsTrigger>
        </TabsList>

        {/* 登录表单 */}
        <TabsContent value="login">
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              {/* 邮箱输入框 */}
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="your@email.com"
                          type="email"
                          className="pl-8"
                          {...field}
                          id="login-email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 密码输入框（带显隐切换） */}
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="请输入密码"
                          type={showLoginPwd ? "text" : "password"}
                          className="pl-8 pr-10 text-base letter-spacing-[0.8px] font-sans py-2"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full w-10 p-0"
                          onClick={() => setShowLoginPwd(!showLoginPwd)}
                        >
                          {showLoginPwd ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 登录按钮 */}
              <Button type="submit" className="w-full mt-2">
                登录
              </Button>
            </form>
          </Form>
        </TabsContent>

        {/* 注册表单 */}
        <TabsContent value="register">
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-4"
            >
              {/* 邮箱 */}
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="your@email.com"
                          type="email"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 用户名 */}
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="请输入用户名"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 密码 */}
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="请输入密码"
                          type={showRegisterPwd ? "text" : "password"}
                          className="pl-8 pr-10 text-base letter-spacing-[0.8px] font-sans py-2"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full w-10 p-0"
                          onClick={() => setShowRegisterPwd(!showRegisterPwd)}
                        >
                          {showRegisterPwd ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 确认密码 */}
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>确认密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="请再次输入密码"
                          type={showRegisterConfirmPwd ? "text" : "password"}
                          className="pl-8 pr-10 text-base letter-spacing-[0.8px] font-sans py-2"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full w-10 p-0"
                          onClick={() =>
                            setShowRegisterConfirmPwd(!showRegisterConfirmPwd)
                          }
                        >
                          {showRegisterConfirmPwd ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 注册按钮 */}
              <Button type="submit" className="w-full mt-2">
                注册
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
