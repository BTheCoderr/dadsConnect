const groups = [
  { emoji: "🏀", name: "Weekend Crew", meta: "Sports • family-friendly", note: "Pickup games, watch parties, and getting everybody out of the house." },
  { emoji: "🛝", name: "Playground Dads", meta: "Young kids • local outings", note: "Low-pressure park runs, coffee, and kids burning off some energy." },
  { emoji: "🧰", name: "Dad Life Exchange", meta: "Advice • real talk", note: "Ask the stuff you would rather hear from another dad who has been there." },
]

const conversations = [
  ["School mornings", "Anybody finally figure out a morning routine that actually sticks?"],
  ["This Saturday", "Park meetup around 10? Kids can run around while we catch up."],
  ["Dad win", "Got bedtime down under 30 minutes this week. I am counting it."],
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f1e9] text-[#10213d]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="/" className="flex items-center gap-3 font-black tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary text-lg text-white shadow-[0_5px_0_#173b93]">DC</span>
          <span className="text-xl">DadConnect</span>
        </a>
        <a href="/auth" className="rounded-full border-2 border-[#10213d] px-5 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-white">Sign in</a>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pb-24 lg:pt-16">
        <div>
          <div className="mb-6 inline-flex rotate-[-2deg] items-center gap-2 rounded-full bg-[#f5c85b] px-4 py-2 text-sm font-extrabold text-[#10213d] shadow-[0_3px_0_#d7a52d]">
            <span>👊</span> Built for the everyday dad stuff
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-7xl lg:text-[5.4rem]">
            Dad life is better <span className="relative inline-block text-primary">with a crew.<span className="absolute -bottom-2 left-1 h-2 w-[96%] -rotate-1 rounded-full bg-[#f5c85b]" /></span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg font-medium leading-8 text-[#526078] sm:text-xl">
            Find dads who get the season you are in. Talk honestly, make plans, swap advice, and turn “we should hang out” into an actual meetup.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/auth" className="rounded-2xl bg-primary px-7 py-4 text-center text-base font-extrabold text-white shadow-[0_5px_0_#173b93] transition hover:-translate-y-1 hover:shadow-[0_7px_0_#173b93]">Find your crew →</a>
            <a href="#inside" className="rounded-2xl border-2 border-[#c9c4b8] bg-white/70 px-7 py-4 text-center text-base font-extrabold transition hover:bg-white">See what&apos;s inside</a>
          </div>
          <p className="mt-5 text-sm font-semibold text-[#758096]">Private beta • No public member counts • You control local discovery</p>
        </div>

        <div className="relative mx-auto w-full max-w-xl py-8">
          <div className="absolute -right-6 top-0 h-28 w-28 rotate-12 rounded-[32px] bg-[#f5c85b] opacity-80" />
          <div className="absolute -bottom-3 -left-5 h-24 w-24 -rotate-12 rounded-full bg-[#a8d8c6]" />
          <div className="relative rotate-[1.5deg] rounded-[30px] border-2 border-[#d8d1c4] bg-white p-5 shadow-[0_14px_0_rgba(16,33,61,.09)] sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div><p className="text-xs font-black uppercase tracking-[.18em] text-primary">The crew board</p><h2 className="mt-1 text-2xl font-black tracking-tight">What dads are talking about</h2></div>
              <span className="rounded-full bg-[#e8f1ff] px-3 py-1 text-xs font-bold text-primary">Today</span>
            </div>
            <div className="space-y-3">
              {conversations.map(([title, text], index) => (
                <div key={title} className={`rounded-2xl border p-4 ${index === 1 ? "ml-5 border-[#e3c25e] bg-[#fff8df]" : "mr-3 border-[#dce2ea] bg-[#f8fafc]"}`}>
                  <div className="mb-1 flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10213d] text-xs text-white">👨</span><span className="text-sm font-extrabold">{title}</span></div>
                  <p className="pl-9 text-sm leading-6 text-[#59667b]">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#10213d] px-5 py-4 text-white">
              <div><p className="text-xs font-bold text-[#a9b7cc]">NEXT UP</p><p className="font-extrabold">Saturday park meetup</p></div><span className="text-2xl">🛝</span>
            </div>
          </div>
        </div>
      </section>

      <section id="inside" className="border-y border-[#ddd6c8] bg-[#fffdf8] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 max-w-2xl"><p className="text-sm font-black uppercase tracking-[.18em] text-primary">Pick your kind of crew</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Not another endless social feed.</h2><p className="mt-3 text-lg text-[#667187]">DadConnect is organized around conversations that lead somewhere: support, friendship, or an actual plan.</p></div>
          <div className="grid gap-5 md:grid-cols-3">
            {groups.map((group, index) => (
              <article key={group.name} className={`rounded-[26px] border-2 p-6 ${index === 1 ? "border-[#e2bd51] bg-[#fff7dc] md:-translate-y-3" : "border-[#dce1e8] bg-white"}`}>
                <div className="mb-5 text-4xl">{group.emoji}</div><p className="text-xs font-black uppercase tracking-wider text-primary">{group.meta}</p><h3 className="mt-2 text-2xl font-black">{group.name}</h3><p className="mt-3 leading-7 text-[#667187]">{group.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-8 sm:py-24">
        <div className="rounded-[32px] bg-[#10213d] px-6 py-12 text-white shadow-[0_10px_0_#d9d1c3] sm:px-12">
          <span className="text-4xl">🤝</span><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">You don&apos;t need 5,000 followers.<br />You need a few solid dads.</h2><p className="mx-auto mt-4 max-w-2xl text-[#b9c5d6]">Start with the stage you&apos;re in, the things you care about, and the conversations you actually want to have.</p><a href="/auth" className="mt-7 inline-block rounded-2xl bg-[#f5c85b] px-8 py-4 font-black text-[#10213d] shadow-[0_4px_0_#bd922d]">Join DadConnect</a>
        </div>
        <p className="mt-8 text-xs font-semibold text-[#7b8494]">By continuing you agree to our Terms of Service and Privacy Policy.</p>
      </section>
    </main>
  )
}
