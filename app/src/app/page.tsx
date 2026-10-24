import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const org = await prisma.organization.findFirst();
  let stats = { vendors: 0, products: 0, openPOs: 0, openValueCents: 0 };
  let recent: { id: string; number: string; status: string; totalCents: number; vendor: { name: string } }[] = [];
  if (org) {
    const [vendors, products, openPOs, openAgg, rec] = await Promise.all([
      prisma.vendor.count({ where: { organizationId: org.id } }),
      prisma.product.count({ where: { organizationId: org.id } }),
      prisma.purchaseOrder.count({ where: { organizationId: org.id, status: { in: ['DRAFT','SENT','APPROVED'] } } }),
      prisma.purchaseOrder.aggregate({ where: { organizationId: org.id, status: { in: ['DRAFT','SENT','APPROVED'] } }, _sum: { totalCents: true } }),
      prisma.purchaseOrder.findMany({
        where: { organizationId: org.id }, orderBy: { createdAt: 'desc' }, take: 5,
        include: { vendor: { select: { name: true } } },
      }),
    ]);
    stats = { vendors, products, openPOs, openValueCents: openAgg._sum.totalCents || 0 };
    recent = rec;
  }
  const ksh = (c: number) => `KSh ${(c/100).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
  return (
    <>
      <h1>Dashboard</h1>
      {!org && <div className="card">No organization yet. Seed via seed script.</div>}
      {org && <>
        <div className="grid">
          <div className="card"><h3>Vendors</h3><div className="big">{stats.vendors}</div></div>
          <div className="card"><h3>Products</h3><div className="big">{stats.products}</div></div>
          <div className="card"><h3>Open PO Value</h3><div className="big">{ksh(stats.openValueCents)}</div></div>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Recent purchase orders</h3>
          <table>
            <thead><tr><th>#</th><th>Vendor</th><th>Status</th><th>Total</th></tr></thead>
            <tbody>
              {recent.map(p => (
                <tr key={p.id}><td>{p.number}</td><td>{p.vendor.name}</td>
                  <td><span className={`badge s-${p.status}`}>{p.status}</span></td><td>{ksh(p.totalCents)}</td></tr>
              ))}
              {recent.length === 0 && <tr><td colSpan={4}>No purchase orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </>}
    </>
  );
}
