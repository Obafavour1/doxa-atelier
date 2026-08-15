import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type SeoProps = {
  title?: string;
  description: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "product";
};

const BRAND_NAME = "DOXA Atelier";
const DEFAULT_IMAGE = "/doxa-nav-gift-collection.png";

const upsertMeta = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

const Seo = ({ title, description, image = DEFAULT_IMAGE, noIndex = false, type = "website" }: SeoProps) => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = title ? `${title} | ${BRAND_NAME}` : `${BRAND_NAME} | Intentional Gifts & Curated Gift Boxes`;
    const canonicalUrl = `${window.location.origin}${location.pathname}`;
    const imageUrl = new URL(image, window.location.origin).toString();

    document.title = pageTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:site_name", BRAND_NAME);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", imageUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [description, image, location.pathname, noIndex, title, type]);

  return null;
};

export default Seo;
