import { Helmet } from 'react-helmet-async';

const SITE = 'https://b2csolutionseller.lovable.app';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: object | object[];
  image?: string;
  type?: string;
}

const SEO = ({ title, description, path, jsonLd, image, type = 'website' }: SEOProps) => {
  const url = `${SITE}${path}`;
  const absImage = image ? (image.startsWith('http') ? image : `${SITE}${image}`) : undefined;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {absImage && <meta property="og:image" content={absImage} />}
      {absImage && <meta name="twitter:image" content={absImage} />}
      {absImage && <meta name="twitter:card" content="summary_large_image" />}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
};


export default SEO;
