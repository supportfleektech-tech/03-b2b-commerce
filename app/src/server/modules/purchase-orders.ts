import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, HttpError, requireRole } from '@/server/modules/core';

const Item = z.object({ sku: z.string().min(1), qty: z.number().int().positive(), unitPriceCents: z.number().int().nonnegative() });
const CreatePO = z.object({
  vendorId: z.string().uuid(),
  items: z.array(Item).min(1),
  expectedAt: z.string().datetime().optional(),
  currency: z.string().default('KES'),
});

function total(items: z.infer<typeof Item>[]) { return items.reduce((s, i) => s + i.qty * i.unitPriceCents, 0); }
async function nextNumber(orgId: string) {
  const c = await prisma.purchaseOrder.count({ where: { organizationId: orgId } });
  return `PO-${new Date().getFullYear()}-${String(c + 1).padStart(5, '0')}`;
}

export async function GET(req: NextRequest) {
  return handle(req, async (ctx) => prisma.purchaseOrder.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { createdAt: 'desc' }, take: 100,
    include: { vendor: { select: { name: true } } },
  }));
}

export async function POST(req: NextRequest) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const body = CreatePO.parse(await req.json());
    const vendor = await prisma.vendor.findFirst({ where: { id: body.vendorId, organizationId: ctx.organizationId } });
    if (!vendor) throw new HttpError(404, 'vendor not found', 'NOT_FOUND');
    const po = await prisma.purchaseOrder.create({
      data: {
        organizationId: ctx.organizationId, vendorId: body.vendorId,
        number: await nextNumber(ctx.organizationId),
        items: body.items, totalCents: total(body.items), currency: body.currency,
        expectedAt: body.expectedAt ? new Date(body.expectedAt) : undefined,
      },
    });
    await audit(ctx, 'po.create', 'purchase_order', po.id, { number: po.number });
    return po;
  });
}

export async function approve(req: NextRequest, id: string) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN');
    const po = await prisma.purchaseOrder.findFirst({ where: { id, organizationId: ctx.organizationId } });
    if (!po) throw new HttpError(404, 'po not found', 'NOT_FOUND');
    if (po.status !== 'DRAFT' && po.status !== 'SENT') throw new HttpError(409, 'po not approvable', 'BAD_STATE');
    const updated = await prisma.purchaseOrder.update({ where: { id: po.id }, data: { status: 'APPROVED' } });
    await audit(ctx, 'po.approve', 'purchase_order', po.id, { number: po.number });
    return updated;
  });
}
