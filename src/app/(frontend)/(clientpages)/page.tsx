import PageTemplate from "./[...slug]/page";

export default async function Page({ params }: any) {

  return <PageTemplate params={params} />;
}
