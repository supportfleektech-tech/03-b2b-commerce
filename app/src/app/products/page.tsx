import { prisma } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function Page() {
  const org = await prisma.organization.findFirst();
  const rows = org ? await prisma.product.findMany({ where: { organizationId: org.id }, orderBy: { name: 'asc' } }) : [];
  const ksh = (c: number) => `KSh ${(c/100).toLocaleString('en-KE')}`;
  return (<><h1>Products</h1><div className="card"><table>
    <thead><tr><th>SKU</th><th>Name</th><th>Unit price</th><th>On hand</th></tr></thead>
    <tbody>
      {rows.map(p => <tr key={p.id}><td>{p.sku}</td><td>{p.name}</td><td>{ksh(p.unitPriceCents)}</td><td>{p.quantityOnHand}</td></tr>)}
      {rows.length === 0 && <tr><td colSpan={4}>No products yet.</td></tr>}
    </tbody>
  </table></div></>);
}
