import VerifyUserComp from "@/components/admin/accountsharing/grantaccess/verifyuser";

export default async function VerifyUser({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const id = sp?.id;

  return (
    <>
      <VerifyUserComp userid={id} />
    </>
  );
}
