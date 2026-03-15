// src/lib/agents/agent-config.ts
// The 7 Super Agents of Hypnotic.
// Each agent represents an entire creative department.
// Agents think, collaborate, and hand off to each other — like a real agency.

export interface AgentRole {
  title:     string;
  emoji:     string;
  function:  string;   // one-line description of what this role does
}

export interface AgentOutput {
  label:  string;
  format: string;   // document / image / video / audio / strategy
}

export interface AgentInput {
  from:   string;   // agent id
  label:  string;
}

export interface HypnoticAgent {
  id:           string;
  name:         string;           // "The Strategist"
  shortName:    string;           // "Strategist"
  codename:     string;           // internal codename, used in chat
  tagline:      string;           // what this agent does in one sentence
  question:     string;           // the question this agent answers
  color:        string;           // brand color for this agent
  accentColor:  string;           // lighter tint
  route:        string;           // primary app route
  icon:         string;           // lucide icon name
  emoji:        string;           // dept emoji
  phase:        number;           // 1-7 in the pipeline

  roles:        AgentRole[];      // internal team roles
  produces:     AgentOutput[];    // what this agent outputs
  receives:     AgentInput[];     // what this agent reads from upstream agents

  model:        'smart' | 'fast'; // which AI model tier this agent uses
  avgDuration:  string;           // typical run time

  // UX
  emptyStatePrompt:  string;      // placeholder text for the input
  exampleBriefs:     string[];    // example prompts
}

