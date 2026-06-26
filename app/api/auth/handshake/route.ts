import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeToken(token: string) {
  return `${token.slice(0, 6)}...${token.slice(-6)}`;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const chatHomeUrl = new URL("/", request.url);

  console.log("[handshake] started");
  console.log("[handshake] request url:", request.url);
  console.log("[handshake] has token:", Boolean(token));

  if (!token) {
    console.log("[handshake] missing token");
    return NextResponse.redirect(new URL("/?auth=missing_token", request.url));
  }

  console.log("[handshake] token preview:", safeToken(token));

  try {
    const bubbleUrl = new URL(
      "https://rebloom-27190.bubbleapps.io/version-23ez9/api/1.1/wf/verify_iframe",
    );

    bubbleUrl.searchParams.set("token", token);

    console.log("[handshake] calling Bubble:", bubbleUrl.toString());

    const bubbleRes = await fetch(bubbleUrl.toString(), {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const raw = await bubbleRes.text();

    console.log("[handshake] Bubble status:", bubbleRes.status);
    console.log("[handshake] Bubble ok:", bubbleRes.ok);
    console.log("[handshake] Bubble content-type:", bubbleRes.headers.get("content-type"));
    console.log("[handshake] Bubble raw:", raw.slice(0, 1500));

    let data: any;

    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("[handshake] Bubble returned non-JSON:", err);
      return NextResponse.redirect(new URL("/?auth=bad_json", request.url));
    }

    console.log("[handshake] Bubble parsed:", JSON.stringify(data, null, 2));

    const user = data?.response ?? data;

    if (!bubbleRes.ok) {
      console.error("[handshake] Bubble response not OK");
      return NextResponse.redirect(new URL("/?auth=bubble_not_ok", request.url));
    }

    if (!user?.user_id) {
      console.error("[handshake] no user_id in Bubble response");
      return NextResponse.redirect(new URL("/?auth=no_user", request.url));
    }

    const userData = {
      id: user.user_id,
      email: user.email ?? null,
      name: user.name ?? null,
    };

    console.log("[handshake] verified user:", userData);

    const redirect = NextResponse.redirect(chatHomeUrl);

    redirect.cookies.set("chat_session", JSON.stringify(userData), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("[handshake] cookie set");
    console.log("[handshake] redirecting to:", chatHomeUrl.toString());

    return redirect;
  } catch (err) {
    console.error("[handshake] failed:", err);
    return NextResponse.redirect(new URL("/?auth=error", request.url));
  }
}
