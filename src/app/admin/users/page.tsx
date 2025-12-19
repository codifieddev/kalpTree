import { auth } from "@/auth";
import UsersPage from "@/components/admin/users/usercomp";

export default async function Users() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <UsersPage user={user} />
    </>
  );
}
