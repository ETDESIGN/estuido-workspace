import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session-cookie';
import { updateQuote } from '@/lib/sourcing-db';
import { handleApiError } from '@/lib/api-error';
import { requireAuthAndCsrf } from '@/lib/api-middleware';

// PATCH /api/quotes/[id] — update quote
// Admin: full update. Customer: accept/reject only.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuthAndCsrf(req);
    if (auth instanceof NextResponse) return auth;

    const session = auth.session;
    const { id } = await params;
    const body = await req.json();

    // Customers can only accept or reject quotes
    if (session.role === 'customer') {
      const { status } = body;
      if (!['accepted', 'rejected'].includes(status)) {
        return NextResponse.json({ ok: false, error: 'Customers can only accept or reject quotes' }, { status: 400 });
      }
    }

    await updateQuote(id, body, session.id);
    return NextResponse.json({ ok: true, message: 'Quote updated' });
  } catch (err: unknown) {
    const { message, status } = handleApiError(err, 'PATCH /api/quotes/[id]');
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
