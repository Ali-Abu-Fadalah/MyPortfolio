import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  
  // A simple hardcoded fallback secret for easy manual refreshing, 
  // or use an environment variable for secure webhooks.
  if (secret !== process.env.REVALIDATE_SECRET && secret !== 'clear-cache-now') {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
  
  try {
    // This purges the Next.js Data Router Cache for the entire site
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.secret !== process.env.REVALIDATE_SECRET && body.secret !== 'clear-cache-now') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
