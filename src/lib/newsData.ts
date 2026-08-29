export interface NewsItem {
  slug: string;
  date: string;
  badge: string;
  title: string;
  excerpt: string;
  content: string[];
}

export const newsItems: NewsItem[] = [
  {
    slug: 'ai-powered-development-services',
    date: 'April 2026',
    badge: 'New',
    title: 'AI-Powered Development Services',
    excerpt:
      'We now offer AI tool development including chatbots, recommendation engines, and intelligent automation for businesses of all sizes.',
    content: [
      'B2C Solution is expanding beyond websites into full AI-powered development. Small businesses can now get custom AI tools built for their exact workflow — without enterprise pricing.',
      'Our AI services include customer-support chatbots trained on your business FAQs, recommendation engines for ecommerce stores, and intelligent automation that handles repetitive tasks like invoicing, follow-ups, and lead capture.',
      'Every AI project ships with a simple dashboard so you can see what the bot is doing, review conversations, and update answers yourself — no coding required.',
      'Pricing starts at ₹5,500 for an AI Website with a built-in chatbot. Custom AI tools are quoted based on scope. Message us on WhatsApp to discuss your idea.',
    ],
  },
  {
    slug: 'expanded-ecommerce-solutions',
    date: 'March 2026',
    badge: 'Update',
    title: 'Expanded Ecommerce Solutions',
    excerpt:
      'Full-stack ecommerce development with Shopify, custom platforms, payment gateways, and inventory management systems.',
    content: [
      'We have expanded our ecommerce offering to cover the complete journey — from your first product listing to automated order tracking.',
      'What is included: Shopify and custom storefront development, UPI and Razorpay payment gateway integration, inventory and stock management, automated order confirmation on WhatsApp, and sales analytics dashboards.',
      'Every store we build is mobile-first, loads fast, and is optimized for conversions — clear product pages, simple checkout, and trust signals that turn visitors into buyers.',
      'Already have a store? We also take on improvement projects: speed optimization, checkout fixes, and design refreshes. Contact us on WhatsApp for a free audit.',
    ],
  },
];
