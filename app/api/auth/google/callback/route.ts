import { oauth2Client, saveRefreshToken } from '@/lib/googleDrive';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    if (tokens.refresh_token) {
      await saveRefreshToken(tokens.refresh_token);
      return NextResponse.redirect(new URL('/dashboard/admin?google_auth=success', req.url));
    } else {
      // If we don't get a refresh token, it means the user was already authenticated.
      // Since we used prompt: 'consent', we should usually get it.
      return NextResponse.redirect(new URL('/dashboard/admin?google_auth=error', req.url));
    }
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.redirect(new URL('/dashboard/admin?google_auth=failed', req.url));
  }
}
