import Link from "next/link"

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/" className="text-sm font-medium text-blue-700">← DadConnect</Link>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Current beta safety model</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">Safety & privacy</h1>
          <p className="mt-4 text-lg leading-7 text-gray-600">
            DadConnect is an invite-only beta. It does not yet have in-app block/report controls, a staffed moderation queue, or automated safety review.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {[
            ["Protect family details", "Do not post children's names, school details, schedules, or other sensitive family information in public discussions."],
            ["Meet in public", "For a first meetup, choose a public place, use your own judgment, and tell someone you trust where you will be."],
            ["Address privacy", "Exact meetup addresses are kept out of public meetup rows and are available only to the host and members who RSVP Going."],
            ["Report concerns", "During beta, contact the organizer who invited you. Do not put a safety report into a public post or group discussion."],
          ].map(([title, copy]) => (
            <article key={title} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{copy}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-xl font-semibold text-red-900">Urgent situations</h2>
          <p className="mt-3 text-red-800">DadConnect is not an emergency service. In the U.S., call 911 for immediate danger. Call or text 988 for a mental-health crisis.</p>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Beta reporting</h2>
          <p className="mt-3 text-gray-600">
            If something in DadConnect concerns you, contact the beta organizer using the contact method provided with your invitation.
          </p>
          <Link href="/contact" className="mt-5 inline-flex rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white">Contact guidance</Link>
        </section>
      </div>
    </main>
  )
}
