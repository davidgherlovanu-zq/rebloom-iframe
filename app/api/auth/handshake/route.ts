import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const chatHomeUrl = new URL("/", request.url);

  if (!token) {
    return NextResponse.redirect(chatHomeUrl);
  }

  try {
    const res = await fetch(
      "https://rebloom-27190.bubbleapps.io/version-23ez9/api/1.1/wf/verify_iframe",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (data?.response?.user_id) {
      const cookieStore = await cookies();

      // Package all Bubble data
      const userData = {
        id: data.response.user_id,
        email: data.response.email,
        name: data.response.name
      };

      cookieStore.set('chat_session', JSON.stringify(userData), {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }


  } catch (err) {
    console.error("Bubble handshake failed:", err);
  }

  return NextResponse.redirect(chatHomeUrl);
}
