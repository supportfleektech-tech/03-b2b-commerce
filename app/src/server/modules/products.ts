import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, requireRole } from '@/server/modules/core';

const Create = z.object({ sku: z.string().min(1), name: z.string().min(1), unitPriceCents: z.number().int().nonnegative(), quantityOnHand: z.number().int().nonnegative().default(0), currency: z.string().default('KES') });

export async function GET(req: NextRequest) {
  return handle(req, async (ctx) => prisma.product.findMany({ where: { organizationId: ctx.organizationId }, orderBy: { name: 'asc' } }));
}
export async function POST(req: NextRequest) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const body = Create.parse(await req.json());
    const p = await prisma.product.create({ data: { ...body, organizationId: ctx.organizationId } });
    await audit(ctx, 'product.create', 'product', p.id, { sku: p.sku });
    return p;
  });
}
