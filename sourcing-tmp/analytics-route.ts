import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error';
import { requireAuth } from '@/lib/api-middleware';
import { getAnalytics } from '@/lib/sourcing-db';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const session = auth.session;
    const url = new URL(req.url);
    const period = url.searchParams.get('period') || '30d';

    const data = await getAnalytics(period, session.role === 'admin', session.id);

    return NextResponse.json({ ok: true, period, data });
  } catch (err: unknown) {
    const { message, status } = handleApiError(err, 'GET /api/analytics');
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
