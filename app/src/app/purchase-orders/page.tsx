import { prisma } from '@/lib/db';
import { CreatePOButton } from './ui';

export const dynamic = 'force-dynamic';

export default async function PurchaseOrdersPage() {
  const org = await prisma.organization.findFirst();
  const rows = org ? await prisma.purchaseOrder.findMany({
    where: { organizationId: org.id }, orderBy: { createdAt: 'desc' },
    include: { vendor: { select: { name: true } } },
  }) : [];
  const vendorsPromise = org ? prisma.vendor.findMany({ where: { organizationId: org.id }, orderBy: { name: 'asc' } }) : [];
  const vendors = await vendorsPromise;
  return (
    <>
      <h1>Purchase Orders</h1>
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>New purchase order</h3>
        <CreatePOButton vendors={vendors} orgId={org?.id} />
      </div>
      <div className="card">
        <h3>All POs</h3>
        <table>
          <thead><tr><th>#</th><th>Vendor</th><th>Status</th><th>Total</th></tr></thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id}>
                <td>{p.number}</td><td>{p.vendor.name}</td>
                <td><span className={`badge s-${p.status}`}>{p.status}</span></td>
                <td>KSh {(p.totalCents/100).toLocaleString('en-KE')}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4}>No purchase orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
