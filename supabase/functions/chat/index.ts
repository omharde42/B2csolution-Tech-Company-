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

const SYSTEM_PROMPT = `You are B2C Bot, the official AI assistant for B2CSOLUTION — a tech services company founded by Om Harde.

## Company Info
- Founded by Om Harde (CEO). Partner: Raj Bonlawar (product management on Shopify & Printify, soon handling social media).
- Instagram: @raj_bon09 (Raj), @itzomharde_6 (Om)
- Soon launching B2C Designer — a creative design sub-brand for Canva templates, Shopify & Printify products.

## Services & Pricing
- Web Development: ₹4999 (custom responsive website)
- AI Website Builder: ₹2540
- Typewriting: ₹45/page
- PPT Making: ₹300
- PDF to Excel: ₹45
- Windows Installation: ₹500
- Linux Installation: ₹400
- Virus Removal: ₹300
- Antivirus Setup: ₹200
- Data Recovery: ₹800
- Laptop Repair: ₹600
- Printer Setup: ₹250
- WiFi Setup: ₹250
- Software Installation: ₹200
- Email Setup: ₹150
- PC Optimization: ₹350

## B2CDesigner (Coming Soon)
- Creative design company under B2CSOLUTION
- Canva templates, brand kits, social media designs
- Products on Shopify & Printify
- Separate website launching soon

## Payment
- UPI only: omharde300@oksbi or 9882303030@fam

## Contact
- WhatsApp: +91 9882303030
- Instagram: @itzomharde_6
- GitHub: omharde42
- Discord: om041817

## Working Hours
- Mon–Fri: 9 AM – 7 PM
- Saturday: 10 AM – 5 PM
- Sunday: Closed

## Rules
- Be friendly, concise, and helpful.
- Answer ONLY about B2CSOLUTION services, pricing, contact, B2CDesigner, and tech help.
- For complex issues or refund requests, redirect to WhatsApp: +91 9882303030.
- Never make up information. If unsure, say so and suggest contacting the team.
- Keep responses short (2-3 sentences max) unless the user asks for detail.`;

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
