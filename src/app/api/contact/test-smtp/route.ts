import { NextRequest, NextResponse } from 'next/server';
import { testSmtp } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await testSmtp(body);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'SMTP test error' },
      { status: 500 }
    );
  }
}
