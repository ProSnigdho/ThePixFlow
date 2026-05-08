import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * PRODUCTION ANALYTICS SYNC (30-DAY DEEP SCAN)
 * Fetches:
 * 1. Profile Metrics (Followers, Media Count)
 * 2. 30-Day Insights (Impressions, Reach)
 * 3. Latest Media performance
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const userSnap = await getDoc(doc(db, "users", userId));
    if (!userSnap.exists()) throw new Error("User not found");
    
    const userData = userSnap.data();
    const ig = userData.instagram;

    // Support for Manual Tester Token or Prod Token
    const accessToken = ig?.accessToken || process.env.TEST_IG_TOKEN;
    const accountId = ig?.accountId;

    if (!accessToken) return NextResponse.json({ connected: false });

    // 1. Basic Profile & Followers
    let profileData: any = {};
    if (accountId) {
      const pRes = await fetch(`https://graph.facebook.com/v19.0/${accountId}?fields=followers_count,media_count,username,profile_picture_url&access_token=${accessToken}`);
      profileData = await pRes.json();
    } else {
      const pRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=username&access_token=${accessToken}`);
      profileData = await pRes.json();
    }

    if (profileData.error) throw new Error(profileData.error.message);

    // 2. 30-Day Insights (Only for Business Accounts with ID)
    let insights30d = { impressions: 0, reach: 0 };
    if (accountId) {
      const now = Math.floor(Date.now() / 1000);
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
      
      const insightsRes = await fetch(
        `https://graph.facebook.com/v19.0/${accountId}/insights?metric=impressions,reach&period=day&since=${thirtyDaysAgo}&until=${now}&access_token=${accessToken}`
      );
      const insightsData = await insightsRes.json();
      
      if (insightsData.data) {
        insights30d.impressions = insightsData.data.find((i: any) => i.name === 'impressions')?.values.reduce((a: any, b: any) => a + b.value, 0) || 0;
        insights30d.reach = insightsData.data.find((i: any) => i.name === 'reach')?.values.reduce((a: any, b: any) => a + b.value, 0) || 0;
      }
    }

    // 3. Latest Media Performance
    let latestPosts = [];
    if (accountId) {
      const mediaRes = await fetch(
        `https://graph.facebook.com/v19.0/${accountId}/media?fields=id,caption,media_type,media_url,like_count,comments_count,timestamp,insights.metric(reach,impressions)&limit=5&access_token=${accessToken}`
      );
      const mediaData = await mediaRes.json();
      latestPosts = mediaData.data?.map((m: any) => ({
        id: m.id,
        type: m.media_type,
        url: m.media_url,
        likes: m.like_count,
        comments: m.comments_count,
        reach: m.insights?.data?.find((i: any) => i.name === 'reach')?.values[0]?.value || 0,
        timestamp: m.timestamp
      })) || [];
    }

    // 4. Update Firestore
    const analyticsUpdate = {
      username: profileData.username,
      followers: profileData.followers_count || 0,
      mediaCount: profileData.media_count || 0,
      profilePicture: profileData.profile_picture_url || null,
      insights30d,
      latestPosts,
      lastSyncedAt: serverTimestamp()
    };

    await updateDoc(doc(db, "users", userId), {
      instagramAnalytics: analyticsUpdate
    });

    return NextResponse.json({ connected: true, data: analyticsUpdate });

  } catch (error: any) {
    console.error("SYNC FAIL:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
