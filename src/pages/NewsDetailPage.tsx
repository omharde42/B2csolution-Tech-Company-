import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Newspaper, MessageCircle, Loader2 } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import SEO from '@/components/SEO';
import NotFound from './NotFound';

const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { items, loading } = useNews();
  const item = items.find((n) => n.slug === slug);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (!item) return <NotFound />;


  return (
    <div className="py-12 sm:py-16">
      <SEO
        title={`${item.title} — B2C Solution News`}
        description={item.excerpt}
        path={`/news/${item.slug}`}
        image={item.coverImage}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: item.title,
          description: item.excerpt,
          datePublished: item.date,
          ...(item.coverImage ? { image: [item.coverImage] } : {}),
          author: { '@type': 'Organization', name: 'B2C Solution' },
          publisher: { '@type': 'Organization', name: 'B2C Solution' },
          mainEntityOfPage: `https://b2csolutionseller.lovable.app/news/${item.slug}`,
        }}
      />
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
        >
          <ArrowLeft size={16} /> Back to News
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 overflow-hidden rounded-2xl border border-border bg-card"
        >
          {item.coverImage && (
            <img src={item.coverImage} alt={item.title} className="h-52 sm:h-72 w-full object-cover" />
          )}
          <div className="p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-5">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Newspaper size={20} />
            </div>
            <div>
              <span className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {item.badge}
              </span>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={11} /> {item.date}
              </p>
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6">
            {item.title}
          </h1>

          <div className="space-y-4">
            {item.content.map((para, i) => (
              <p key={i} className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-border bg-background/50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-display text-sm font-bold">Have a project in mind?</p>
              <p className="text-xs text-muted-foreground mt-1">Message us on WhatsApp — replies within 30 minutes during working hours.</p>
            </div>
            <a
              href="https://api.whatsapp.com/send?phone=919882303030&text=Hi%20B2C%20Solution!%20I%20read%20your%20latest%20update%20and%20want%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 px-4 py-2.5 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366]/20"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </motion.article>

        <div className="mt-8 text-center">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-display font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
          >
            <ArrowLeft size={15} /> View all news &amp; updates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
