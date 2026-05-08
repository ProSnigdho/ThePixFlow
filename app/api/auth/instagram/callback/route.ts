import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * PRODUCTION INSTAGRAM AUTH HANDLER
 * 1. Exchanges 'code' for short-lived token.
 * 2. Exchanges short-lived for long-lived token (60 days).
 * 3. Identifies the connected Instagram Business Account ID.
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("state"); // UID passed from client

  if (!code || !userId) {
    return NextResponse.redirect(new URL("/dashboard/client?error=missing_params", req.url));
  }

  const APP_ID = process.env.NEXT_PUBLIC_META_APP_ID;
  const APP_SECRET = process.env.META_APP_SECRET;
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/instagram/callback`;

  try {
    // STEP 1: Exchange code for Short-Lived User Access Token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&client_secret=${APP_SECRET}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.error) throw new Error(tokenData.error.message);
    const userAccessToken = tokenData.access_token;

    // STEP 2: Exchange for Long-Lived Access Token (60 Days)
    const longTokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${userAccessToken}`;
    const longTokenRes = await fetch(longTokenUrl);
    const longTokenData = await longTokenRes.json();
    const longLivedToken = longTokenData.access_token;

    // STEP 3: Identify the Instagram Business Account linked to the user's Facebook Pages
    // 3a. Get Facebook Pages
    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${longLivedToken}`);
    const pagesData = await pagesRes.json();
    
    if (!pagesData.data || pagesData.data.length === 0) {
      throw new Error("No Facebook Pages found linked to this account.");
    }

    // 3b. Find the first Page that has an Instagram Business Account
    let instagramBusinessId = null;
    let linkedPageId = null;

    for (const page of pagesData.data) {
      const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${longLivedToken}`);
      const igData = await igRes.json();
      if (igData.instagram_business_account) {
        instagramBusinessId = igData.instagram_business_account.id;
        linkedPageId = page.id;
        break;
      }
    }

    if (!instagramBusinessId) {
      throw new Error("No Instagram Business Account linked to your Facebook Pages.");
    }

    // STEP 4: Store credentials in Firestore
    await updateDoc(doc(db, "users", userId), {
      instagram: {
        accessToken: longLivedToken,
        accountId: instagramBusinessId,
        pageId: linkedPageId,
        connectedAt: serverTimestamp(),
        tokenExpiresAt: Date.now() + (60 * 24 * 60 * 60 * 1000),
        isValid: true
      }
    });

    return NextResponse.redirect(new URL("/dashboard/client?auth=success", req.url));

  } catch (error: any) {
    console.error("CRITICAL AUTH FAIL:", error);
    return NextResponse.redirect(new URL(`/dashboard/client?error=${encodeURIComponent(error.message)}`, req.url));
  }
}
