'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function CreateVendorForm() {
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [terms, setTerms] = useState('Net 30');
  const [loading, setLoading] = useState(false); const router = useRouter();
  return (
    <form onSubmit={async e => {
      e.preventDefault();
      setLoading(true);
      const res = await fetch('/api/v1/vendors', { method: 'POST', headers: { 'content-type': 'application/json', 'x-dev-user-email': 'buyer@demo.co.ke', 'x-org-id': '00000000-0000-0000-0000-000000000003' }, body: JSON.stringify({ name, phone, terms }) });
      setLoading(false);
      if (res.ok) { setName(''); setPhone(''); router.refresh(); }
      else alert('failed');
    }}>
      <input placeholder="Vendor name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
      <select value={terms} onChange={e => setTerms(e.target.value)}>
        <option>Net 30</option><option>Net 14</option><option>Net 60</option><option>Due on receipt</option>
      </select>
      <button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Add vendor'}</button>
    </form>
  );
}
