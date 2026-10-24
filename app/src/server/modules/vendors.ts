import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, requireRole } from '@/server/modules/core';

const Create = z.object({ name: z.string().min(1), contact: z.string().optional(), phone: z.string().optional(), email: z.string().email().optional(), terms: z.string().optional() });

export async function GET(req: NextRequest) {
  return handle(req, async (ctx) => prisma.vendor.findMany({ where: { organizationId: ctx.organizationId }, orderBy: { createdAt: 'desc' } }));
}
export async function POST(req: NextRequest) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const body = Create.parse(await req.json());
    const v = await prisma.vendor.create({ data: { ...body, organizationId: ctx.organizationId } });
    await audit(ctx, 'vendor.create', 'vendor', v.id, { name: v.name });
    return v;
  });
}
