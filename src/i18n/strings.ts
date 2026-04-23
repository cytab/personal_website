/**
 * Static translations. No i18n runtime — per-locale pages import
 * the relevant branch directly.
 */

export type Locale = 'en' | 'fr';

export const htmlLang: Record<Locale, string> = {
  en: 'en',
  fr: 'fr-CA', // phase-2-revisions §5 — narration fidelity
};

export const ogLocale: Record<Locale, string> = {
  en: 'en_US',
  fr: 'fr_CA',
};

/** URL prefix for a locale. */
export const localePrefix = (l: Locale) => (l === 'en' ? '/' : '/fr/');

/** Sibling-locale URL for a given current path + locale. */
export function siblingUrl(current: Locale, path: string): string {
  // `path` is the app path without locale prefix. It may be in either
  // locale's slug form (`work/` on EN pages, `travaux/` on FR pages).
  // The slug map is keyed by canonical EN slug, with a reverse lookup
  // for FR-keyed inputs.
  const target: Locale = current === 'en' ? 'fr' : 'en';
  const slugMap: Record<string, { en: string; fr: string }> = {
    '': { en: '', fr: '' },
    'work/': { en: 'work/', fr: 'travaux/' },
    'writing/': { en: 'writing/', fr: 'ecrits/' },
    'about/': { en: 'about/', fr: 'a-propos/' },
  };
  // Reverse lookup: if `path` is a FR slug, find the canonical key.
  let key = path;
  if (!(key in slugMap)) {
    const found = Object.entries(slugMap).find(([, v]) => v.fr === path || v.en === path);
    if (found) key = found[0];
  }
  const mapped = slugMap[key] || { en: path, fr: path };
  return localePrefix(target) + mapped[target];
}

// ---------- Common UI strings ----------

export const ui = {
  en: {
    skipToMain: 'Skip to main content',
    skipToSectionNav: 'Skip to section navigation',
    primaryNav: 'Primary',
    footerNav: 'Footer',
    sectionNav: 'Sections',
    navHome: 'Home',
    navWork: 'Work',
    navWriting: 'Writing',
    navAbout: 'About',
    langSwitch: 'Français',
    langSwitchAriaLabel: 'Switch language to Français',
    pauseAmbient: 'Pause ambient motion',
    resumeAmbient: 'Resume ambient motion',
    openRepo: 'Open the repo',
    seeWork: 'See the work',
    readNotes: 'Read the notes',
    writeToMe: 'Write to me',
    readSource: 'Read the source',
    copyright: '© Cyrille Tabe',
    builtOn: 'Built on Astro, hosted on GitHub Pages, self-hosted everything.',
    loading: 'Loading',
    ready: 'Ready',
    notFoundTitle: 'Route not in plan',
    notFoundBody: "This page doesn't exist — or it did, and I moved it. Head back to the start.",
    backToStart: 'Back to the top',
    notes: {
      none: 'Nothing published here yet. I write slowly on purpose.',
    },
    sensorBoot: {
      stage1: 'Initializing sensors…',
      stage2: 'Converging belief state…',
      stage3: 'Ready.',
    },
  },
  fr: {
    skipToMain: 'Aller au contenu principal',
    skipToSectionNav: 'Aller à la navigation des sections',
    primaryNav: 'Principal',
    footerNav: 'Pied de page',
    sectionNav: 'Sections',
    navHome: 'Accueil',
    navWork: 'Travaux',
    navWriting: 'Écrits',
    navAbout: 'À propos',
    langSwitch: 'English',
    langSwitchAriaLabel: 'Switch language to English',
    pauseAmbient: "Pauser l'animation ambiante",
    resumeAmbient: "Reprendre l'animation ambiante",
    openRepo: 'Ouvrir le dépôt',
    seeWork: 'Voir les travaux',
    readNotes: 'Lire les notes',
    writeToMe: 'Écrivez-moi',
    readSource: 'Lire la source',
    copyright: '© Cyrille Tabe',
    builtOn: 'Fait avec Astro, hébergé sur GitHub Pages, tout auto-hébergé.',
    loading: 'Chargement',
    ready: 'Prêt',
    notFoundTitle: "Route hors plan",
    notFoundBody: "Cette page n'existe pas — ou elle existait, et je l'ai déplacée. Retour au départ.",
    backToStart: 'Retour au début',
    notes: {
      none: "Rien de publié ici pour l'instant. J'écris lentement, par choix.",
    },
    sensorBoot: {
      stage1: 'Initialisation des capteurs…',
      stage2: 'Convergence de l’état de croyance…',
      stage3: 'Prêt.',
    },
  },
} as const;

// ---------- Page meta ----------

export const pageMeta = {
  en: {
    home: {
      title: 'Cyrille Tabe — Robotics software engineer, Montréal',
      description:
        'Robotics software engineer in Montréal. I build decision-making machines that behave well under uncertainty — AGVs, drones, SLAM, a local-first AI assistant.',
    },
    work: {
      title: 'Work — Cyrille Tabe',
      description:
        'Five systems shipped in the physical world — RobotClaw, OpenClaw, a drone autonomy stack, a 4D lattice planner at Noovelia, and SLAM at Odu.',
    },
    writing: {
      title: 'Writing — Cyrille Tabe',
      description:
        'Notes on belief-state systems, planning under uncertainty, and the robots Cyrille ships.',
    },
    about: {
      title: 'About — Cyrille Tabe',
      description:
        'Cyrille Tabe — robotics software engineer in Montréal. Noovelia, Odu Technologie, RobotClaw.',
    },
    notFound: {
      title: 'Route not in plan — Cyrille Tabe',
      description: 'Page not found.',
    },
  },
  fr: {
    home: {
      title: 'Cyrille Tabe — Ingénieur logiciel en robotique, Montréal',
      description:
        'Ingénieur logiciel en robotique à Montréal. Je construis des machines qui décident bien sous incertitude — AGV, drones, SLAM, un assistant IA local.',
    },
    work: {
      title: 'Travaux — Cyrille Tabe',
      description:
        'Cinq systèmes livrés dans le monde réel — RobotClaw, OpenClaw, une pile d’autonomie drone, un planificateur 4D chez Noovelia, du SLAM chez Odu.',
    },
    writing: {
      title: 'Écrits — Cyrille Tabe',
      description: "Notes sur les états de croyance, la planification sous incertitude, et les robots que Cyrille livre.",
    },
    about: {
      title: 'À propos — Cyrille Tabe',
      description: "Cyrille Tabe — ingénieur logiciel en robotique à Montréal. Noovelia, Odu Technologie, RobotClaw.",
    },
    notFound: {
      title: 'Route hors plan — Cyrille Tabe',
      description: 'Page introuvable.',
    },
  },
} as const;
