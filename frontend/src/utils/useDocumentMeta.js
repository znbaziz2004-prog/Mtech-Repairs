import { useEffect } from 'react';

// Sets the page <title> and meta description for basic per-page SEO, without
// pulling in a routing/head-management dependency. Restores the previous
// values on unmount so navigating between pages doesn't leave stale tags.
export default function useDocumentMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    let metaTag = document.querySelector('meta[name="description"]');
    let created = false;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'description');
      document.head.appendChild(metaTag);
      created = true;
    }
    const prevDescription = metaTag.getAttribute('content');
    if (description) metaTag.setAttribute('content', description);

    return () => {
      document.title = prevTitle;
      if (created) {
        metaTag.remove();
      } else if (prevDescription !== null) {
        metaTag.setAttribute('content', prevDescription);
      }
    };
  }, [title, description]);
}
