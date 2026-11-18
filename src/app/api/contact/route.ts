import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendContactNotification } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    // 1. Store in Supabase database messages table
    let dbError = null;
    try {
      const { error } = await supabase.from('messages').insert([
        {
          name: cleanName,
          email: cleanEmail,
          message: cleanMessage,
        },
      ]);
      if (error) {
        dbError = error.message;
        console.warn('Supabase insert message error:', error.message);
      }
    } catch (err: any) {
      dbError = err.message;
      console.warn('Supabase DB error:', err);
    }

    // 2. Send email notification via SMTP (if configured)
    const mailResult = await sendContactNotification({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });

    return NextResponse.json({
      success: true,
      message: 'Message received successfully!',
      emailSent: mailResult.success,
      emailError: mailResult.error || null,
      dbSaved: !dbError,
    });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
