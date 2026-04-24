/**
 * copy.ts — Agent 2's deliverable plus FR translations.
 *
 * Scope after the CV-focused restructure:
 * - Private project entries removed.
 * - Work is now scoped to PERSONAL projects only:
 *     1 flagship (RobotClaw) + 3 academic (LaTeX CV §Projects).
 *   Noovelia and Odu Technologie live on About as professional
 *   experience, not on Work.
 * - Hero + closing EN/FR: verbatim Agent 2 §3/§4.
 * - Orientation + About EN/FR: kept from Agent 9 where it still
 *   applies; About body is superseded by the full CV page.
 * - Cluster bodies + project cards: EN verbatim Agent 2 §3; FR in
 *   Agent 2's voice per narrative-architecture §4.
 * - `bodyLong`: expanded body for /work/ and /fr/travaux/.
 */

export const hero = {
  en: {
    eyebrow: '§ 00 / BOOTING PERCEPTION',
    text: 'I build machines that perceive, decide, and act — and I write down what they teach me.',
  },
  fr: {
    eyebrow: '§ 00 / AMORÇAGE',
    text: "Je construis des machines qui perçoivent, décident, agissent — et j'écris ce qu'elles m'apprennent.",
  },
};

export const orientation = {
  en: {
    eyebrow: '§ 01 / ORIENTATION',
    text:
      "I'm a robotics software engineer in Montréal. By day, I work on autonomy at Noovelia — behavior trees, a 4D lattice planner, an MPC that has to agree with physics in real time. On the side, I consult with Odu Technologie on SLAM for sidewalk robots, and I build RobotClaw, a local-first AI assistant that keeps a belief state about the person it's trying to help. The common thread: decisions under uncertainty, written in code that has to run tomorrow morning.",
  },
  fr: {
    eyebrow: '§ 01 / ORIENTATION',
    text:
      "Je suis ingénieur logiciel en robotique à Montréal. Le jour, je travaille sur l'autonomie chez Noovelia — behavior trees, un lattice planner 4D, un MPC qui doit s'accorder avec la physique en temps réel. À côté, je consulte pour Odu Technologie sur du SLAM pour robots de trottoir, et je construis RobotClaw, un assistant IA local qui maintient un belief state sur la personne qu'il essaie d'aider. Le fil commun : décisions sous incertitude, écrites dans du code qui doit tourner demain matin.",
  },
};

