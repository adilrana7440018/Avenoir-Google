import { NextResponse } from 'next/server';
import { getAdminData } from '@/app/actions/admin';

export async function GET() {
  try {
    const data = await getAdminData();
    if (!data) {
      return NextResponse.json({ error: 'Failed to retrieve admin manifest' }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Admin Data Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
