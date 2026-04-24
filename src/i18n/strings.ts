/**
 * Static translations. No i18n runtime — per-locale pages import
 * the relevant branch directly.
 */

export type Locale = 'en' | 'fr';

export const htmlLang: Record<Locale, string> = {
  en: 'en',
  fr: 'fr-CA',
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
    'research/': { en: 'research/', fr: 'recherche/' },
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
    primaryNav: 'Primary',
    footerNav: 'Footer',
    navHome: 'Home',
    navWork: 'Work',
    navResearch: 'Research',
    navAbout: 'About',
    langSwitch: 'FR',
    langSwitchAriaLabel: 'Switch language to Français',
    writeToMe: 'Write to me',
    copyright: '© Cyrille Tabe',
    builtOn: 'Built on Astro. Hosted on GitHub Pages.',
    notFoundTitle: 'Route not in plan',
    notFoundBody: "This page doesn't exist — or it did, and I moved it. Head back to the start.",
    backToStart: 'Back to the top',
    cmdK: {
      hint: 'Press',
      open: 'Command palette',
      searchPlaceholder: 'Type a command or search…',
      empty: 'No matches',
      groupNav: 'Navigate',
      groupJump: 'Jump to section',
      groupLang: 'Language',
      groupActions: 'Actions',
      navHome: 'Home',
      navWork: 'Work',
      navResearch: 'Research',
      navAbout: 'About',
      jumpRobotClaw: 'RobotClaw',
      jumpExperience: 'Professional Experience',
      jumpResearch: 'Research',
      jumpSkills: 'Skills',
      jumpContact: 'Contact',
      switchToFR: 'Switch to Français',
      switchToEN: 'Switch to English',
      copyEmail: 'Copy email',
      downloadCV: 'Download CV',
      openGitHub: 'Open GitHub',
      openLinkedIn: 'Open LinkedIn',
    },
    copy: {
      label: 'Copy email',
      toast: 'Copied to clipboard',
      failed: 'Copy failed',
    },
  },
  fr: {
    skipToMain: 'Aller au contenu principal',
    primaryNav: 'Principal',
    footerNav: 'Pied de page',
    navHome: 'Accueil',
    navWork: 'Travaux',
    navResearch: 'Recherche',
    navAbout: 'À propos',
    langSwitch: 'EN',
    langSwitchAriaLabel: 'Switch language to English',
    writeToMe: 'Écrivez-moi',
    copyright: '© Cyrille Tabe',
    builtOn: 'Fait avec Astro. Hébergé sur GitHub Pages.',
    notFoundTitle: 'Route hors plan',
    notFoundBody: "Cette page n'existe pas — ou elle existait, et je l'ai déplacée. Retour au départ.",
    backToStart: 'Retour au début',
    cmdK: {
      hint: 'Appuyez sur',
      open: 'Palette de commandes',
      searchPlaceholder: 'Tapez une commande ou recherchez…',
      empty: 'Aucun résultat',
      groupNav: 'Naviguer',
      groupJump: 'Aller à une section',
      groupLang: 'Langue',
      groupActions: 'Actions',
      navHome: 'Accueil',
      navWork: 'Travaux',
      navResearch: 'Recherche',
      navAbout: 'À propos',
      jumpRobotClaw: 'RobotClaw',
      jumpExperience: 'Expérience professionnelle',
      jumpResearch: 'Recherche',
      jumpSkills: 'Compétences',
      jumpContact: 'Contact',
      switchToFR: 'Passer au Français',
      switchToEN: 'Passer à l\'anglais',
      copyEmail: 'Copier le courriel',
      downloadCV: 'Télécharger le CV',
      openGitHub: 'Ouvrir GitHub',
      openLinkedIn: 'Ouvrir LinkedIn',
    },
    copy: {
      label: 'Copier le courriel',
      toast: 'Copié dans le presse-papiers',
      failed: 'Échec de la copie',
    },
  },
} as const;

// ---------- Page meta ----------

export const pageMeta = {
  en: {
    home: {
      title: 'Cyrille Tabe — Robotics software engineer, Montréal',
      description:
        'Robotics software engineer in Montréal. I build decision-making machines that behave well under uncertainty — AGVs, SLAM, motion planning, a local-first AI assistant.',
    },
    work: {
      title: 'Work — Cyrille Tabe',
      description:
        'Systems shipped in the physical world — RobotClaw, a 4D lattice planner at Noovelia, and SLAM at Odu.',
    },
    research: {
      title: 'Research — Cyrille Tabe',
      description:
        'Four research clusters: perception and spatial intelligence, planning and decision under uncertainty, human understanding, systems and infrastructure.',
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
        'Ingénieur logiciel en robotique à Montréal. Je construis des machines qui décident bien sous incertitude — AGV, SLAM, planification, un assistant IA local.',
    },
    work: {
      title: 'Travaux — Cyrille Tabe',
      description:
        'Systèmes livrés dans le monde réel — RobotClaw, un planificateur 4D chez Noovelia, du SLAM chez Odu.',
    },
    research: {
      title: 'Recherche — Cyrille Tabe',
      description:
        'Quatre clusters de recherche : perception et intelligence spatiale, planification et décision sous incertitude, compréhension humaine, systèmes et infrastructure.',
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