export const AGENTS: HypnoticAgent[] = [
  // ── 1. THE STRATEGIST ────────────────────────────────────────────────────
  {
    id:          'strategist',
    name:        'The Strategist',
    shortName:   'Strategist',
    codename:    'ORACLE',
    tagline:     'Translates a vague brief into a sharp creative direction',
    question:    'What should we say, and why?',
    color:       '#7aaee0',
    accentColor: '#7aaee015',
    route:       '/strategist',
    icon:        'Search',
    emoji:       '🧭',
    phase:       1,

    roles: [
      { title: 'Brand Strategist',             emoji: '🎯', function: 'Defines brand positioning and category whitespace' },
      { title: 'Account Planner',              emoji: '📋', function: 'Translates client brief into creative opportunity' },
      { title: 'Consumer Insight Researcher',  emoji: '🔍', function: 'Builds deep audience psychographic profiles' },
      { title: 'Cultural Trends Analyst',      emoji: '🌊', function: 'Identifies cultural tensions the brand can own' },
      { title: 'Market Intelligence Analyst',  emoji: '📊', function: 'Maps the competitive landscape and whitespace' },
      { title: 'Reputation Strategist',        emoji: '🛡️', function: 'Reads brand health, earned media, and sentiment' },
      { title: 'Campaign Architect',           emoji: '🏗️', function: 'Designs the strategic platform and campaign logic' },
    ],

    produces: [
      { label: 'Brand Positioning',       format: 'strategy' },
      { label: 'Audience Insights',       format: 'strategy' },
      { label: 'Campaign Objective',      format: 'strategy' },
      { label: 'Creative Territories',    format: 'strategy' },
      { label: 'Messaging Framework',     format: 'document' },
      { label: 'Cultural Tension Brief',  format: 'strategy' },
    ],

    receives: [],

    model:       'smart',
    avgDuration: '2-4 min',

    emptyStatePrompt: 'Tell me about the brand, product, or campaign problem...',
    exampleBriefs: [
      'Zomato in tier-2 India — what cultural tension is there to own?',
      'Nike Air Max 2025 — how to connect with Gen Z who distrust advertising?',
      'Launching a D2C ayurvedic skincare brand for urban millennials',
      'Spotify India — content strategy for the next 12 months',
    ],
  },

  // ── 2. THE CONCEPT ARCHITECT ─────────────────────────────────────────────
  {
    id:          'concept',
    name:        'The Concept Architect',
    shortName:   'Concept',
    codename:    'MUSE',
    tagline:     'Generates powerful campaign ideas from a strategic brief',
    question:    'What is the big idea?',
    color:       '#C9A96E',
    accentColor: '#C9A96E15',
    route:       '/concept',
    icon:        'Lightbulb',
    emoji:       '💡',
    phase:       2,

    roles: [
      { title: 'Creative Director',    emoji: '👁️', function: 'Owns the vision and creative ambition' },
      { title: 'Concept Developer',    emoji: '🌱', function: 'Develops raw ideas into full campaign concepts' },
      { title: 'Copywriter',           emoji: '✍️', function: 'Writes headlines, scripts, copy, manifestos' },
      { title: 'Art Director',         emoji: '🎨', function: 'Designs the visual expression of the idea' },
      { title: 'Story Architect',      emoji: '📖', function: 'Shapes narrative structure and emotional arc' },
      { title: 'Humour Specialist',    emoji: '😄', function: 'Finds the wit and lightness in the brief' },
      { title: 'Tagline Generator',    emoji: '⚡', function: 'Distils the idea into a memorable phrase' },
    ],

    produces: [
      { label: 'Campaign Concept',    format: 'strategy'  },
      { label: 'Film Concept',        format: 'document'  },
      { label: 'Brand Story',         format: 'document'  },
      { label: 'Tagline',             format: 'document'  },
      { label: 'Script',              format: 'document'  },
      { label: 'Content Plan',        format: 'document'  },
      { label: 'Creative Brief',      format: 'document'  },
    ],

    receives: [
      { from: 'strategist', label: 'Brand positioning + audience insight + campaign objective' },
    ],

    model:       'smart',
    avgDuration: '3-6 min',

    emptyStatePrompt: 'Describe the story or campaign you want to build...',
    exampleBriefs: [
      'A film about a first-generation entrepreneur who never forgets her roots',
      'Nike — 30-second spot about running as an act of defiance, not fitness',
      'Zomato delivery rider who becomes an unlikely local hero in his building',
      'The artisans behind handmade goods in a rapidly digitalising market',
    ],
  },

  // ── 3. THE VISUAL DIRECTOR ───────────────────────────────────────────────
  {
    id:          'visual',
    name:        'The Visual Director',
    shortName:   'Visual',
    codename:    'LENS',
    tagline:     'Defines and executes the visual identity of the campaign',
    question:    'What should it look like?',
    color:       '#a07ae0',
    accentColor: '#a07ae015',
    route:       '/visual',
    icon:        'Aperture',
    emoji:       '🎨',
    phase:       3,

    roles: [
      { title: 'Art Director',           emoji: '🖼️', function: 'Owns the visual language and image direction' },
      { title: 'Visual Style Architect', emoji: '✏️', function: 'Designs the aesthetic system across all formats' },
      { title: 'Photographer',           emoji: '📷', function: 'Directs and generates campaign photography' },
      { title: 'Fashion Stylist',        emoji: '👗', function: 'Designs costume and wardrobe direction' },
      { title: 'Lighting Designer',      emoji: '💡', function: 'Specifies lighting language per scene' },
      { title: 'Graphic Designer',       emoji: '⬛', function: 'Designs type, layout, and print materials' },
      { title: 'Moodboard Creator',      emoji: '🗂️', function: 'Assembles visual reference for the campaign' },
      { title: 'Typography Designer',    emoji: '🔤', function: 'Selects and adapts typefaces to brand voice' },
    ],

    produces: [
      { label: 'Moodboard',             format: 'image'    },
      { label: 'Campaign Imagery',      format: 'image'    },
      { label: 'Visual Style Guide',    format: 'document' },
      { label: 'Design Language',       format: 'document' },
      { label: 'Brand Visual System',   format: 'image'    },
      { label: 'Social Visuals',        format: 'image'    },
      { label: 'Typographic Poster',    format: 'image'    },
    ],

    receives: [
      { from: 'strategist', label: 'Brand archetype + visual DNA + colour palette direction' },
      { from: 'concept',    label: 'Campaign concept + visual territory + art direction notes' },
    ],

    model:       'smart',
    avgDuration: '1-3 min per image',

    emptyStatePrompt: 'Describe what you want to create visually...',
    exampleBriefs: [
      'Hero product shot for a premium chai brand',
      'Create 5 campaign visuals for a Gen Z fashion brand',
      'Brand moodboard for a luxury ayurvedic wellness label',
      'Editorial portrait for a financial services rebrand',
    ],
  },

  // ── 4. THE FILM DIRECTOR ─────────────────────────────────────────────────
  {
    id:          'director',
    name:        'The Film Director',
    shortName:   'Director',
    codename:    'FRAME',
    tagline:     'Translates ideas into cinematic storytelling',
    question:    'How will the story be told?',
    color:       '#e07aa0',
    accentColor: '#e07aa015',
    route:       '/director',
    icon:        'Film',
    emoji:       '🎬',
    phase:       4,

    roles: [
      { title: 'Film Director',         emoji: '🎬', function: 'Owns the cinematic vision and on-set decisions' },
      { title: 'Cinematographer',       emoji: '📹', function: 'Designs the camera language and lighting setup' },
      { title: 'Production Designer',   emoji: '🏛️', function: 'Creates the physical world of the film' },
      { title: 'Casting Director',      emoji: '🧑‍🤝‍🧑', function: 'Selects and designs characters for the film' },
      { title: 'Shot Designer',         emoji: '📐', function: 'Breaks story into specific shots and angles' },
      { title: 'Storyboard Artist',     emoji: '🎞️', function: 'Visualises every scene before generation' },
      { title: 'Location Scout',        emoji: '🗺️', function: 'Designs the visual environment per scene' },
    ],

    produces: [
      { label: 'Film Script',           format: 'document' },
      { label: 'Shot Breakdown',        format: 'document' },
      { label: 'Storyboard',            format: 'image'    },
      { label: 'Scene Structure',       format: 'document' },
      { label: 'Camera Language Brief', format: 'document' },
      { label: 'Keyframe Images',       format: 'image'    },
      { label: 'Generated Scenes',      format: 'video'    },
    ],

    receives: [
      { from: 'concept', label: 'Script + narrative structure + character briefs' },
      { from: 'visual',  label: 'Visual style guide + moodboard + world bible' },
    ],

    model:       'smart',
    avgDuration: '20-45 min',

    emptyStatePrompt: 'Describe the film, scene, or commercial...',
    exampleBriefs: [
      'Brand film: a single mother navigates a city that keeps changing around her',
      '30-second TVC: a product that appears only at the moment someone gives up',
      'Social reel series: Mumbai street food vendors at 5am before the city wakes',
      'Documentary short: the last hand-engraver in Varanasi',
    ],
  },

  // ── 5. THE POST-PRODUCTION MASTER ────────────────────────────────────────
  {
    id:          'post',
    name:        'The Post Master',
    shortName:   'Post',
    codename:    'CUT',
    tagline:     'Shapes the final film — pacing, colour, and motion',
    question:    'How will the story feel when finished?',
    color:       '#e0a07a',
    accentColor: '#e0a07a15',
    route:       '/post',
    icon:        'Scissors',
    emoji:       '✂️',
    phase:       5,

    roles: [
      { title: 'Film Editor',             emoji: '✂️', function: 'Assembles and paces the final film' },
      { title: 'Colorist',                emoji: '🎨', function: 'Grades the colour to match the emotional tone' },
      { title: 'Motion Graphics Designer',emoji: '⚡', function: 'Creates animated titles, transitions, and overlays' },
      { title: 'VFX Supervisor',          emoji: '🌀', function: 'Designs and applies visual effects' },
      { title: 'Title Designer',          emoji: '🔤', function: 'Creates on-screen text, supers, and captions' },
      { title: 'AI Video Enhancer',       emoji: '✨', function: 'Upscales, stabilises, and refines AI-generated footage' },
    ],

    produces: [
      { label: 'Edit Structure',      format: 'document' },
      { label: 'Colour Grade',        format: 'video'    },
      { label: 'Motion Graphics',     format: 'video'    },
      { label: 'VFX Passes',          format: 'video'    },
      { label: 'Final Film',          format: 'video'    },
      { label: 'Multi-Format Exports',format: 'video'    },
    ],

    receives: [
      { from: 'director', label: 'Generated video scenes + storyboard + timeline assembly' },
    ],

    model:       'fast',
    avgDuration: '5-15 min',

    emptyStatePrompt: 'Upload or describe the footage to edit...',
    exampleBriefs: [
      'Edit a 90-second brand film from 6 generated scenes — cinematic pacing',
      'Add motion graphics title cards to a product demo video',
      'Colour grade a product film to match the brand palette',
      'Create 3 aspect-ratio exports from one master cut',
    ],
  },

  // ── 6. THE SOUND & EMOTION COMPOSER ─────────────────────────────────────
  {
    id:          'sound',
    name:        'The Sound Composer',
    shortName:   'Sound',
    codename:    'RESONANCE',
    tagline:     'Creates the emotional layer — music, voice, sound',
    question:    'What will the audience feel?',
    color:       '#7abf8e',
    accentColor: '#7abf8e15',
    route:       '/sound',
    icon:        'Music',
    emoji:       '🎵',
    phase:       6,

    roles: [
      { title: 'Music Director',          emoji: '🎼', function: 'Designs the sonic identity and music strategy' },
      { title: 'Composer',                emoji: '🎹', function: 'Creates original music tracks for the campaign' },
      { title: 'Sound Designer',          emoji: '🔊', function: 'Builds the ambient and foley sound world' },
      { title: 'Voice Casting Director',  emoji: '🎙️', function: 'Selects and directs the voice talent' },
      { title: 'Jingle Composer',         emoji: '🎵', function: 'Creates catchy brand audio identities' },
      { title: 'Audio Mix Engineer',      emoji: '🎚️', function: 'Balances and masters the final audio mix' },
    ],

    produces: [
      { label: 'Brand Music Track',    format: 'audio' },
      { label: 'Sound Design',         format: 'audio' },
      { label: 'Voiceover',            format: 'audio' },
      { label: 'Audio Identity Brief', format: 'document' },
      { label: 'Sound Palette',        format: 'audio' },
      { label: 'Multi-Language VO',    format: 'audio' },
    ],

    receives: [
      { from: 'concept',   label: 'Tone, emotional arc, and audience profile' },
      { from: 'director',  label: 'Script, scene timing, and production notes' },
    ],

    model:       'fast',
    avgDuration: '3-8 min',

    emptyStatePrompt: 'Describe the sound world or music you need...',
    exampleBriefs: [
      'Create a brand music identity for a luxury D2C tea brand',
      'Warm voiceover narration for a 90-second brand film',
      'Pan-India campaign VO in Hindi, Tamil, Telugu, and Bengali',
      'Epic trailer music for a product launch film',
    ],
  },

  // ── 7. THE DISTRIBUTION STRATEGIST ──────────────────────────────────────
  {
    id:          'distribution',
    name:        'The Distribution Strategist',
    shortName:   'Distribution',
    codename:    'SIGNAL',
    tagline:     'Makes the work travel — to the right people, on the right platforms',
    question:    'How will the work reach people?',
    color:       '#e07a7a',
    accentColor: '#e07a7a15',
    route:       '/distribution',
    icon:        'Share2',
    emoji:       '📡',
    phase:       7,

    roles: [
      { title: 'Social Media Strategist',     emoji: '📱', function: 'Adapts content for each platform\'s psychology' },
      { title: 'YouTube Packaging Expert',    emoji: '▶️',  function: 'Optimises thumbnails, titles, and structure' },
      { title: 'Performance Marketing Planner',emoji: '📈', function: 'Designs paid amplification strategy' },
      { title: 'Media Planner',               emoji: '📺', function: 'Allocates budget across channels and formats' },
      { title: 'SEO Strategist',              emoji: '🔍', function: 'Ensures content is discoverable organically' },
      { title: 'Content Calendar Planner',    emoji: '📅', function: 'Schedules and sequences content releases' },
    ],

    produces: [
      { label: 'Distribution Strategy', format: 'document' },
      { label: 'Social Formats',         format: 'image'    },
      { label: 'Platform Thumbnails',    format: 'image'    },
      { label: 'SEO Titles + Tags',      format: 'document' },
      { label: 'Ad Variants',            format: 'video'    },
      { label: 'Content Calendar',       format: 'document' },
      { label: 'Publishing Schedule',    format: 'document' },
    ],

    receives: [
      { from: 'strategist', label: 'Audience profile + channel behaviour' },
      { from: 'concept',    label: 'Content plan + approved outputs' },
      { from: 'post',       label: 'Final cut + platform-adapted exports' },
      { from: 'sound',      label: 'Audio tracks + voiceover files' },
    ],

    model:       'fast',
    avgDuration: '2-5 min',

    emptyStatePrompt: 'Describe what content you want to distribute...',
    exampleBriefs: [
      '30-day social content calendar for a new D2C brand launch',
      'Distribution strategy for a brand film across Instagram, YouTube, and LinkedIn',
      'Media plan for a ₹20L campaign budget across digital and OOH',
      'SEO and YouTube packaging for a product education series',
    ],
  },
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

export const AGENT_BY_ID = Object.fromEntries(AGENTS.map(a => [a.id, a]));
export const AGENT_BY_ROUTE = Object.fromEntries(AGENTS.map(a => [a.route, a]));

export function getAgent(id: string): HypnoticAgent | undefined {
  return AGENT_BY_ID[id];
}

export function getAgentByPhase(phase: number): HypnoticAgent | undefined {
  return AGENTS.find(a => a.phase === phase);
}

export function getNextAgent(currentId: string): HypnoticAgent | undefined {
  const current = AGENT_BY_ID[currentId];
  if (!current) return undefined;
  return getAgentByPhase(current.phase + 1);
}

export function getPreviousAgent(currentId: string): HypnoticAgent | undefined {
  const current = AGENT_BY_ID[currentId];
  if (!current) return undefined;
  return getAgentByPhase(current.phase - 1);
}

// Pipeline status — tracks what each agent has produced for a project
export type AgentStatus = 'idle' | 'running' | 'complete' | 'locked';

export function getAgentStatus(
  agentId: string,
  projectCompletedPhases: number[]
): AgentStatus {
  const agent = AGENT_BY_ID[agentId];
  if (!agent) return 'idle';

  // Phase 1 always available
  if (agent.phase === 1) return projectCompletedPhases.includes(1) ? 'complete' : 'idle';

  // Agent requires previous phase to be complete
  const prevPhase = agent.phase - 1;
  if (!projectCompletedPhases.includes(prevPhase)) return 'locked';
  if (projectCompletedPhases.includes(agent.phase)) return 'complete';
  return 'idle';
}
