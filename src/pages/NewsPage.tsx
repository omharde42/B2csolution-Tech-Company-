import NewsSection from '@/components/NewsSection';
import SEO from '@/components/SEO';

const NewsPage = () => (
  <div className="pt-10">
    <SEO
      title="News & Updates — B2C Solution"
      description="Latest news from B2C Solution — new service launches, platform updates, and announcements for small businesses."
      path="/news"
    />
    <NewsSection />
  </div>
);

export default NewsPage;
