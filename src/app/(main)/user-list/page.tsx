import UserListClient from "@/components/user-list/UserListClient";
import { getUsers, getUsersCount } from "@/repository/user.repo";

const PAGE_SIZE = 20;

export default async function UserListPage() {
  const initialData = await getUsers(PAGE_SIZE, 0);
  const total = await getUsersCount();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-2xl border bg-card px-6 py-5 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">用户列表</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          管理平台用户与角色信息。
        </p>
      </div>
      <UserListClient initialData={initialData} total={total} />
    </div>
  );
}
