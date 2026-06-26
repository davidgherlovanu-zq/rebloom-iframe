import { cookies } from "next/headers";

type ChatSession = {
  id?: string;
  email?: string;
  name?: string;
};

function parseSession(value: string): ChatSession | null {
  try {
    return JSON.parse(value) as ChatSession;
  } catch {
    return null;
  }
}

export default async function ChatPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("chat_session");

  if (!session?.value) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-6 py-12 text-[#221f1a]">
        <section className="w-full max-w-md rounded-[2rem] border border-[#ded6c9] bg-white/80 p-8 text-center shadow-[0_24px_80px_rgba(70,54,28,0.12)] backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#9b6a3a]">
            Rebloom Chat
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
            Unauthorized session
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#6f665a]">
            Open this chat from Bubble so we can verify your secure handshake
            token and start a session.
          </p>
        </section>
      </main>
    );
  }

  const user = parseSession(session.value);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-6 py-12 text-[#221f1a]">
        <section className="w-full max-w-md rounded-[2rem] border border-[#ded6c9] bg-white/80 p-8 text-center shadow-[0_24px_80px_rgba(70,54,28,0.12)] backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#9b6a3a]">
            Rebloom Chat
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
            Session needs refreshing
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#6f665a]">
            The saved session could not be read. Relaunch the chat from Bubble
            to create a fresh verified session.
          </p>
        </section>
      </main>
    );
  }

  const displayName = user.name || "Rebloom member";
  const details = [
    { label: "Bubble user ID", value: user.id },
    { label: "Email", value: user.email },
    { label: "Display name", value: user.name },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ef] px-6 py-10 text-[#221f1a] sm:px-10 lg:px-16">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center">
        <div className="grid w-full gap-8 rounded-[2.5rem] border border-[#ded6c9] bg-white/75 p-6 shadow-[0_30px_100px_rgba(70,54,28,0.14)] backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div className="flex min-h-[420px] flex-col justify-between rounded-[2rem] bg-[#221f1a] p-8 text-white sm:p-10">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d8b98f]">
                Verified Bubble Handshake
              </p>
              <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">
                Welcome back, {displayName}.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#d7d0c4]">
                Your iframe token was verified and the app has stored a secure
                chat session cookie for this browser.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[#f2eadf]">
                Session active
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[#f2eadf]">
                7 day cookie
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[#f2eadf]">
                HTTP-only
              </span>
            </div>
          </div>

          <aside className="flex flex-col justify-between gap-8 rounded-4xl border border-[#e7dfd2] bg-[#fbf8f2] p-8 sm:p-10">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#9b6a3a]">
                Session Reference
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                User context ready for chat
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#6f665a]">
                This is the Bubble payload currently available to server
                components from the secure cookie.
              </p>
            </div>

            <dl className="space-y-4">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#e2d8c9] bg-white px-5 py-4"
                >
                  <dt className="text-xs font-medium uppercase tracking-[0.22em] text-[#9b6a3a]">
                    {item.label}
                  </dt>
                  <dd className="mt-2 warp-break-words font-mono text-sm text-[#2f2a22]">
                    {item.value || "Not provided"}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>
    </main>
  );
}
