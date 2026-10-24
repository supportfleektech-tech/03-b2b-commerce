'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreatePOButton(props: { vendors: { id: string; name: string }[]; orgId?: string }) {
  const [open, setOpen] = useState(false);
  const [vendorId, setVendorId] = useState(props.vendors[0]?.id || '');
  const [price, setPrice] = useState<number>(1000);
  const [qty, setQty] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <>
      <button className="ghost" onClick={() => setOpen(o => !o)}>{open ? 'Close' : 'New PO'}</button>
      {open && (
        <div style={{ marginTop: 12 }}>
          <form onSubmit={async e => {
            e.preventDefault();
            if (!vendorId) return;
            setLoading(true);
            const res = await fetch('/api/v1/purchase-orders', {
              method: 'POST',
              headers: { 'content-type': 'application/json', 'x-dev-user-email': 'buyer@demo.co.ke', 'x-org-id': '00000000-0000-0000-0000-000000000003' },
              body: JSON.stringify({ vendorId, items: [{ sku: 'SKU-DEMO', qty, unitPriceCents: price }] }),
            });
            setLoading(false);
            if (res.ok) { setOpen(false); router.refresh(); } else alert((await res.json()).error || 'failed');
          }}>
            <select value={vendorId} onChange={e => setVendorId(e.target.value)} required>
              {props.vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <input type="number" min={1} placeholder="Qty" value={qty} onChange={e => setQty(+e.target.value)} />
            <input type="number" min={0} placeholder="Unit price (cents)" value={price} onChange={e => setPrice(+e.target.value)} />
            <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create PO'}</button>
          </form>
        </div>
      )}
    </>
  );
}
