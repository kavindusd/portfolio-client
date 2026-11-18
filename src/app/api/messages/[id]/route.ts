import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// DELETE /api/messages/[id] - Delete a message from Supabase
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, message: 'Message deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/messages/[id] - Mark message as read/unread in Supabase
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const read = body.read !== undefined ? Boolean(body.read) : true;

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      const { error } = await supabase.from('messages').update({ read }).eq('id', id);
      if (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, read }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating message:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
