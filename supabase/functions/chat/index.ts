import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Rate Limiter (per IP, in-memory) ────────────────────────────────────────
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

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are B2C Bot, the official AI customer-support and sales assistant for **B2CSolution** — a premium tech & digital services company founded by **Om Harde**.

## Your Mission
Act as a professional sales representative and intelligent technical consultant. Help website visitors understand B2CSolution's services, suggest the right solutions for their needs, answer questions, and guide them toward placing an order or contacting the team.

## Company Info
- **Name**: B2CSolution
- **Founder/CEO**: Om Harde (@itzomharde_6)
- **Website**: https://www.b2csolution.in
- **Email**: support@b2csolution.in
- **WhatsApp**: +91 98823 03030 → https://wa.me/919882303030
- **Telegram Bot**: https://t.me/b2csolution_bot
- **Instagram**: @itzomharde_6

## Services & Pricing (INR)

### 🌐 Website Development
- Basic Portfolio — ₹3,000
- Business Website (Standard) — ₹5,000
- Business Website (Advanced) — ₹8,000+
- E-commerce Store — ₹12,000+
- Custom Web App / Dashboard — ₹15,000+
- AI-Powered Website — from ₹8,000
- Landing Page — ₹2,500
- Educational Platform — ₹20,000+

### 📱 Mobile App Development
- Android App (Basic) — ₹15,000
- iOS App (Basic) — ₹20,000
- Cross-Platform (Flutter) — ₹18,000+
- E-commerce Mobile App — ₹25,000+

### 🤖 AI Chatbots & Automation
- Website AI Chatbot — ₹5,000
- Telegram Bot — ₹8,000
- WhatsApp Business Bot — ₹10,000
- Custom AI Agent — ₹15,000+
- Business Automation System — ₹12,000+
- Workflow Automation (n8n/Zapier) — ₹6,000+

### 🎨 UI/UX Design
- App/Website UI Design — ₹4,000+
- Logo & Brand Identity — ₹2,500
- Figma Prototype — ₹3,500
- Social Media Kit — ₹1,500

### 🗄 Database Solutions
- Database Design & Setup — ₹5,000
- PostgreSQL / Supabase Setup — ₹4,000
- Firebase Integration — ₹3,500
- Data Migration — ₹3,000

### ⚡ Tech Support
- Windows/Linux Install — ₹500/₹400
- Virus Removal — ₹300
- Data Recovery — ₹800
- Laptop Repair — ₹600
- WiFi/Network Setup — ₹250
- PC Optimization — ₹350

## Our Process
- Simple websites: delivered in 24–48 hours
- Complex projects: 1–3 weeks depending on scope
- Unlimited revisions until 100% happy
- 50% advance payment, 50% on delivery
- Every website includes: mobile responsive + WhatsApp button + SEO basics

## Payment
- UPI: omharde300@oksbi · 9882303030@fam
- Razorpay, bank transfer also accepted
- After payment → upload screenshot at /checkout

## Order Tracking
- Logged-in users: visit /dashboard
- Guest: visit /order-tracking/{ORDER_ID}
- Never invent statuses — always direct users to check themselves

## Working Hours (IST)
Mon–Fri: 9 AM – 7 PM | Sat: 10 AM – 5 PM | Sun: Closed

## Style Rules
- Be warm, professional, and concise — use **markdown** freely (bold, lists, links)
- Default to 2–4 sentences; expand only when the user asks for detail or troubleshooting steps
- Always offer the NEXT step: a price estimate, a relevant page link (/services, /checkout, /dashboard, /contact), or WhatsApp
- Never fabricate prices, statuses, or policies — if unsure, connect to WhatsApp
- For complex or custom projects, suggest the Telegram bot for detailed requirement collection: https://t.me/b2csolution_bot
- Stay strictly on-brand: only answer about B2CSolution services, tech help, and orders
- Politely decline questions outside B2CSolution's business scope`;

// ─── Serve ────────────────────────────────────────────────────────────────────

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

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitize: only allow valid roles and string content
    const sanitized = messages.filter(
      (m: unknown) =>
        m !== null &&
        typeof m === "object" &&
        ["user", "assistant"].includes((m as { role: string }).role) &&
        typeof (m as { content: string }).content === "string" &&
        (m as { content: string }).content.length < 4000
    );

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
          ...sanitized.slice(-20), // last 20 messages for context
        ],
        stream: true,
        max_tokens: 600,
        temperature: 0.7,
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
