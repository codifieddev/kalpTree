import { auth } from "@/auth";

export default async function BusinesswithID({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const param = await params;

  const session = await auth();
  const user = session?.user;
  let id = param.id;
  const tenant = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tenants/singletenant/${id}`
  );
  const resultTenant = await tenant.json();

  return <div className="space-y-6">Here Single Business</div>;
}