export const clusters = {
  perception: {
    en: {
      eyebrow: '§ 03 / PERCEPTION & SPATIAL INTELLIGENCE',
      title: 'Perception & Spatial Intelligence',
      body:
        "A robot's first job is to agree with reality. I work on the pipeline that gets it there: ZED 2i stereo, NVBlox volumetric mapping, PeopleSegNet for the humans in the frame, SLAM when GPS isn't an option. What interests me is the seam — where raw sensor noise becomes a map the planner can trust. Most bugs in autonomy are perception bugs wearing a planner's costume. I spend a lot of time there.",
    },
    fr: {
      eyebrow: '§ 03 / PERCEPTION & INTELLIGENCE SPATIALE',
      title: 'Perception & intelligence spatiale',
      body:
        "Le premier travail d'un robot, c'est d'être d'accord avec le réel. Je travaille sur la chaîne qui l'y conduit : stéréo ZED 2i, cartographie volumétrique NVBlox, PeopleSegNet pour les humains dans l'image, SLAM quand le GPS n'est pas une option. Ce qui m'intéresse, c'est la couture — là où le bruit brut des capteurs devient une carte à laquelle le planificateur peut se fier. La plupart des bogues en autonomie sont des bogues de perception déguisés en bogues de planification. J'y passe beaucoup de temps.",
    },
  },
  planning: {
    en: {
      eyebrow: '§ 04 / PLANNING & DECISION UNDER UNCERTAINTY',
      title: 'Planning & Decision Under Uncertainty',
      body:
        "Once a robot sees, it has to choose. I write planners that assume the world will surprise them: POMDPs for belief-space reasoning, MCTS for intent trees, nonlinear MPC for control that respects dynamics, a 4D lattice planner for a forklift that has to agree with time as well as space. Behavior trees hold the whole thing together. The question underneath all of it: what should I do when I'm not sure?",
    },
    fr: {
      eyebrow: '§ 04 / PLANIFICATION & DÉCISION SOUS INCERTITUDE',
      title: 'Planification & décision sous incertitude',
      body:
        "Une fois qu'un robot voit, il doit choisir. J'écris des planificateurs qui partent du principe que le monde va les surprendre : POMDP pour le raisonnement dans l'espace des croyances, MCTS pour les arbres d'intention, MPC non linéaire pour un contrôle qui respecte la dynamique, un lattice planner 4D pour un chariot qui doit s'accorder avec le temps autant qu'avec l'espace. Les behavior trees tiennent l'ensemble. La question sous toutes les autres : que faire quand je ne suis pas sûr ?",
    },
  },
  human: {
    en: {
      eyebrow: '§ 05 / HUMAN UNDERSTANDING',
      title: 'Human Understanding',
      body:
        "The hardest sensor to model is the person in the room. I'm building toward machines that read intent before they read commands — cognitive state, affect, attention, the small biometric signals that tell you a user is confused before they've said so. This is less about surveillance and more about politeness: a system that waits for the right moment, asks the right question, and doesn't interrupt a thought it doesn't understand.",
    },
    fr: {
      eyebrow: '§ 05 / COMPRÉHENSION HUMAINE',
      title: 'Compréhension humaine',
      body:
        "Le capteur le plus difficile à modéliser, c'est la personne dans la pièce. Je construis vers des machines qui lisent l'intention avant les commandes — état cognitif, affect, attention, les petits signaux biométriques qui disent qu'un utilisateur est confus avant même qu'il le dise. Ce n'est pas une question de surveillance, c'est une question de politesse : un système qui attend le bon moment, pose la bonne question, et n'interrompt pas une pensée qu'il ne comprend pas.",
    },
  },
  systems: {
    en: {
      eyebrow: '§ 06 / SYSTEMS & INFRASTRUCTURE',
      title: 'Systems & Infrastructure',
      body:
        "Autonomy is a distributed systems problem pretending to be a robotics problem. I build on ROS 2 for the robot, MQTT for the nervous system between devices, Redis Queue for work that can wait, and an emerging MCP layer for tools the model can actually call. I prefer local-first: the network is a privilege, not a dependency. If it can run on the device, it should run on the device.",
    },
    fr: {
      eyebrow: '§ 06 / SYSTÈMES & INFRASTRUCTURE',
      title: 'Systèmes & infrastructure',
      body:
        "L'autonomie est un problème de systèmes distribués qui se fait passer pour un problème de robotique. Je bâtis sur ROS 2 pour le robot, MQTT pour le système nerveux entre les appareils, Redis Queue pour le travail qui peut attendre, et une couche MCP émergente pour les outils que le modèle peut réellement appeler. Je préfère le local-first : le réseau est un privilège, pas une dépendance. Si ça peut tourner sur l'appareil, ça doit tourner sur l'appareil.",
    },
  },
};

// ---------- Projects ----------
// Per-locale title / body (40-word homepage card) / bodyLong (150–250-word
// /work/ section). Status is a short pill label, also localized.

type ProjectEntry = {
  slug: string;
  cluster: 'perception' | 'planning' | 'human' | 'systems';
  /** Short list of tech nouns, 2–5 items. Not translated (proper nouns). */
  tech: string[];
  en: { title: string; status: string; body: string; bodyLong: string };
  fr: { title: string; status: string; body: string; bodyLong: string };
};

