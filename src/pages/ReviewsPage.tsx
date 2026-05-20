import Reviews from '@/components/Reviews';
import SEO from '@/components/SEO';

const ReviewsPage = () => (
  <div className="pt-10">
    <SEO
      title="Customer Reviews — B2C Solution"
      description="Read real reviews from small business owners who launched their websites and digital tools with B2C Solution."
      path="/reviews"
    />
    <Reviews />
  </div>
);

export default ReviewsPage;
