import { SLUG_MAX, slugify } from '@booking-platform/shared';

interface ISlugUniqueOptions {
  fallback?: string;
  maxLength?: number;
}

export async function slugUniqueGenetator(
  name: string,
  exists: (slug: string) => Promise<boolean>,
  { fallback = 'item', maxLength = SLUG_MAX }: ISlugUniqueOptions = {},
): Promise<string> {
  const base = slugify(name).slice(0, maxLength).replace(/-+$/, '') || fallback;
  let slug = base;

  for (let i = 2; await exists(slug); i++) {
    const suffix = `-${i}`;

    slug = base.slice(0, maxLength - suffix.length).replace(/-+$/, '') + suffix;
  }

  return slug;
}