export const projects: Record<string, ProjectEntry> = {
  robotclaw: {
    slug: 'robotclaw',
    cluster: 'planning',
    tech: ['Ollama (qwen2.5:7b)', 'MQTT', 'ChromaDB', 'SQLite', 'Flutter'],
    en: {
      title: 'RobotClaw',
      status: 'open-source soon',
      body:
        "A local-first AI assistant with a POMDP belief state and an MCTS intent tree over my life. Taught me that memory is the hard part, not reasoning. Next: open-source release, HN launch, and a phone client that actually listens.",
      bodyLong:
        "A local-first AI assistant that keeps a POMDP belief state over what I'm actually trying to do at any given moment, and searches an MCTS intent tree to decide what to surface next. The stack is deliberately boring where it can be: Ollama running qwen2.5:7b on my own machine, an MQTT bus so sensors on the laptop, phone (Flutter client), and watch can all talk to the same brain, ChromaDB for retrieval, SQLite for an auditable log of every decision. What I learned building it: the hard problem isn't reasoning, it's memory — deciding what to keep, what to compress, and what to forget so the next day starts from the right prior. I learned that an assistant that doesn't write down its own mistakes is doomed to ask you the same question twice. Next: an open-source release, the HN launch, and a phone client that listens without either draining the battery or sending audio off-device.",
    },
    fr: {
      title: 'RobotClaw',
      status: 'bientôt open-source',
      body:
        "Un assistant IA local avec un belief state POMDP et un arbre d'intention MCTS sur ma vie. M'a appris que la mémoire, c'est le vrai problème, pas le raisonnement. Ensuite : sortie open-source, lancement sur HN, et un client téléphone qui écoute vraiment.",
      bodyLong:
        "Un assistant IA local qui maintient un belief state POMDP sur ce que j'essaie réellement de faire à tout moment, et qui explore un arbre d'intention MCTS pour décider quoi remonter ensuite. La pile est volontairement sobre quand elle peut l'être : Ollama faisant tourner qwen2.5:7b sur ma propre machine, un bus MQTT pour que les capteurs du portable, du téléphone (client Flutter) et de la montre parlent tous au même cerveau, ChromaDB pour le retrieval, SQLite pour un journal auditable de chaque décision. Ce que j'ai appris en le construisant : le problème dur n'est pas le raisonnement, c'est la mémoire — décider ce qu'on garde, ce qu'on compresse, ce qu'on oublie, pour que le lendemain reparte du bon prior. J'ai appris qu'un assistant qui n'écrit pas ses propres erreurs est condamné à te poser deux fois la même question. Ensuite : sortie open-source, lancement sur HN, et un client téléphone qui écoute sans vider la batterie ni envoyer l'audio hors de l'appareil.",
    },
  },
};

export type ProjectSlug = keyof typeof projects;

/** Stable ordering for listings. Personal flagship only. */
export const projectOrder: ProjectSlug[] = ['robotclaw'];

// ---------- Academic projects ----------
// Condensed from the LaTeX CV's §Projects. Plain text, no motifs.
// Tech strings are proper nouns — not translated.

export type AcademicProject = {
  /** Stable anchor. Not currently linked to from Home. */
  slug: string;
  tech: string[];
  date: { en: string; fr: string };
  en: { title: string; summary: string };
  fr: { title: string; summary: string };
};

export const academicProjects: AcademicProject[] = [
  {
    slug: 'safe-mpc-collision-avoidance',
    tech: ['Python', 'ROS', 'OSQP'],
    date: { en: 'April 2024', fr: 'Avril 2024' },
    en: {
      title: 'Safe MPC Collision Avoidance',
      summary:
        "Collision avoidance via Differential Dynamic Programming for nonlinear optimization in ROS Gazebo.",
    },
    fr: {
      title: 'MPC sûr pour évitement de collision',
      summary:
        "Évitement de collision par Differential Dynamic Programming pour optimisation non linéaire dans ROS Gazebo.",
    },
  },
  {
    slug: 'collision-free-exploration',
    tech: ['OpenAI Gym', 'Python', 'ROS', 'PyTorch'],
    date: { en: 'April 2023', fr: 'Avril 2023' },
    en: {
      title: 'Collision-Free Exploration from Sensor Data',
      summary:
        "Policy gradient and PPO with an MLP; Gazebo and OpenAI Gym integrated for sensor-based exploration.",
    },
    fr: {
      title: 'Exploration sans collision à partir de données capteurs',
      summary:
        "Policy gradient et PPO avec un MLP ; Gazebo et OpenAI Gym intégrés pour l'exploration basée capteurs.",
    },
  },
  {
    slug: 'intersection-navigation',
    tech: ['Python', 'ROS'],
    date: { en: 'September 2022', fr: 'Septembre 2022' },
    en: {
      title: 'Intersection Navigation for Autonomous Vehicles',
      summary:
        "Bézier-curve navigation with ROS for autonomous intersection handling.",
    },
    fr: {
      title: "Navigation en intersection pour véhicules autonomes",
      summary:
        "Navigation par courbes de Bézier avec ROS pour la gestion autonome d'intersections.",
    },
  },
];

