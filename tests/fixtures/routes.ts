/**
 * Shared route fixtures for E2E + axe suites.
 *
 * Four routes per locale after the Phase 5 simplification pass.
 */

export type RouteFixture = {
  /** Path under site root (with leading / and trailing /). */
  path: string;
  /** Locale of the route. */
  locale: 'en' | 'fr';
  /** Short name for test titles. */
  name: string;
  /** The pathKey. FR uses localized tokens. */
  pathKey: '' | 'work/' | 'travaux/' | 'research/' | 'recherche/' | 'about/' | 'a-propos/';
};

export const EN_ROUTES: RouteFixture[] = [
  { path: '/',           locale: 'en', name: 'home EN',      pathKey: '' },
  { path: '/work/',      locale: 'en', name: 'work EN',      pathKey: 'work/' },
  { path: '/research/',  locale: 'en', name: 'research EN',  pathKey: 'research/' },
  { path: '/about/',     locale: 'en', name: 'about EN',     pathKey: 'about/' },
];

export const FR_ROUTES: RouteFixture[] = [
  { path: '/fr/',            locale: 'fr', name: 'home FR',      pathKey: '' },
  { path: '/fr/travaux/',    locale: 'fr', name: 'work FR',      pathKey: 'travaux/' },
  { path: '/fr/recherche/',  locale: 'fr', name: 'research FR',  pathKey: 'recherche/' },
  { path: '/fr/a-propos/',   locale: 'fr', name: 'about FR',     pathKey: 'a-propos/' },
];

export const ALL_ROUTES: RouteFixture[] = [...EN_ROUTES, ...FR_ROUTES];

/** Sibling route — used by language-switcher test to assert preservation. */
export const SIBLING: Record<string, string> = {
  '/':              '/fr/',
  '/work/':         '/fr/travaux/',
  '/research/':     '/fr/recherche/',
  '/about/':        '/fr/a-propos/',
  '/fr/':           '/',
  '/fr/travaux/':   '/work/',
  '/fr/recherche/': '/research/',
  '/fr/a-propos/':  '/about/',
};
