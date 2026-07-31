import { useEffect } from "react";

export const SITE_URL = "https://chongsz7279.github.io/my-portfolio";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function toAbsoluteUrl(path = "/") {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function PageSeo({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  jsonLd,
}) {
  const url = toAbsoluteUrl(path);

  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", "Chong Siew Zhen — portfolio preview");
    upsertLink("canonical", url);
  }, [title, description, path, image, url]);

  useEffect(() => {
    if (!jsonLd) return undefined;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.pageSeo = "true";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [jsonLd]);

  return null;
}