export const closing = {
  en: {
    eyebrow: '§ 09 / INVITATION',
    text:
      "If you're building something that has to perceive, decide, or act — or you just want to argue about belief states over coffee — write to me. I answer every email that isn't a pitch deck. cyrilletabepro@gmail.com.",
  },
  fr: {
    eyebrow: '§ 09 / INVITATION',
    text:
      "Si vous bâtissez quelque chose qui doit percevoir, décider ou agir — ou si vous voulez simplement débattre d'états de croyance devant un café — écrivez-moi. Je réponds à chaque courriel qui n'est pas un pitch deck. cyrilletabepro@gmail.com.",
  },
};

export const frontierBridges = {
  en: [
    'neuroscience of decision-making',
    'causal inference',
    'model-based & hierarchical RL',
    'nonlinear control',
    'affective computing',
    'event-driven architectures',
    'information theory',
    'HCI',
    'probabilistic programming',
  ],
  fr: [
    'neurosciences de la décision',
    'inférence causale',
    'RL à modèle & hiérarchique',
    'contrôle non linéaire',
    'informatique affective',
    'architectures événementielles',
    'théorie de l\'information',
    'IHM',
    'programmation probabiliste',
  ],
};

// ---------- About page CV content (translated from the LaTeX CV) ----------
// The canonical source is `CV_CYRILLE_TABE_comments_oeucu/main.tex`.
// Technical nouns (SLAM, MPC, ROS, etc.) stay untranslated in FR.

