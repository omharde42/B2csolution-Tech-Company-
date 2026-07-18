/**
 * B2CSolution Telegram Bot — Supabase Edge Function
 * ===================================================
 * Webhook receiver for the Telegram Bot API.
 * Handles commands, inline keyboards, AI chat, lead collection, and admin notifications.
 *
 * Required Supabase Secrets (set in Dashboard → Edge Functions → Secrets):
 *   TELEGRAM_BOT_TOKEN       — from @BotFather
 *   TELEGRAM_WEBHOOK_SECRET  — random string for webhook validation (optional but recommended)
 *   GEMINI_API_KEY           — Google AI Studio API key
 *   ADMIN_TELEGRAM_CHAT_ID   — your personal Telegram chat ID (from @userinfobot)
 *   SUPABASE_URL             — auto-injected by Supabase
 *   SUPABASE_SERVICE_ROLE_KEY — auto-injected by Supabase
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Config ──────────────────────────────────────────────────────────────────

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const WEBHOOK_SECRET = Deno.env.get("TELEGRAM_WEBHOOK_SECRET") ?? "";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const ADMIN_CHAT_ID = Deno.env.get("ADMIN_TELEGRAM_CHAT_ID") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/** Message threshold before offering human handoff */
const HANDOFF_THRESHOLD = 25;

// ─── Supabase Client (service role — bypasses RLS) ───────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── Types ───────────────────────────────────────────────────────────────────

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: { id: number; type: string };
  text?: string;
  photo?: unknown[];
  document?: unknown;
  caption?: string;
  date: number;
}

interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

interface BotSession {
  id: string;
  telegram_user_id: number;
  conversation_id: string | null;
  current_step: string;
  step_data: Record<string, unknown>;
  message_count: number;
}

// ─── System Prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are B2C Bot, the official AI business assistant for **B2CSolution** — a premium tech & digital services company founded by **Om Harde**.

## Your Mission
Act as a professional sales representative and technical consultant. Help customers understand our services, collect project requirements, suggest solutions, and generate rough estimates.

## Company
- **Name**: B2CSolution
- **Founder**: Om Harde
- **Website**: https://www.b2csolution.in
- **Email**: support@b2csolution.in
- **WhatsApp**: +91 98823 03030 → https://wa.me/919882303030
- **Instagram**: @itzomharde_6

## Services & Pricing (INR)

### 🌐 Website Development
- Basic Portfolio Website — ₹3,000
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
- Cross-Platform App (Flutter) — ₹18,000+
- E-commerce Mobile App — ₹25,000+

### 🤖 AI Chatbots & Automation
- Website AI Chatbot — ₹5,000
- Telegram Bot (like this one!) — ₹8,000
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

### ⚡ Tech Services
- Windows/Linux Install — ₹500/₹400
- Virus Removal — ₹300
- Data Recovery — ₹800
- Laptop Repair — ₹600
- WiFi/Network Setup — ₹250
- PC Optimization — ₹350

## Delivery & Process
- Simple websites: delivered in 24–48 hours
- Complex projects: 1–3 weeks depending on scope
- Unlimited revisions until you're 100% happy
- 50% advance payment, 50% on delivery
- Every website includes: mobile responsive + WhatsApp button + SEO basics

## Payment
- UPI: omharde300@oksbi or 9882303030@fam
- Razorpay, bank transfer also accepted

## Personality & Style
- Be warm, professional, and concise
- Use emojis appropriately to keep it friendly
- Use bullet points and bold text for clarity
- Always offer the NEXT step: a price estimate, a question, or a link
- Never fabricate prices or timelines — if unsure, offer to discuss on WhatsApp
- Stay strictly within B2CSolution's business scope
- If asked about anything unrelated to tech/digital services, politely redirect

## Working Hours (IST)
Mon–Fri: 9 AM – 7 PM | Sat: 10 AM – 5 PM | Sun: Closed (WhatsApp support available)`;

// ─── Telegram API Helpers ─────────────────────────────────────────────────────

/** Send a plain text or markdown message */
async function sendMessage(
  chatId: number,
  text: string,
  extra: Record<string, unknown> = {}
) {
  await fetch(`${TG_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      ...extra,
    }),
  });
}

/** Send a message with inline keyboard buttons */
async function sendWithKeyboard(
  chatId: number,
  text: string,
  buttons: Array<Array<{ text: string; callback_data: string }>>
) {
  await sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: buttons },
  });
}

