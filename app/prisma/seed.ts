import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const org = await prisma.organization.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: { id: '00000000-0000-0000-0000-000000000003', name: 'Demo Wholesale Co', kraPin: 'P000111222B' },
  });
  const user = await prisma.user.upsert({
    where: { email: 'buyer@demo.co.ke' }, update: {},
    create: { email: 'buyer@demo.co.ke', name: 'Head Buyer' },
  });
  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
    update: { role: 'OWNER' },
    create: { userId: user.id, organizationId: org.id, role: 'OWNER' },
  });
  const vendor = await prisma.vendor.create({ data: { organizationId: org.id, name: 'Nairobi Traders', phone: '254700123123', terms: 'Net 30' } });
  const p1 = await prisma.product.create({ data: { organizationId: org.id, sku: 'SKU-001', name: 'Rice 25kg', unitPriceCents: 220000, quantityOnHand: 30 } });
  const p2 = await prisma.product.create({ data: { organizationId: org.id, sku: 'SKU-002', name: 'Cooking Oil 20L', unitPriceCents: 480000, quantityOnHand: 12 } });
  await prisma.purchaseOrder.create({
    data: {
      organizationId: org.id, vendorId: vendor.id,
      number: 'PO-2026-00001',
      items: [
        { sku: p1.sku, qty: 20, unitPriceCents: p1.unitPriceCents },
        { sku: p2.sku, qty: 5, unitPriceCents: p2.unitPriceCents },
      ],
      totalCents: 20 * p1.unitPriceCents + 5 * p2.unitPriceCents,
      status: 'DRAFT',
    },
  });
  console.log('seeded', { org: org.id, user: user.email });
}
main().finally(() => prisma.$disconnect());
