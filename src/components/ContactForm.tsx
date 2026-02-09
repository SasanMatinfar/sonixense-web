"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("ok");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
    }
  }

  return (
    <section id="contact" className="bg-black">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-white">Contact</h2>
        <p className="mt-2 text-sm text-white/60">
          Send a short message and we’ll follow up for a demo.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="grid gap-4">
            <input
              name="name"
              required
              placeholder="Name"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
            />
            <input
              name="company"
              placeholder="Company / Lab (optional)"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
            />
            <textarea
              name="message"
              required
              placeholder="What do you want to sonify? What is your context (product, research, demo)?"
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50 transition"
            >
              {status === "sending" ? "Sending..." : "Send"}
            </button>

            {status === "ok" && (
              <div className="text-sm text-white/80">
                Sent. (For now, it will log in your terminal.)
              </div>
            )}
            {status === "err" && (
              <div className="text-sm text-white/80">
                Failed. Please try again.
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}