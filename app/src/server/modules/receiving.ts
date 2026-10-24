import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, HttpError, requireRole } from '@/server/modules/core';
import { mpesa } from '@/server/adapters/mpesa';

const Receive = z.object({ reference: z.string().optional(), items: z.array(z.object({ sku: z.string(), qty: z.number().int().positive() })).min(1) });
const Pay = z.object({ amountCents: z.number().int().positive(), reference: z.string().optional() });

export async function GET(req: NextRequest) {
  return handle(req, async (ctx) => prisma.purchaseOrder.findMany({ where: { organizationId: ctx.organizationId }, orderBy: { createdAt: 'desc' }, include: { vendor: { select: { name: true } } } }));
}

export async function POST(req: NextRequest) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const body = z.object({ vendorId: z.string().uuid(), items: z.array(z.object({ sku: z.string(), qty: z.number().int().positive(), unitPriceCents: z.number().int().nonnegative() })).min(1) }).parse(await req.json());
    const vendor = await prisma.vendor.findFirst({ where: { id: body.vendorId, organizationId: ctx.organizationId } });
    if (!vendor) throw new HttpError(404, 'vendor not found', 'NOT_FOUND');
    const total = body.items.reduce((s, i) => s + i.qty * i.unitPriceCents, 0);
    const count = await prisma.purchaseOrder.count({ where: { organizationId: ctx.organizationId } });
    const po = await prisma.purchaseOrder.create({
      data: { organizationId: ctx.organizationId, vendorId: body.vendorId, number: `PO-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`, items: body.items, totalCents: total },
    });
    await audit(ctx, 'po.create', 'purchase_order', po.id, { number: po.number });
    return po;
  });
}

export async function receive(req: NextRequest, id: string) {
  return handle(req, async (ctx) => {
    const po = await prisma.purchaseOrder.findFirst({ where: { id, organizationId: ctx.organizationId } });
    if (!po) throw new HttpError(404, 'not found', 'NOT_FOUND');
    const body = Receive.parse(await req.json());
    const updated = await prisma.purchaseOrder.update({ where: { id: po.id }, data: { status: 'RECEIVED', receivedAt: new Date() } });
    await audit(ctx, 'po.receive', 'purchase_order', po.id, { reference: body.reference });
    return updated;
  });
}

export async function settle(req: NextRequest, id: string) {
  return handle(req, async (ctx) => {
    const po = await prisma.purchaseOrder.findFirst({ where: { id, organizationId: ctx.organizationId } });
    if (!po) throw new HttpError(404, 'not found', 'NOT_FOUND');
    const body = Pay.parse(await req.json());
    if (body.amountCents >= po.totalCents) {
      const updated = await prisma.purchaseOrder.update({ where: { id: po.id }, data: { status: 'RECONCILED' } });
      await audit(ctx, 'po.settle', 'purchase_order', po.id, { amountCents: body.amountCents });
      return updated;
    }
    return po;
  });
}
