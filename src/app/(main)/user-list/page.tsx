import UserListClient from "@/components/user-list/UserListClient";
import { getUsers, getUsersCount } from "@/repository/user.repo";

const PAGE_SIZE = 20;

export default async function UserListPage() {
  const initialData = await getUsers(PAGE_SIZE, 0);
  const total = await getUsersCount();

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <UserListClient initialData={initialData} total={total} />
    </div>
  );
}
