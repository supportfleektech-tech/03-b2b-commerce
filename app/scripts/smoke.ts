const base=process.env.APP_URL||'http://localhost:7312';const ORG='00000000-0000-0000-0000-000000000003';const EMAIL='buyer@demo.co.ke';
async function req(p,o={}){const r=await fetch(base+p,{...o,headers:{'content-type':'application/json','x-dev-user-email':EMAIL,'x-org-id':ORG,...(o.headers||{})}});return{status:r.status,json:await r.json().catch(()=>({}))};}
(async()=>{
  const t=async(n,fn)=>{try{await fn();console.log(`✅ ${n}`)}catch(e){console.log(`❌ ${n} — `+String(e))}};
  await t('health', async()=>{if((await req('/api/v1/health')).status!==200) throw new Error('bad');});
  await t('vendor→product→PO→approve', async()=>{
    const v=await req('/api/v1/vendors',{method:'POST',body:JSON.stringify({name:'Smoke V '+Date.now(),phone:'2547'})});
    if(v.status!==200) throw new Error('vendor failed');
    const vid=(v.json as any).data.id;
    const p=await req('/api/v1/products',{method:'POST',body:JSON.stringify({sku:'SKU-S2-'+Date.now(),name:'Smoke P',unitPriceCents:1000,quantityOnHand:1})});
    if(p.status!==200) throw new Error('product failed');
    const pid=(p.json as any).data.id;
    const po=await req('/api/v1/purchase-orders',{method:'POST',body:JSON.stringify({vendorId:vid,items:[{sku:(p.json as any).data.sku,qty:1,unitPriceCents:1000}]})});
    if(po.status!==200) throw new Error('po failed');
    const id=(po.json as any).data.id;
    const ap=await req(`/api/v1/purchase-orders/${id}/approve`,{method:'POST'});
    if(ap.status!==200) throw new Error('approve failed');
  });
})();