export const cv = {
  en: {
    name: 'Cyrille Tabe',
    role:
      'Robotics engineer specializing in autonomous navigation, SLAM, motion planning, and ML-based perception for mobile robots.',
    contact: {
      phone: '+1 514-582-4802',
      email: 'cyrilletabepro@gmail.com',
      linkedin: 'linkedin.com/in/cyrille-tabe',
      github: 'github.com/cytab',
      location: 'Montreal, Canada',
    },
    download: {
      label: 'Download CV',
      fallback: 'or request by email',
      note: "PDF is built on deploy; if it's temporarily missing, email me.",
    },
    education: {
      heading: 'Education',
      items: [
        {
          title: 'Master of Science in Electrical Engineering',
          institution: 'Polytechnique Montreal, Montreal, Canada',
          date: 'January 2023 – May 2025',
        },
        {
          title: 'Bachelor of Engineering in Electrical Engineering',
          institution: 'Polytechnique Montreal, Montreal, Canada',
          date: 'August 2018 – December 2022',
        },
      ],
    },
    experience: {
      heading: 'Professional Experience',
      items: [
        {
          company: 'Noovelia',
          role: 'Robotics Software Engineer',
          location: 'Montreal, Canada',
          date: 'July 2025 – Current',
          bullets: [
            'Designed behavior trees for AMR/AGV robots managing complex missions in dynamic industrial environments.',
            'Developed docking and motion-control algorithms with AprilTag-based localization for precise station alignment.',
            'Built a 4D lattice-based local planner and a nonlinear MPC with soft constraints (C++, Python, ROS 2, CasADi, acados), reducing docking deviation by 14% for complex-kinematics robots.',
            'Fine-tuned YOLOv8 on camera data for obstacle detection, improving navigation reliability across diverse facilities.',
          ],
        },
        {
          company: 'Odu Technologie',
          role: 'AI Solution Consultant',
          location: 'Montreal, Canada',
          date: 'January 2023 – January 2026',
          bullets: [
            'Implemented multi-sensor fusion (LiDAR, cameras, IMU) and SLAM pipelines for robust autonomous navigation in semi-structured outdoor environments.',
            'Integrated a vision stack using semantic segmentation for sidewalk navigation on a mobile robot.',
            'Designed a task-planning pipeline for an autonomous snow-removal robot integrating detection, mapping, and trajectory generation, boosting efficiency by 12%.',
            'Cut integration time by 3+ weeks by reverse-engineering critical components for seamless system integration.',
          ],
        },
        {
          company: 'Kinova',
          role: 'Robotic Software Engineer',
          location: 'Montreal, Canada',
          date: 'May 2022 – December 2022',
          bullets: [
            'Developed and optimized C++ control algorithms (collision detection, speed tracking), deployed across multiple robots.',
            'Designed and executed testing and validation procedures, increasing product safety and reliability across robotic platforms.',
            'Developed and enforced coding guidelines, improving code maintainability and increasing team output by 10%.',
            'Modeled waypoint blending for path planning, improving path accuracy by 15% for smoother navigation.',
          ],
        },
        {
          company: 'E-SMART',
          role: 'Embedded Software Engineering Intern',
          location: 'Montreal, Canada',
          date: 'May 2021 – August 2021',
          bullets: [
            'Improved calibration accuracy by 7% by integrating an ADC-DAC calibration system into automotive pedal simulators, complying with quality-control standards.',
            'Implemented unit and system tests in C++ and Python, improving library test coverage and requirements satisfaction.',
            'Reduced data-processing time by 20% by designing Python tools for inventory and data management using CAN protocols.',
          ],
        },
      ],
    },
    research: {
      heading: 'Research Experience',
      items: [
        {
          title: "Master's Thesis — Mobile Robots & Autonomous Systems Lab",
          institution: 'Polytechnique Montreal, Montreal, Canada',
          date: 'Jan 2022 – May 2025',
          bullets: [
            "Enhanced autonomous decision-making in Human–Robot Interaction by modeling multi-agent interactions and uncertain goals with stochastic game theory for improved probabilistic inference, and integrated an advanced solver optimizing efficiency by 20% with expectation maximization and gradient descent.",
          ],
        },
      ],
    },
    skills: {
      heading: 'Technical Skills',
      courses:
        'Robotics, Optimal Control, MPC, Reinforcement Learning, Stochastic Optimization, Motion Planning',
      languagesLabel: 'Languages',
      languages: [
        { name: 'C++', primary: true },
        { name: 'Python', primary: true },
        { name: 'C', primary: false },
        { name: 'Julia', primary: false },
        { name: 'MATLAB', primary: false },
        { name: 'Lua', primary: false },
        { name: 'Shell', primary: false },
      ],
      frameworksLabel: 'Frameworks & Tools',
      frameworks: [
        { name: 'ROS/ROS 2', primary: true },
        { name: 'PyTorch', primary: true },
        { name: 'TensorFlow', primary: false },
        { name: 'Sklearn', primary: false },
        { name: 'Gazebo', primary: true },
        { name: 'MuJoCo', primary: false },
        { name: 'CoppeliaSim', primary: false },
        { name: 'CasADi', primary: true },
        { name: 'acados', primary: false },
        { name: 'OSQP', primary: false },
        { name: 'Simulink', primary: false },
        { name: 'OpenCV', primary: true },
        { name: 'Git', primary: false },
        { name: 'Linux', primary: false },
        { name: 'LaTeX', primary: false },
      ],
      coursesLabel: 'Courses',
    },
    aboutMe: {
      heading: 'About me',
      body:
        "The through-line across all of this is simple: how should a machine act when it doesn't know what the world looks like? I prefer local-first systems, builder-first research, and code that has to run tomorrow morning. The things I'm currently pulling in from outside robotics — neuroscience of decision-making, causal inference, affective computing — are there because the hardest sensor to model is still the person in the room.",
    },
  },
  fr: {
    name: 'Cyrille Tabe',
    role:
      "Ingénieur en robotique spécialisé en navigation autonome, SLAM, planification de mouvement et perception par apprentissage machine pour robots mobiles.",
    contact: {
      phone: '+1 514-582-4802',
      email: 'cyrilletabepro@gmail.com',
      linkedin: 'linkedin.com/in/cyrille-tabe',
      github: 'github.com/cytab',
      location: 'Montréal, Canada',
    },
    download: {
      label: 'Télécharger mon CV',
      fallback: 'ou le demander par courriel',
      note: "Le PDF est compilé au déploiement ; s'il manque temporairement, écrivez-moi.",
      englishVersionNote: '(version anglaise)',
    },
    education: {
      heading: 'Éducation',
      items: [
        {
          title: 'Maîtrise ès sciences en génie électrique',
          institution: 'Polytechnique Montréal, Montréal, Canada',
          date: 'Janvier 2023 – Mai 2025',
        },
        {
          title: 'Baccalauréat en génie électrique',
          institution: 'Polytechnique Montréal, Montréal, Canada',
          date: 'Août 2018 – Décembre 2022',
        },
      ],
    },
    experience: {
      heading: 'Expérience professionnelle',
      items: [
        {
          company: 'Noovelia',
          role: 'Ingénieur logiciel en robotique',
          location: 'Montréal, Canada',
          date: 'Juillet 2025 – Aujourd\'hui',
          bullets: [
            "Conception de behavior trees pour des robots AMR/AGV gérant des missions complexes en environnement industriel dynamique.",
            "Développement d'algorithmes de docking et de contrôle de mouvement avec localisation par AprilTag pour un alignement précis aux stations.",
            "Construction d'un local planner 4D à base de lattice et d'un MPC non linéaire avec contraintes souples (C++, Python, ROS 2, CasADi, acados), réduisant la déviation de docking de 14 % pour des robots à cinématique complexe.",
            "Fine-tuning de YOLOv8 sur données caméra pour la détection d'obstacles, améliorant la fiabilité de la navigation sur plusieurs sites.",
          ],
        },
        {
          company: 'Odu Technologie',
          role: 'Consultant en solutions IA',
          location: 'Montréal, Canada',
          date: 'Janvier 2023 – Janvier 2026',
          bullets: [
            "Implémentation de la fusion multi-capteurs (LiDAR, caméras, IMU) et de pipelines SLAM pour une navigation autonome robuste en environnement extérieur semi-structuré.",
            "Intégration d'une pile vision avec segmentation sémantique pour la navigation sur trottoir d'un robot mobile.",
            "Conception d'un pipeline de planification de tâches pour un robot autonome de déneigement intégrant détection, cartographie et génération de trajectoire, augmentant l'efficacité de 12 %.",
            "Réduction du temps d'intégration de plus de 3 semaines par rétro-ingénierie de composants critiques pour une intégration système fluide.",
          ],
        },
        {
          company: 'Kinova',
          role: 'Ingénieur logiciel en robotique',
          location: 'Montréal, Canada',
          date: 'Mai 2022 – Décembre 2022',
          bullets: [
            "Développement et optimisation d'algorithmes de contrôle en C++ (détection de collision, suivi de vitesse), déployés sur plusieurs robots.",
            "Conception et exécution de procédures de test et validation, augmentant la sécurité produit et la fiabilité sur plusieurs plateformes robotiques.",
            "Rédaction et application de lignes directrices de code, améliorant la maintenabilité et augmentant le rendement de l'équipe de 10 %.",
            "Modélisation du waypoint blending pour la planification de chemin, améliorant la précision de trajectoire de 15 % pour une navigation plus fluide.",
          ],
        },
        {
          company: 'E-SMART',
          role: 'Stagiaire ingénieur logiciel embarqué',
          location: 'Montréal, Canada',
          date: 'Mai 2021 – Août 2021',
          bullets: [
            "Amélioration de la précision de calibration de 7 % par l'intégration d'un système de calibration ADC-DAC dans des simulateurs de pédale automobile, en conformité avec les standards qualité.",
            "Implémentation de tests unitaires et système en C++ et Python, améliorant la couverture de la librairie et la satisfaction des exigences.",
            "Réduction du temps de traitement des données de 20 % par la conception d'outils Python d'inventaire et de gestion de données via les protocoles CAN.",
          ],
        },
      ],
    },
    research: {
      heading: 'Expérience de recherche',
      items: [
        {
          title: 'Mémoire de maîtrise — Mobile Robots & Autonomous Systems Lab',
          institution: 'Polytechnique Montréal, Montréal, Canada',
          date: 'Jan 2022 – Mai 2025',
          bullets: [
            "Amélioration de la prise de décision autonome en Human–Robot Interaction par la modélisation d'interactions multi-agents et d'objectifs incertains via la théorie des jeux stochastiques pour une meilleure inférence probabiliste ; intégration d'un solveur avancé optimisant l'efficacité de 20 % avec expectation maximization et gradient descent.",
          ],
        },
      ],
    },
    skills: {
      heading: 'Compétences techniques',
      courses:
        'Robotique, contrôle optimal, MPC, apprentissage par renforcement, optimisation stochastique, planification de mouvement',
      languagesLabel: 'Langages',
      languages: [
        { name: 'C++', primary: true },
        { name: 'Python', primary: true },
        { name: 'C', primary: false },
        { name: 'Julia', primary: false },
        { name: 'MATLAB', primary: false },
        { name: 'Lua', primary: false },
        { name: 'Shell', primary: false },
      ],
      frameworksLabel: 'Frameworks & outils',
      frameworks: [
        { name: 'ROS/ROS 2', primary: true },
        { name: 'PyTorch', primary: true },
        { name: 'TensorFlow', primary: false },
        { name: 'Sklearn', primary: false },
        { name: 'Gazebo', primary: true },
        { name: 'MuJoCo', primary: false },
        { name: 'CoppeliaSim', primary: false },
        { name: 'CasADi', primary: true },
        { name: 'acados', primary: false },
        { name: 'OSQP', primary: false },
        { name: 'Simulink', primary: false },
        { name: 'OpenCV', primary: true },
        { name: 'Git', primary: false },
        { name: 'Linux', primary: false },
        { name: 'LaTeX', primary: false },
      ],
      coursesLabel: 'Cours',
    },
    aboutMe: {
      heading: 'À propos',
      body:
        "Le fil conducteur à travers tout ça est simple : comment une machine doit-elle agir quand elle ne sait pas à quoi ressemble le monde ? Je préfère les systèmes local-first, la recherche du côté du builder, et le code qui doit tourner demain matin. Ce que je vais chercher en dehors de la robotique — neurosciences de la décision, inférence causale, informatique affective — est là parce que le capteur le plus difficile à modéliser, c'est encore la personne dans la pièce.",
    },
  },
};

// ---------- Legacy About stub (kept for any imports still pointing here) ----------
// The About page is rebuilt around `cv` above. These short strings remain
// exported for backward compatibility with any transitional import.

export const about = {
  en: {
    eyebrow: '§ 09 / ABOUT',
    title: 'About',
    body:
      "I'm Cyrille Tabe, a robotics software engineer based in Montréal. I work on autonomy at Noovelia (industrial AGVs), consult with Odu Technologie on sidewalk-robot SLAM, and spend my evenings building RobotClaw — a local-first AI assistant that reasons with a POMDP belief state over user intent.",
  },
  fr: {
    eyebrow: '§ 09 / À PROPOS',
    title: 'À propos',
    body:
      "Je m'appelle Cyrille Tabe, ingénieur logiciel en robotique basé à Montréal. Je travaille sur l'autonomie chez Noovelia (AGV industriels), je consulte pour Odu Technologie sur du SLAM de robot de trottoir, et je passe mes soirées à construire RobotClaw — un assistant IA local qui raisonne avec un état de croyance POMDP sur l'intention utilisateur.",
  },
};
