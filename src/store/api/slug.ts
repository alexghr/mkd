import { Slug } from '../state';

export function generateSlug(): Slug {
  return Math.random().toString(16).slice(2);
}

export function putSlugInUrl(slug: Slug): void {
  window.history.replaceState(null, slug, slug);
}

export function readSlugFromUrl(): Slug | null {
  return window.location.pathname.slice(1) || null;
}
