/**
 * copy.ts — Agent 2's deliverable plus FR translations (Phase 4 bugfix).
 *
 * - Hero + closing EN/FR: verbatim Agent 2 §3/§4. Do not paraphrase.
 * - Orientation + About EN/FR: verbatim Agent 9's existing translation.
 * - Cluster bodies + project cards: EN verbatim Agent 2 §3; FR written
 *   in Agent 2's voice per narrative-architecture §4 voice notes
 *   (tutoiement-neutral; technical terms stay in English — SLAM,
 *   POMDP, MCTS, MPC, ROS 2, behavior tree, lattice planner, belief
 *   state). Pro-polish can replace these later without widening the
 *   locale shape.
 * - `bodyLong`: expanded 150–250-word bodies for /work/ and
 *   /fr/travaux/ per Agent 4 §2.2. "does · taught · next" spine,
 *   deeper. Grounded strictly in the dossier.
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
  'noovelia-lattice': {
    slug: 'noovelia-lattice',
    cluster: 'planning',
    tech: ['4D lattice planner', 'nonlinear MPC', 'behavior trees', 'YOLOv8', 'Redis Queue'],
    en: {
      title: 'Noovelia lattice planner',
      status: 'shipped',
      body:
        "A 4D lattice planner with nonlinear MPC on an autonomous forklift — behavior trees on top, YOLOv8 for perception, Redis Queue for orchestration. Taught me a good planner is mostly a great cost function. Next: I can't say yet.",
      bodyLong:
        "A 4D lattice planner running on an autonomous forklift at Noovelia, with nonlinear MPC handling the tracking and behavior trees above both deciding what the robot is trying to accomplish at any given moment. YOLOv8 does perception for obstacles and pallets; Redis Queue orchestrates the longer-horizon work that doesn't need to be on the control thread. What I learned: a good planner is mostly a great cost function. The search algorithm matters, the discretization matters, but the thing that moves the robot from 'technically correct' to 'people actually trust it on the warehouse floor' is whether the cost function agrees with the operators' intuition — about where a forklift should slow down, which corners to cut wide, how much to respect a human walking into the aisle. I also learned that a 4D lattice is worth the bookkeeping: time is not a nuisance coordinate, it's the whole reason the plan is valid. Next: I can't say yet.",
    },
    fr: {
      title: 'Lattice planner Noovelia',
      status: 'livré',
      body:
        "Un lattice planner 4D avec MPC non linéaire sur un chariot autonome — behavior trees au-dessus, YOLOv8 pour la perception, Redis Queue pour l'orchestration. M'a appris qu'un bon planificateur, c'est surtout une excellente fonction de coût. Ensuite : je ne peux pas encore le dire.",
      bodyLong:
        "Un lattice planner 4D qui tourne sur un chariot autonome chez Noovelia, avec un MPC non linéaire qui gère le suivi et des behavior trees au-dessus qui décident à tout moment de ce que le robot cherche à accomplir. YOLOv8 fait la perception des obstacles et des palettes ; Redis Queue orchestre le travail à plus long horizon qui n'a pas à vivre sur le fil de contrôle. Ce que j'ai appris : un bon planificateur, c'est surtout une excellente fonction de coût. L'algorithme de recherche compte, la discrétisation compte, mais ce qui fait passer le robot de « techniquement correct » à « les opérateurs lui font confiance sur le plancher d'entrepôt », c'est que la fonction de coût soit d'accord avec leur intuition — sur où un chariot devrait ralentir, quels virages couper large, combien respecter un humain qui entre dans l'allée. J'ai aussi appris que le lattice 4D vaut sa comptabilité : le temps n'est pas une coordonnée encombrante, c'est la raison même pour laquelle le plan tient. Ensuite : je ne peux pas encore le dire.",
    },
  },
  'odu-slam': {
    slug: 'odu-slam',
    cluster: 'perception',
    tech: ['SLAM', 'lidar', 'ROS 2'],
    en: {
      title: 'Odu SLAM',
      status: 'in production',
      body:
        "SLAM-based navigation for a sidewalk robot in real Montréal weather — ice, pedestrians, occluded lidar returns, the works. Taught me the map is never the territory, especially in February. Next: cross-season loop closure and semantic landmarks.",
      bodyLong:
        "SLAM-based navigation for a sidewalk robot, in real Montréal weather — ice, slush, pedestrians, parked cars that weren't there yesterday, lidar returns occluded by a snowbank that arrived overnight. The job is to keep the robot localized and the local costmap honest while everything around it is actively conspiring against both. What I learned: the map is never the territory, especially in February. A map built in October is a very confident lie by mid-January. I stopped chasing the perfect one-shot map and started treating the map as a slowly-decaying belief that has to be re-earned every run. I also learned how much sidewalk robotics is a pedestrian-politeness problem wearing a SLAM jacket — if the robot stops the right way, half of the perception errors stop mattering. Next: cross-season loop closure that can re-align the summer map to the winter one without a human in the loop, and semantic landmarks (mailboxes, hydrants, curb cuts) that don't move when the snow does.",
    },
    fr: {
      title: 'SLAM Odu',
      status: 'en production',
      body:
        "Navigation par SLAM pour un robot de trottoir, dans la vraie météo de Montréal — glace, piétons, retours lidar occlus, le lot. M'a appris que la carte n'est jamais le territoire, surtout en février. Ensuite : fermeture de boucle inter-saisons et amers sémantiques.",
      bodyLong:
        "Navigation par SLAM pour un robot de trottoir, dans la vraie météo de Montréal — glace, gadoue, piétons, voitures stationnées qui n'étaient pas là hier, retours lidar occlus par un banc de neige arrivé dans la nuit. Le travail, c'est de garder le robot localisé et la costmap locale honnête pendant que tout autour conspire activement contre les deux. Ce que j'ai appris : la carte n'est jamais le territoire, surtout en février. Une carte construite en octobre est un mensonge très confiant à la mi-janvier. J'ai arrêté de courir après la carte parfaite d'un seul coup et j'ai commencé à la traiter comme une croyance qui se dégrade lentement et qu'il faut regagner à chaque passage. J'ai aussi appris à quel point la robotique de trottoir est un problème de politesse piétonne déguisé en SLAM — si le robot s'arrête de la bonne manière, la moitié des erreurs de perception cessent d'avoir de l'importance. Ensuite : fermeture de boucle inter-saisons capable de réaligner la carte d'été sur celle d'hiver sans humain dans la boucle, et amers sémantiques (boîtes aux lettres, bornes, bateaux de trottoir) qui ne bougent pas quand la neige, elle, bouge.",
    },
  },
};

export type ProjectSlug = keyof typeof projects;

/** Stable ordering for listings. */
export const projectOrder: ProjectSlug[] = [
  'robotclaw',
  'noovelia-lattice',
  'odu-slam',
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

export const about = {
  en: {
    eyebrow: '§ 09 / ABOUT',
    title: 'About',
    body:
      "I'm Cyrille Tabe, a robotics software engineer based in Montréal. I work on autonomy at Noovelia (industrial AGVs), consult with Odu Technologie on sidewalk-robot SLAM, and spend my evenings building RobotClaw — a local-first AI assistant that reasons with a POMDP belief state over user intent. I hold an M.Eng. in Electrical Engineering from Polytechnique Montréal, and I work fully bilingually in French and English. The through-line across everything I ship is simple: how should a machine act when it does not know what the world looks like?",
    cvLabel: 'CV',
    cvBody:
      "I'm happy to send the latest CV by email — write to me with the subject line \"CV request\" and I'll reply from the same address.",
    cvCta: 'Request the CV by email',
  },
  fr: {
    eyebrow: '§ 09 / À PROPOS',
    title: 'À propos',
    body:
      "Je m'appelle Cyrille Tabe, ingénieur logiciel en robotique basé à Montréal. Je travaille sur l'autonomie chez Noovelia (AGV industriels), je consulte pour Odu Technologie sur du SLAM de robot de trottoir, et je passe mes soirées à construire RobotClaw — un assistant IA local qui raisonne avec un état de croyance POMDP sur l'intention utilisateur. Je suis titulaire d'une M. Ing. en génie électrique de Polytechnique Montréal et je travaille de façon parfaitement bilingue. Le fil conducteur est simple : comment une machine doit-elle agir quand elle ne sait pas à quoi ressemble le monde ?",
    cvLabel: 'CV',
    cvBody:
      "Je t'envoie volontiers la dernière version du CV par courriel — écris-moi avec « demande de CV » en objet, je réponds depuis la même adresse.",
    cvCta: 'Demander le CV par courriel',
  },
};
