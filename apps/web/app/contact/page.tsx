import Link from "next/link"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/" className="text-sm font-medium text-blue-700">← DadConnect</Link>
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Invite-only beta</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">Contact DadConnect</h1>
          <p className="mt-4 text-lg leading-7 text-gray-600">
            DadConnect does not currently run a public support desk or in-app reporting system. During the beta, account, support, moderation, and deletion requests are handled directly by the organizer who invited you.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Need help?</h2>
          <p className="mt-3 text-gray-600">
            Use the contact method included with your beta invitation. Do not post private family information or safety reports in a public discussion.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/safety" className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white">Safety guidance</Link>
            <Link href="/guidelines" className="rounded-lg border px-5 py-3 font-semibold text-gray-800">Community guidelines</Link>
          </div>
        </section>

        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
          <h2 className="font-semibold">Immediate danger</h2>
          <p className="mt-2 text-sm">DadConnect is not an emergency service. In the U.S., call 911 for immediate danger or 988 for a mental-health crisis.</p>
        </section>
      </div>
    </main>
  )
}
