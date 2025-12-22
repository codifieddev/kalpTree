import { auth } from "@/auth";
import CreateUserForm from "@/components/admin/users/CreateUserForm";

export default async function Users() {
  const session = await auth();
  const user = session?.user;

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/roles`)
  const roles = await res.json()

  return (
    <>
      <CreateUserForm user={user} roles={roles} />
    </>
  );
}