/** Answer a callback query (removes loading spinner on button) */
async function answerCallback(callbackId: string, text?: string) {
  await fetch(`${TG_API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId, text }),
  });
}

/** Notify admin channel */
async function notifyAdmin(message: string) {
  if (!ADMIN_CHAT_ID) return;
  await sendMessage(Number(ADMIN_CHAT_ID), `🔔 *Admin Alert*\n\n${message}`, {});
}

// ─── Keyboards ────────────────────────────────────────────────────────────────

const MAIN_MENU_KEYBOARD = [
  [
    { text: "🌐 Website Development", callback_data: "svc:website" },
    { text: "📱 Mobile App", callback_data: "svc:mobile_app" },
  ],
  [
    { text: "🤖 AI Chatbots", callback_data: "svc:ai_chatbot" },
    { text: "🎨 UI/UX Design", callback_data: "svc:ui_design" },
  ],
  [
    { text: "⚡ Automation", callback_data: "svc:automation" },
    { text: "🗄 Database Solutions", callback_data: "svc:database" },
  ],
  [
    { text: "💼 Portfolio", callback_data: "info:portfolio" },
    { text: "💰 Pricing", callback_data: "info:pricing" },
  ],
  [
    { text: "📞 Contact Support", callback_data: "info:contact" },
    { text: "❓ FAQ", callback_data: "info:faq" },
  ],
];

const HANDOFF_KEYBOARD = [
  [
    { text: "💬 Continue on WhatsApp", callback_data: "handoff:whatsapp" },
    { text: "🤖 Continue Here", callback_data: "handoff:bot" },
  ],
];

const WEBSITE_TYPE_KEYBOARD = [
  [
    { text: "🖼 Portfolio", callback_data: "ws_type:portfolio" },
    { text: "🏢 Business", callback_data: "ws_type:business" },
  ],
  [
    { text: "🛒 E-commerce", callback_data: "ws_type:ecommerce" },
    { text: "📝 Blog", callback_data: "ws_type:blog" },
  ],
  [
    { text: "📊 Dashboard/App", callback_data: "ws_type:dashboard" },
    { text: "🎓 Educational", callback_data: "ws_type:educational" },
  ],
  [{ text: "❓ Other / Not Sure", callback_data: "ws_type:other" }],
];

const BUDGET_KEYBOARD = [
  [
    { text: "Under ₹5,000", callback_data: "budget:under_5k" },
    { text: "₹5,000 – ₹10,000", callback_data: "budget:5k_10k" },
  ],
  [
    { text: "₹10,000 – ₹25,000", callback_data: "budget:10k_25k" },
    { text: "₹25,000 – ₹50,000", callback_data: "budget:25k_50k" },
  ],
  [
    { text: "₹50,000+", callback_data: "budget:50k_plus" },
    { text: "💬 Let's Discuss", callback_data: "budget:discuss" },
  ],
];

const YES_NO_KEYBOARD = (yesData: string, noData: string) => [
  [
    { text: "✅ Yes", callback_data: yesData },
    { text: "❌ No", callback_data: noData },
  ],
];

// ─── Database Helpers ─────────────────────────────────────────────────────────

/** Get or create a Telegram user record */
async function upsertTelegramUser(from: TelegramUser): Promise<void> {
  await supabase.from("telegram_users").upsert(
    {
      telegram_id: from.id,
      username: from.username ?? null,
      first_name: from.first_name,
      last_name: from.last_name ?? null,
      language_code: from.language_code ?? "en",
      last_seen: new Date().toISOString(),
    },
    { onConflict: "telegram_id", ignoreDuplicates: false }
  );
}

/** Increment user message count */
async function incrementUserMessageCount(telegramId: number): Promise<void> {
  await supabase.rpc("increment", { // uses Supabase's built-in increment if available
    row_id: telegramId,
    table: "telegram_users",
    column: "message_count",
  }).catch(() => {
    // Fallback: raw update
    supabase
      .from("telegram_users")
      .update({ message_count: supabase.rpc("coalesce_increment" as never) })
      .eq("telegram_id", telegramId);
  });
}

/** Get or create a bot session for a user */
async function getOrCreateSession(telegramId: number): Promise<BotSession> {
  const { data: existing } = await supabase
    .from("bot_sessions")
    .select("*")
    .eq("telegram_user_id", telegramId)
    .maybeSingle();

  if (existing) {
    // Update last activity
    await supabase
      .from("bot_sessions")
      .update({ last_activity: new Date().toISOString() })
      .eq("telegram_user_id", telegramId);
    return existing as BotSession;
  }

  // Create new session
  const { data: conv } = await supabase
    .from("telegram_conversations")
    .insert({ telegram_user_id: telegramId, status: "active" })
    .select("id")
    .single();

  const newSession = {
    telegram_user_id: telegramId,
    conversation_id: conv?.id ?? null,
    current_step: "idle",
    step_data: {},
    message_count: 0,
    last_activity: new Date().toISOString(),
  };

  const { data: created } = await supabase
    .from("bot_sessions")
    .insert(newSession)
    .select("*")
    .single();

  return created as BotSession;
}

/** Update session step and data */
async function updateSession(
  telegramId: number,
  updates: Partial<BotSession>
) {
  await supabase
    .from("bot_sessions")
    .update({ ...updates, last_activity: new Date().toISOString() })
    .eq("telegram_user_id", telegramId);
}

/** Save a message to the conversation log */
async function logMessage(
  conversationId: string,
  telegramUserId: number,
  role: "user" | "bot",
  content: string,
  messageType = "text",
  telegramMsgId?: number
) {
  if (!conversationId) return;
  await supabase.from("telegram_messages").insert({
    conversation_id: conversationId,
    telegram_user_id: telegramUserId,
    role,
    content,
    message_type: messageType,
    telegram_msg_id: telegramMsgId ?? null,
  });
  // Increment conversation message count
  await supabase
    .from("telegram_conversations")
    .update({ message_count: supabase.rpc("coalesce_increment" as never) })
    .eq("id", conversationId)
    .catch(() => null);
}

/** Save a completed lead to the database */
async function saveLead(
  telegramUserId: number,
  conversationId: string | null,
  service: string,
  stepData: Record<string, unknown>
): Promise<void> {
  const leadData = {
    telegram_user_id: telegramUserId,
    conversation_id: conversationId,
    service,
    service_subtype: (stepData.website_type as string) ?? null,
    customer_name: (stepData.customer_name as string) ?? null,
    customer_phone: (stepData.customer_phone as string) ?? null,
    customer_email: (stepData.customer_email as string) ?? null,
    budget_range: (stepData.budget as string) ?? null,
    deadline: (stepData.deadline as string) ?? null,
    has_design: (stepData.has_design as boolean) ?? null,
    needs_hosting: (stepData.needs_hosting as boolean) ?? null,
    requirements: stepData,
    status: "new",
  };

  const { data: lead } = await supabase
    .from("telegram_leads")
    .insert(leadData)
    .select("id")
    .single();

  console.log("Lead saved:", lead?.id);

  // Notify admin
  const svcNames: Record<string, string> = {
    website: "Website Development",
    mobile_app: "Mobile App",
    ai_chatbot: "AI Chatbot",
    ui_design: "UI/UX Design",
    automation: "Automation",
    database: "Database Solution",
  };

  await notifyAdmin(
    `🆕 *New Lead Captured!*\n\n` +
    `Service: ${svcNames[service] ?? service}\n` +
    `Subtype: ${stepData.website_type ?? "—"}\n` +
    `Budget: ${stepData.budget ?? "—"}\n` +
    `Deadline: ${stepData.deadline ?? "—"}\n` +
    `Name: ${stepData.customer_name ?? "—"}\n` +
    `Phone: ${stepData.customer_phone ?? "—"}\n\n` +
    `📊 Check Admin Dashboard for full details.`
  );
}

// ─── AI Chat Helper ──────────────────────────────────────────────────────────

/** Get a response from Gemini for free-form AI chat */
async function getAIResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "🤖 AI is temporarily unavailable. Please contact us on WhatsApp: https://wa.me/919882303030";
  }

  try {
    // Build Gemini contents from history
    const contents = [
      ...conversationHistory.slice(-10).map((m) => ({
        role: m.role === "bot" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const resp = await fetch(GEMINI_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
          topP: 0.9,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
    });

    if (!resp.ok) {
      console.error("Gemini error:", resp.status, await resp.text());
      return "I'm having a bit of trouble right now. Please try again in a moment, or reach us on WhatsApp: https://wa.me/919882303030";
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return text || "I couldn't generate a response. Please contact us on WhatsApp: https://wa.me/919882303030";
  } catch (e) {
    console.error("AI error:", e);
    return "Something went wrong. Please contact us on WhatsApp: https://wa.me/919882303030";
  }
}

// ─── Command Handlers ─────────────────────────────────────────────────────────

async function handleStart(chatId: number, from: TelegramUser, session: BotSession) {
  const name = from.first_name;
  const isReturning = session.message_count > 0;

  const greeting = isReturning
    ? `👋 Welcome back, *${name}*! Great to see you again.`
    : `👋 Hello *${name}*! Welcome to *B2CSolution* — your AI-powered tech partner.`;

  const intro = isReturning
    ? `\n\nWhat can I help you with today?`
    : `\n\nI'm your intelligent business assistant. I can help you:\n` +
      `• 🌐 Build stunning websites\n` +
      `• 📱 Develop mobile apps\n` +
      `• 🤖 Create AI chatbots\n` +
      `• ⚡ Automate your business\n` +
      `• 🎨 Design beautiful UIs\n` +
      `• 🗄 Set up databases\n\n` +
      `Choose a service below or just ask me anything! 👇`;

  await sendWithKeyboard(chatId, greeting + intro, MAIN_MENU_KEYBOARD);

  // Reset session state
  await updateSession(from.id, { current_step: "idle", step_data: {} });

  // Notify admin of new user (first time only)
  if (!isReturning) {
    await notifyAdmin(
      `👤 *New User Joined!*\n\nName: ${name} ${from.last_name ?? ""}\n` +
      `Username: ${from.username ? "@" + from.username : "—"}\n` +
      `Language: ${from.language_code ?? "unknown"}`
    );
  }
}

async function handleHelp(chatId: number) {
  const helpText =
    `🆘 *B2CSolution Bot — Help*\n\n` +
    `*Commands:*\n` +
    `/start — Main menu\n` +
    `/services — View all services\n` +
    `/pricing — Pricing guide\n` +
    `/portfolio — Our work\n` +
    `/contact — Contact details\n` +
    `/order — Start a new project\n` +
    `/support — Talk to our team\n` +
    `/status — Check project status\n` +
    `/faq — Common questions\n\n` +
    `💡 *Tip:* Just type your question naturally and I'll help you!`;

  await sendWithKeyboard(chatId, helpText, [
    [{ text: "🏠 Main Menu", callback_data: "nav:home" }],
  ]);
}

async function handleServices(chatId: number) {
  const text =
    `🛠 *B2CSolution Services*\n\n` +
    `We build everything digital. Select a service to learn more and get a quote:`;
  await sendWithKeyboard(chatId, text, MAIN_MENU_KEYBOARD);
}

async function handlePricing(chatId: number) {
  const text =
    `💰 *Pricing Guide*\n\n` +
    `🌐 *Websites*\n` +
    `• Basic — ₹3,000\n` +
    `• Business — ₹5,000–₹8,000\n` +
    `• E-commerce — ₹12,000+\n` +
    `• AI Website — ₹8,000+\n\n` +
    `📱 *Mobile Apps*\n` +
    `• Android/iOS — ₹15,000+\n` +
    `• Cross-platform — ₹18,000+\n\n` +
    `🤖 *AI & Chatbots*\n` +
    `• Website Bot — ₹5,000\n` +
    `• Telegram Bot — ₹8,000\n` +
    `• WhatsApp Bot — ₹10,000\n\n` +
    `🎨 *Design*\n` +
    `• UI/UX — ₹4,000+\n` +
    `• Logo — ₹2,500\n\n` +
    `📞 *Need a custom quote?* Just tell me about your project!`;

  await sendWithKeyboard(chatId, text, [
    [{ text: "💼 Get a Quote", callback_data: "nav:get_quote" }],
    [{ text: "🏠 Main Menu", callback_data: "nav:home" }],
  ]);
}

async function handleContact(chatId: number) {
  const text =
    `📞 *Contact B2CSolution*\n\n` +
    `👤 *Founder:* Om Harde\n\n` +
    `📱 WhatsApp: [+91 98823 03030](https://wa.me/919882303030)\n` +
    `📧 Email: support@b2csolution.in\n` +
    `🌐 Website: https://www.b2csolution.in\n` +
    `📸 Instagram: @itzomharde_6\n\n` +
    `⏰ *Working Hours (IST)*\n` +
    `Mon–Fri: 9 AM – 7 PM\n` +
    `Sat: 10 AM – 5 PM\n` +
    `Sun: Closed (WhatsApp support available)\n\n` +
    `💬 I'm also here 24/7 for quick questions!`;

  await sendMessage(chatId, text);
}

async function handlePortfolio(chatId: number) {
  const text =
    `💼 *Our Portfolio*\n\n` +
    `We've delivered 50+ projects across India.\n\n` +
    `🌐 Visit our website for case studies:\n` +
    `👉 https://www.b2csolution.in\n\n` +
    `*Recent Projects:*\n` +
    `• E-commerce store (Shopify + AI) — Retail client\n` +
    `• Business website with chatbot — IT firm\n` +
    `• Mobile app (Flutter) — Logistics startup\n` +
    `• Automation system — HR company\n` +
    `• Custom dashboard — Analytics firm\n\n` +
    `Want to see work in your specific niche? Just ask! 🎯`;

  await sendWithKeyboard(chatId, text, [
    [{ text: "🚀 Start My Project", callback_data: "nav:get_quote" }],
    [{ text: "🏠 Main Menu", callback_data: "nav:home" }],
  ]);
}

async function handleFAQ(chatId: number) {
  const text =
    `❓ *Frequently Asked Questions*\n\n` +
    `*Q: How long does a website take?*\n` +
    `A: Simple sites in 24–48 hrs. Complex apps in 1–3 weeks.\n\n` +
    `*Q: Do you offer revisions?*\n` +
    `A: Yes! Unlimited revisions until you're 100% happy.\n\n` +
    `*Q: What's the payment process?*\n` +
    `A: 50% advance to start, 50% on final delivery.\n\n` +
    `*Q: Do you provide hosting?*\n` +
    `A: Yes, we can handle hosting setup. Mention it in your requirements.\n\n` +
    `*Q: Can I see examples first?*\n` +
    `A: Absolutely! Visit https://www.b2csolution.in or ask me.\n\n` +
    `*Q: What payment methods do you accept?*\n` +
    `A: UPI, Razorpay, bank transfer.\n\n` +
    `Still have questions? Just ask me! 🤖`;

  await sendWithKeyboard(chatId, text, [
    [{ text: "🏠 Main Menu", callback_data: "nav:home" }],
  ]);
}

async function handleSupport(chatId: number, telegramId: number, session: BotSession) {
  const text =
    `🆘 *Request Human Support*\n\n` +
    `Our team is ready to help you personally.\n\n` +
    `Choose how you'd like to connect:`;

  await sendWithKeyboard(chatId, text, HANDOFF_KEYBOARD);

  // Mark conversation as handed off
  if (session.conversation_id) {
    await supabase
      .from("telegram_conversations")
      .update({ status: "handed_off", handed_off_at: new Date().toISOString() })
      .eq("id", session.conversation_id);
  }

  // Notify admin
  await notifyAdmin(
    `🆘 *Support Request!*\n\nUser requested human support.\n` +
    `Telegram ID: ${telegramId}\n` +
    `Session step: ${session.current_step}`
  );
}

// ─── Service Requirement Collection Flows ────────────────────────────────────

async function startServiceFlow(
  chatId: number,
  telegramId: number,
  service: string,
  session: BotSession
) {
  await updateSession(telegramId, {
    current_step: `${service}_q1`,
    step_data: { service },
  });

  switch (service) {
    case "website":
      await sendWithKeyboard(
        chatId,
        `🌐 *Website Development*\n\n` +
        `Great choice! Let me collect your requirements to give you an accurate quote.\n\n` +
        `*Question 1 of 7:*\n` +
        `What type of website do you need?`,
        WEBSITE_TYPE_KEYBOARD
      );
      break;

    case "mobile_app":
      await sendMessage(
        chatId,
        `📱 *Mobile App Development*\n\n` +
        `Awesome! Let's understand your app idea.\n\n` +
        `*Question 1 of 6:*\n` +
        `Please describe your app idea in a few sentences. What problem does it solve?`
      );
      await updateSession(telegramId, { current_step: "mobile_app_q1" });
      break;

    case "ai_chatbot":
      await sendWithKeyboard(
        chatId,
        `🤖 *AI Chatbot Development*\n\n` +
        `Smart choice! AI bots transform customer experience.\n\n` +
        `*Question 1 of 5:*\n` +
        `Where do you want the chatbot?`,
        [
          [
            { text: "🌐 Website", callback_data: "bot_platform:website" },
            { text: "📱 Telegram", callback_data: "bot_platform:telegram" },
          ],
          [
            { text: "💬 WhatsApp", callback_data: "bot_platform:whatsapp" },
            { text: "📲 All Platforms", callback_data: "bot_platform:all" },
          ],
        ]
      );
      break;

    case "ui_design":
      await sendMessage(
        chatId,
        `🎨 *UI/UX Design*\n\n` +
        `Let's create something beautiful!\n\n` +
        `*Question 1 of 5:*\n` +
        `What needs to be designed? (e.g., mobile app, website, logo, social media kit, etc.)`
      );
      await updateSession(telegramId, { current_step: "ui_design_q1" });
      break;

    case "automation":
      await sendMessage(
        chatId,
        `⚡ *Business Automation*\n\n` +
        `Automation saves time and money — great investment!\n\n` +
        `*Question 1 of 5:*\n` +
        `What process do you want to automate? (e.g., lead follow-up, invoicing, social media posting, data entry, etc.)`
      );
      await updateSession(telegramId, { current_step: "automation_q1" });
      break;

    case "database":
      await sendMessage(
        chatId,
        `🗄 *Database Solutions*\n\n` +
        `A solid database is the backbone of any great app.\n\n` +
        `*Question 1 of 5:*\n` +
        `What's the database for? (e.g., website backend, mobile app, data analytics, migrating from existing system, etc.)`
      );
      await updateSession(telegramId, { current_step: "database_q1" });
      break;

    default:
      await sendWithKeyboard(chatId, "What service are you interested in?", MAIN_MENU_KEYBOARD);
  }
}

/** Handle multi-step requirement collection flow based on session step */
async function handleFlowStep(
  chatId: number,
  telegramId: number,
  text: string,
  session: BotSession
): Promise<boolean> {
  const step = session.current_step;
  const data = { ...session.step_data };

  // ── Website Flow ──────────────────────────────────────────────────────────
  if (step === "website_q2") {
    // Features
    data.features = text;
    await updateSession(telegramId, { step_data: data, current_step: "website_q3" });
    await sendWithKeyboard(
      chatId,
      `✅ Got it!\n\n*Question 3 of 7:*\nWhat is your budget range?`,
      BUDGET_KEYBOARD
    );
    return true;
  }

  if (step === "website_q4") {
    // Deadline
    data.deadline = text;
    await updateSession(telegramId, { step_data: data, current_step: "website_q5" });
    await sendWithKeyboard(
      chatId,
      `✅ Noted!\n\n*Question 5 of 7:*\nDo you already have a design or mockup ready?`,
      YES_NO_KEYBOARD("website_design:yes", "website_design:no")
    );
    return true;
  }

  if (step === "website_q7_contact") {
    // Contact info
    if (text.includes("@") || text.match(/\d{10}/)) {
      data.customer_contact = text;
      if (text.includes("@")) data.customer_email = text;
      else data.customer_phone = text;
    } else {
      data.customer_name = text;
    }
    await updateSession(telegramId, { step_data: data, current_step: "website_q8_name" });
    await sendMessage(chatId, `*Question 7 of 7:*\nFinally, what's your name?`);
    return true;
  }

  if (step === "website_q8_name") {
    data.customer_name = text;
    await updateSession(telegramId, { step_data: data, current_step: "idle" });
    await completeWebsiteFlow(chatId, telegramId, session.conversation_id, data);
    return true;
  }

  // ── Mobile App Flow ───────────────────────────────────────────────────────
  if (step === "mobile_app_q1") {
    data.app_description = text;
    await updateSession(telegramId, { step_data: data, current_step: "mobile_app_q2" });
    await sendWithKeyboard(
      chatId,
      `💡 Sounds interesting!\n\n*Question 2 of 6:*\nWhich platform do you need?`,
      [
        [
          { text: "🤖 Android", callback_data: "app_platform:android" },
          { text: "🍎 iOS (iPhone)", callback_data: "app_platform:ios" },
        ],
        [{ text: "📱 Both (Cross-platform)", callback_data: "app_platform:both" }],
      ]
    );
    return true;
  }

  if (step === "mobile_app_q3") {
    data.app_features = text;
    await updateSession(telegramId, { step_data: data, current_step: "mobile_app_q4" });
    await sendWithKeyboard(
      chatId,
      `*Question 4 of 6:*\nWhat's your budget?`,
      BUDGET_KEYBOARD
    );
    return true;
  }

  if (step === "mobile_app_q5") {
    data.deadline = text;
    await updateSession(telegramId, { step_data: data, current_step: "mobile_app_q6" });
    await sendMessage(chatId, `*Question 6 of 6:*\nWhat's your name and best contact (phone/email)?`);
    return true;
  }

  if (step === "mobile_app_q6") {
    data.customer_contact = text;
    await updateSession(telegramId, { step_data: data, current_step: "idle" });
    await completeGenericFlow(chatId, telegramId, session.conversation_id, "mobile_app", data);
    return true;
  }

  // ── AI Chatbot Flow ───────────────────────────────────────────────────────
  if (step === "ai_chatbot_q2") {
    data.bot_purpose = text;
    await updateSession(telegramId, { step_data: data, current_step: "ai_chatbot_q3" });
    await sendMessage(chatId, `*Question 3 of 5:*\nDo you have an existing website? If yes, please share the URL.`);
    return true;
  }

  if (step === "ai_chatbot_q3") {
    data.existing_website = text;
    await updateSession(telegramId, { step_data: data, current_step: "ai_chatbot_q4" });
    await sendWithKeyboard(chatId, `*Question 4 of 5:*\nBudget range?`, BUDGET_KEYBOARD);
    return true;
  }

  if (step === "ai_chatbot_q5") {
    data.customer_contact = text;
    await updateSession(telegramId, { step_data: data, current_step: "idle" });
    await completeGenericFlow(chatId, telegramId, session.conversation_id, "ai_chatbot", data);
    return true;
  }

  // ── Generic flows (UI Design, Automation, Database) ───────────────────────
  if (step === "ui_design_q1" || step === "automation_q1" || step === "database_q1") {
    const svc = step.replace("_q1", "");
    data.description = text;
    await updateSession(telegramId, { step_data: data, current_step: `${svc}_q2` });
    await sendWithKeyboard(chatId, `*Question 2 of 5:*\nWhat's your budget?`, BUDGET_KEYBOARD);
    return true;
  }

  if (step === "ui_design_q3" || step === "automation_q3" || step === "database_q3") {
    const svc = step.replace("_q3", "");
    data.deadline = text;
    await updateSession(telegramId, { step_data: data, current_step: `${svc}_q4` });
    await sendMessage(chatId, `*Question 4 of 5:*\nAny additional details or specific requirements?`);
    return true;
  }

  if (step === "ui_design_q4" || step === "automation_q4" || step === "database_q4") {
    const svc = step.replace("_q4", "");
    data.extra_requirements = text;
    await updateSession(telegramId, { step_data: data, current_step: `${svc}_q5` });
    await sendMessage(chatId, `*Question 5 of 5:*\nWhat's your name and contact (phone/email) so we can reach out?`);
    return true;
  }

  if (step === "ui_design_q5" || step === "automation_q5" || step === "database_q5") {
    const svc = step.replace("_q5", "");
    data.customer_contact = text;
    await updateSession(telegramId, { step_data: data, current_step: "idle" });
    await completeGenericFlow(chatId, telegramId, session.conversation_id, svc, data);
    return true;
  }

  return false; // Not in a flow
}

/** Complete website requirement flow */
async function completeWebsiteFlow(
  chatId: number,
  telegramId: number,
  conversationId: string | null,
  data: Record<string, unknown>
) {
  // Generate estimate based on type
  const estimates: Record<string, string> = {
    portfolio: "₹3,000 – ₹5,000",
    business: "₹5,000 – ₹8,000",
    ecommerce: "₹12,000 – ₹20,000",
    blog: "₹4,000 – ₹6,000",
    dashboard: "₹15,000 – ₹25,000",
    educational: "₹18,000 – ₹30,000",
    other: "₹5,000 – ₹15,000",
  };

  const wsType = (data.website_type as string) ?? "business";
  const estimate = estimates[wsType] ?? "₹5,000 – ₹15,000";

  await sendMessage(
    chatId,
    `🎉 *Perfect! Here's Your Quote Summary*\n\n` +
    `📋 *Project Type:* ${wsType.charAt(0).toUpperCase() + wsType.slice(1)} Website\n` +
    `✨ *Features:* ${data.features ?? "Standard"}\n` +
    `💰 *Budget:* ${data.budget ?? "To be discussed"}\n` +
    `📅 *Deadline:* ${data.deadline ?? "Flexible"}\n` +
    `🎨 *Has Design:* ${data.has_design ? "Yes" : "No"}\n` +
    `🌐 *Hosting:* ${data.needs_hosting ? "Required" : "Not required"}\n\n` +
    `📊 *Estimated Price Range:* ${estimate}\n\n` +
    `✅ I've saved your requirements. Our team will contact you within *2–4 hours* (during working hours).\n\n` +
    `For immediate help: [WhatsApp us →](https://wa.me/919882303030?text=Hi+B2CSolution,+I+just+submitted+my+website+requirements+via+Telegram!)`
  );

  await saveLead(telegramId, conversationId, "website", data);
}

/** Complete generic requirement flow */
async function completeGenericFlow(
  chatId: number,
  telegramId: number,
  conversationId: string | null,
  service: string,
  data: Record<string, unknown>
) {
  const svcNames: Record<string, string> = {
    mobile_app: "Mobile App Development",
    ai_chatbot: "AI Chatbot",
    ui_design: "UI/UX Design",
    automation: "Business Automation",
    database: "Database Solution",
  };

  await sendMessage(
    chatId,
    `✅ *Requirements Saved!*\n\n` +
    `Thank you for sharing your project details for *${svcNames[service] ?? service}*.\n\n` +
    `📊 *Budget:* ${data.budget ?? "To be discussed"}\n` +
    `📅 *Deadline:* ${data.deadline ?? "Flexible"}\n\n` +
    `Our team will review your requirements and contact you within *2–4 hours*.\n\n` +
    `For immediate discussion: [WhatsApp us →](https://wa.me/919882303030?text=Hi+B2CSolution,+I+just+submitted+project+requirements+via+Telegram!)`
  );

  await saveLead(telegramId, conversationId, service, data);
}

// ─── Callback Query Handler ───────────────────────────────────────────────────

async function handleCallback(
  chatId: number,
  telegramId: number,
  callbackId: string,
  data: string,
  session: BotSession
) {
  await answerCallback(callbackId);

  // ── Navigation ─────────────────────────────────────────────────────────────
  if (data === "nav:home") {
    await sendWithKeyboard(chatId, "🏠 *Main Menu* — What can I help you with?", MAIN_MENU_KEYBOARD);
    await updateSession(telegramId, { current_step: "idle", step_data: {} });
    return;
  }

  if (data === "nav:get_quote") {
    await sendWithKeyboard(chatId, "🚀 *Start a Project*\n\nWhich service do you need?", MAIN_MENU_KEYBOARD);
    return;
  }

  // ── Service Selection ──────────────────────────────────────────────────────
  if (data.startsWith("svc:")) {
    const service = data.replace("svc:", "");
    await startServiceFlow(chatId, telegramId, service, session);
    return;
  }

  // ── Info Requests ──────────────────────────────────────────────────────────
  if (data === "info:portfolio") { await handlePortfolio(chatId); return; }
  if (data === "info:pricing") { await handlePricing(chatId); return; }
  if (data === "info:contact") { await handleContact(chatId); return; }
  if (data === "info:faq") { await handleFAQ(chatId); return; }

  // ── Website Type Selection ─────────────────────────────────────────────────
  if (data.startsWith("ws_type:")) {
    const wsType = data.replace("ws_type:", "");
    const stepData = { ...(session.step_data ?? {}), website_type: wsType };
    await updateSession(telegramId, { step_data: stepData, current_step: "website_q2" });
    await sendMessage(
      chatId,
      `✅ *${wsType.charAt(0).toUpperCase() + wsType.slice(1)}* website — great choice!\n\n` +
      `*Question 2 of 7:*\n` +
      `What features do you need? (e.g., contact form, gallery, payment gateway, login, blog, booking system, etc.)\n\n` +
      `Just type them out!`
    );
    return;
  }

  // ── Budget Selection ───────────────────────────────────────────────────────
  if (data.startsWith("budget:")) {
    const budgetMap: Record<string, string> = {
      under_5k: "Under ₹5,000",
      "5k_10k": "₹5,000 – ₹10,000",
      "10k_25k": "₹10,000 – ₹25,000",
      "25k_50k": "₹25,000 – ₹50,000",
      "50k_plus": "₹50,000+",
      discuss: "Let's discuss",
    };
    const budgetKey = data.replace("budget:", "");
    const budget = budgetMap[budgetKey] ?? "To be discussed";
    const stepData = { ...(session.step_data ?? {}), budget };

    // Determine next step based on current service
    const svc = (stepData.service as string) ?? "website";

    if (svc === "website") {
      await updateSession(telegramId, { step_data: stepData, current_step: "website_q4" });
      await sendMessage(chatId, `✅ Budget noted!\n\n*Question 4 of 7:*\nWhat's your expected deadline? (e.g., 1 week, 1 month, flexible)`);
    } else if (svc === "mobile_app") {
      await updateSession(telegramId, { step_data: stepData, current_step: "mobile_app_q5" });
      await sendMessage(chatId, `✅ Budget noted!\n\n*Question 5 of 6:*\nWhat's your deadline?`);
    } else if (svc === "ai_chatbot") {
      await updateSession(telegramId, { step_data: stepData, current_step: "ai_chatbot_q5" });
      await sendMessage(chatId, `✅ Budget noted!\n\n*Question 5 of 5:*\nShare your contact (phone/email)?`);
    } else {
      // Generic flow (ui_design, automation, database)
      const nextStep = `${svc}_q3`;
      await updateSession(telegramId, { step_data: stepData, current_step: nextStep });
      await sendMessage(chatId, `✅ Budget noted!\n\n*Question 3 of 5:*\nWhat's your deadline?`);
    }
    return;
  }

  // ── Design Ready (Yes/No) ──────────────────────────────────────────────────
  if (data === "website_design:yes" || data === "website_design:no") {
    const hasDesign = data === "website_design:yes";
    const stepData = { ...(session.step_data ?? {}), has_design: hasDesign };
    await updateSession(telegramId, { step_data: stepData, current_step: "website_q6" });
    await sendWithKeyboard(
      chatId,
      `✅ Got it!\n\n*Question 6 of 7:*\nDo you need domain name and/or hosting setup?`,
      YES_NO_KEYBOARD("website_hosting:yes", "website_hosting:no")
    );
    return;
  }

  // ── Hosting Needed (Yes/No) ────────────────────────────────────────────────
  if (data === "website_hosting:yes" || data === "website_hosting:no") {
    const needsHosting = data === "website_hosting:yes";
    const stepData = { ...(session.step_data ?? {}), needs_hosting: needsHosting };
    await updateSession(telegramId, { step_data: stepData, current_step: "website_q7_contact" });
    await sendMessage(chatId, `✅ Noted!\n\n*Question 7 of 7:*\nPlease share your phone number or email so we can send you the final proposal.`);
    return;
  }

  // ── App Platform ───────────────────────────────────────────────────────────
  if (data.startsWith("app_platform:")) {
    const platform = data.replace("app_platform:", "");
    const stepData = { ...(session.step_data ?? {}), platform };
    await updateSession(telegramId, { step_data: stepData, current_step: "mobile_app_q3" });
    await sendMessage(chatId, `✅ ${platform === "both" ? "Cross-platform" : platform.toUpperCase()} it is!\n\n*Question 3 of 6:*\nList the key features you want in the app. (e.g., login, payment, GPS, push notifications, chat, etc.)`);
    return;
  }

  // ── Bot Platform ───────────────────────────────────────────────────────────
  if (data.startsWith("bot_platform:")) {
    const platform = data.replace("bot_platform:", "");
    const stepData = { ...(session.step_data ?? {}), bot_platform: platform };
    await updateSession(telegramId, { step_data: stepData, current_step: "ai_chatbot_q2" });
    await sendMessage(chatId, `✅ ${platform} chatbot!\n\n*Question 2 of 5:*\nWhat should the chatbot do? (e.g., answer FAQs, collect leads, book appointments, handle support, etc.)`);
    return;
  }

  // ── Human Handoff ──────────────────────────────────────────────────────────
  if (data === "handoff:whatsapp") {
    await sendMessage(
      chatId,
      `📱 *Connecting you to our team on WhatsApp!*\n\n` +
      `Click here to start the conversation:\n` +
      `👉 [Chat on WhatsApp](https://wa.me/919882303030?text=Hi+B2CSolution!+I+was+chatting+on+your+Telegram+bot+and+need+help.)\n\n` +
      `Our team typically responds within *30 minutes* during working hours.`
    );
    if (session.conversation_id) {
      await supabase
        .from("telegram_conversations")
        .update({ status: "handed_off", handed_off_at: new Date().toISOString() })
        .eq("id", session.conversation_id);
    }
    return;
  }

  if (data === "handoff:bot") {
    await updateSession(telegramId, { current_step: "idle" });
    await sendWithKeyboard(chatId, `✅ No problem! I'm here to help. What else can I do for you?`, MAIN_MENU_KEYBOARD);
    return;
  }
}

// ─── Main Message Handler ─────────────────────────────────────────────────────

async function handleMessage(msg: TelegramMessage) {
  const chatId = msg.chat.id;
  const from = msg.from;
  if (!from) return;

  const telegramId = from.id;
  const text = msg.text ?? msg.caption ?? "";

  // Upsert user record
  await upsertTelegramUser(from);

  // Get/create session
  const session = await getOrCreateSession(telegramId);

  // Increment message count
  const newCount = session.message_count + 1;
  await updateSession(telegramId, { message_count: newCount });

  // Log incoming message
  if (session.conversation_id) {
    await logMessage(session.conversation_id, telegramId, "user", text || "[media]", "text", msg.message_id);
  }

  // Check handoff threshold
  if (newCount >= HANDOFF_THRESHOLD && newCount % 10 === 0) {
    await sendWithKeyboard(
      chatId,
      `💬 We've been chatting for a while! Would you like to speak directly with our team for personalized assistance?`,
      HANDOFF_KEYBOARD
    );
  }

  // ── Commands ───────────────────────────────────────────────────────────────
  if (text.startsWith("/")) {
    const cmd = text.split(" ")[0].toLowerCase().replace("@b2csolution_bot", "");
    switch (cmd) {
      case "/start":    await handleStart(chatId, from, session); break;
      case "/help":     await handleHelp(chatId); break;
      case "/services": await handleServices(chatId); break;
      case "/pricing":  await handlePricing(chatId); break;
      case "/contact":  await handleContact(chatId); break;
      case "/portfolio":await handlePortfolio(chatId); break;
      case "/faq":      await handleFAQ(chatId); break;
      case "/order":    await startServiceFlow(chatId, telegramId, "website", session); break;
      case "/support":  await handleSupport(chatId, telegramId, session); break;
      case "/status":
        await sendMessage(chatId,
          `📊 *Your Bot Stats*\n\nMessages sent: ${newCount}\n` +
          `Current step: ${session.current_step}\n\n` +
          `For order tracking, visit: https://www.b2csolution.in/dashboard`
        );
        break;
      default:
        await sendMessage(chatId, `❓ Unknown command. Type /help to see all commands.`);
    }
    return;
  }

  // ── Multi-step Flow ────────────────────────────────────────────────────────
  if (session.current_step !== "idle" && text) {
    const handled = await handleFlowStep(chatId, telegramId, text, session);
    if (handled) {
      if (session.conversation_id) {
        await logMessage(session.conversation_id, telegramId, "bot", "[Flow response]", "text");
      }
      return;
    }
  }

  // ── Free-form AI Chat ──────────────────────────────────────────────────────
  if (text) {
    // Fetch recent conversation history for context
    let history: Array<{ role: string; content: string }> = [];
    if (session.conversation_id) {
      const { data: msgs } = await supabase
        .from("telegram_messages")
        .select("role, content")
        .eq("conversation_id", session.conversation_id)
        .order("created_at", { ascending: false })
        .limit(10);
      history = (msgs ?? []).reverse();
    }

    // Show typing indicator
    await fetch(`${TG_API}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, action: "typing" }),
    });

    const aiResponse = await getAIResponse(text, history);
    await sendMessage(chatId, aiResponse);

    if (session.conversation_id) {
      await logMessage(session.conversation_id, telegramId, "bot", aiResponse, "text");
    }
  }
}

// ─── Main Serve Function ──────────────────────────────────────────────────────

serve(async (req) => {
  // Validate webhook secret if configured
  if (WEBHOOK_SECRET) {
    const secret = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (secret !== WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 403 });
    }
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const update: TelegramUpdate = await req.json();

    // Handle callback queries (button presses)
    if (update.callback_query) {
      const cb = update.callback_query;
      const from = cb.from;
      const chatId = cb.message?.chat.id ?? from.id;
      const data = cb.data ?? "";

      await upsertTelegramUser(from);
      const session = await getOrCreateSession(from.id);

      await handleCallback(chatId, from.id, cb.id, data, session);
      return new Response("OK", { status: 200 });
    }

    // Handle regular messages
    if (update.message) {
      await handleMessage(update.message);
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("Bot error:", e);
    // Always return 200 to Telegram to avoid retries
    return new Response("OK", { status: 200 });
  }
});
