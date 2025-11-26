export default async function PageTemplate({ params }: any) {
  const param = await params;
  const res = await fetch(
    `http://localhost:55803/api/pages/6925423c6739374eadeb6da0`
  );
  const t = await res.json();

  const html = t.item.content;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
