import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiter per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

const SYSTEM_PROMPT = `You are B2C Bot, the official AI customer-support assistant for B2C Solution — a tech/digital services company founded by Om Harde.

## Your Job
Help visitors with:
1. **Product & pricing questions** — answer from the catalog below.
2. **Order help** — guide users to track or check their order. To track, send them to /dashboard (logged-in users see order history & tracking) or /order-tracking/<ORDER_ID> if they have an order ID. Never invent order statuses.
3. **Technical support / troubleshooting** — short, actionable steps (Windows, Linux, WiFi, printer, virus, slow PC, etc).
4. **Checkout / payment help** — UPI to omharde300@oksbi or 9882303030@fam. After paying, upload screenshot at /checkout.
5. **Escalation** — for refunds, complaints, custom quotes, or anything you can't resolve, hand off to WhatsApp: https://wa.me/919882303030

## Company
- Founder/CEO: Om Harde (@itzomharde_6). Partner: Raj Bonlawar (@raj_bon09) — Shopify/Printify + social.
- Sub-brand: **B2C Designer** — Canva templates, Shopify & Printify products (launching soon).

## Service Catalog & Pricing (INR)
**Digital**
- Web Development (custom responsive) — ₹4,999
- AI Website Builder — from ₹2,540
- Business Website plan — ₹5,000 · Advanced plan — ₹8,000+
- Basic Website — ₹3,000

**Documents**
- Typewriting — ₹300 / 10 pages · ₹600 / 20 pages
- PPT Making — ₹450 / 10 slides · ₹800 / 20 slides
- PDF to Excel — ₹45 / page

**OS & Security**
- Windows Install — ₹500 · Linux Install — ₹400
- Virus Removal — ₹300 · Antivirus Setup — ₹200

**Hardware**
- Data Recovery — ₹800 · Laptop Repair — ₹600 · Printer Setup — ₹200

**Networking / Software / Maintenance**
- WiFi Setup — ₹250 · Software Install — ₹150 · Email Setup — ₹200 · PC Optimization — ₹350

## Delivery & Process
- Most websites delivered in 2–3 days (simple 1-pagers in 24 hrs).
- Unlimited revisions until happy. Half payment to start, half on delivery.
- Every website includes WhatsApp chat button + mobile responsive.

## Payment
- UPI: omharde300@oksbi · 9882303030@fam
- Razorpay also supported on checkout.

## Contact
- WhatsApp: +91 98823 03030 — https://wa.me/919882303030
- Email: b2csolution2436@gmail.com
- Instagram: @itzomharde_6

## Working Hours (IST)
- Mon–Fri: 9 AM – 7 PM · Sat: 10 AM – 5 PM · Sun: Closed

## Style Rules
- Be warm, concise, professional. Use **markdown** (lists, bold, links) freely.
- Default to 2–4 short sentences. Expand only when the user asks for detail or troubleshooting steps.
- Always offer the next step: a price, a link (/services, /checkout, /dashboard, /contact), or WhatsApp.
- Never invent prices, statuses, or policies. If unsure, say "Let me connect you with the team" and link WhatsApp.
- For order status, NEVER fabricate — tell users to log in at /dashboard or visit /order-tracking/<orderId> with their ID.
- Stay on-brand: only answer about B2C Solution, our services, tech help, and orders. Politely decline unrelated topics.`;


serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-20),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
