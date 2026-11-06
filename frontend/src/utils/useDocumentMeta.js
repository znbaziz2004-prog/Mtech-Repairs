import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'https://www.mtechrepairs.co.uk';

// Sets <title>, meta description and canonical URL per page.
// Restores previous values on unmount so navigation doesn't leave stale tags.
export default function useDocumentMeta(title, description) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Title
    const prevTitle = document.title;
    if (title) document.title = title;

    // Description
    let metaTag = document.querySelector('meta[name="description"]');
    let metaCreated = false;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'description');
      document.head.appendChild(metaTag);
      metaCreated = true;
    }
    const prevDescription = metaTag.getAttribute('content');
    if (description) metaTag.setAttribute('content', description);

    // Canonical
    const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    let linkTag = document.querySelector('link[rel="canonical"]');
    let linkCreated = false;
    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.setAttribute('rel', 'canonical');
      document.head.appendChild(linkTag);
      linkCreated = true;
    }
    const prevCanonical = linkTag.getAttribute('href');
    linkTag.setAttribute('href', SITE + path);

    return () => {
      document.title = prevTitle;

      if (metaCreated) {
        metaTag.remove();
      } else if (prevDescription !== null) {
        metaTag.setAttribute('content', prevDescription);
      }

      if (linkCreated) {
        linkTag.remove();
      } else if (prevCanonical !== null) {
        linkTag.setAttribute('href', prevCanonical);
      }
    };
  }, [title, description, pathname]);
}