import { auth } from "@/auth";

export default async function BusinesswithID({ params }: { params: {
    id: string
} }) {
  const param = await params;

  const session = await auth();
  const user = session?.user;


  return <div className="space-y-6">Here Single Business</div>;
}
