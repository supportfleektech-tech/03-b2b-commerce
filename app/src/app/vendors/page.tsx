import { prisma } from '@/lib/db';
import { CreateVendorForm } from './ui';

export const dynamic = 'force-dynamic';

export default async function VendorsPage() {
  const org = await prisma.organization.findFirst();
  const rows = org ? await prisma.vendor.findMany({ where: { organizationId: org.id }, orderBy: { createdAt: 'desc' } }) : [];
  return (
    <>
      <h1>Vendors</h1>
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Add vendor</h3>
        <CreateVendorForm />
      </div>
      <div className="card">
        <h3>All vendors</h3>
        <table>
          <thead><tr><th>Name</th><th>Contact</th><th>Phone</th><th>Terms</th></tr></thead>
          <tbody>
            {rows.map(v => <tr key={v.id}><td>{v.name}</td><td>{v.contact || '—'}</td><td>{v.phone || '—'}</td><td>{v.terms || '—'}</td></tr>)}
            {rows.length === 0 && <tr><td colSpan={4}>No vendors yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
