/**
 * Shared route fixtures for E2E + axe suites.
 *
 * Routes are taken from Agent 4 §4.2. Writing routes are intentionally
 * absent — per Agent 4 §2.3 ("don't ship empty indexes"), /writing/ and
 * /fr/ecrits/ are pruned from the build until the first post lands.
 * They'll re-enter this fixture when the route re-enables. See
 * docs/qa/bugfix-report.md P1-9 for the decision trail.
 */

export type RouteFixture = {
  /** Path under site root (with leading / and trailing /). */
  path: string;
  /** Locale of the route. */
  locale: 'en' | 'fr';
  /** Short name for test titles. */
  name: string;
  /** The pathKey (matches Agent 4 §4.2 mapping). FR uses localized tokens. */
  pathKey: '' | 'work/' | 'travaux/' | 'about/' | 'a-propos/';
};

export const EN_ROUTES: RouteFixture[] = [
  { path: '/',         locale: 'en', name: 'home EN',    pathKey: '' },
  { path: '/work/',    locale: 'en', name: 'work EN',    pathKey: 'work/' },
  { path: '/about/',   locale: 'en', name: 'about EN',   pathKey: 'about/' },
];

export const FR_ROUTES: RouteFixture[] = [
  { path: '/fr/',           locale: 'fr', name: 'home FR',    pathKey: '' },
  { path: '/fr/travaux/',   locale: 'fr', name: 'work FR',    pathKey: 'travaux/' },
  { path: '/fr/a-propos/',  locale: 'fr', name: 'about FR',   pathKey: 'a-propos/' },
];

export const ALL_ROUTES: RouteFixture[] = [...EN_ROUTES, ...FR_ROUTES];

/** Sibling route — used by language-switcher test to assert preservation. */
export const SIBLING: Record<string, string> = {
  '/':             '/fr/',
  '/work/':        '/fr/travaux/',
  '/about/':       '/fr/a-propos/',
  '/fr/':          '/',
  '/fr/travaux/':  '/work/',
  '/fr/a-propos/': '/about/',
};
