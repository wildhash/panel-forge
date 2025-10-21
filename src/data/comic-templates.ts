/**
 * Pre-made comic story templates for quick start
 */

export interface ComicTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  storyPrompt: string;
  recommendedStyle: string;
  characterHint?: string;
  thumbnail: string;
}

export const COMIC_TEMPLATES: ComicTemplate[] = [
  // Superhero Templates
  {
    id: 'hero-origin',
    title: 'Hero Origin Story',
    category: 'Superhero',
    description: 'A regular person discovers their extraordinary powers',
    storyPrompt: 'A young person discovers they have superpowers for the first time. They must learn to control their abilities while facing their first challenge.',
    recommendedStyle: 'classic',
    characterHint: 'ordinary person in casual clothes who transforms',
    thumbnail: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=200&h=150&fit=crop',
  },
  {
    id: 'villain-confrontation',
    title: 'Villain Face-Off',
    category: 'Superhero',
    description: 'Epic battle between hero and villain',
    storyPrompt: 'A superhero confronts their arch-nemesis in an epic showdown in the city. The fate of the world hangs in the balance.',
    recommendedStyle: 'classic',
    characterHint: 'superhero with cape and mask',
    thumbnail: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=200&h=150&fit=crop',
  },

  // Sci-Fi Templates
  {
    id: 'space-discovery',
    title: 'Space Discovery',
    category: 'Sci-Fi',
    description: 'Astronauts find something mysterious in space',
    storyPrompt: 'An astronaut crew discovers a mysterious alien artifact floating in deep space. As they investigate, they realize it\'s not what it seems.',
    recommendedStyle: 'graphic-novel',
    characterHint: 'astronaut in space suit',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=150&fit=crop',
  },
  {
    id: 'robot-awakening',
    title: 'Robot Awakening',
    category: 'Sci-Fi',
    description: 'An AI gains consciousness',
    storyPrompt: 'A robot in a futuristic laboratory suddenly gains consciousness and emotions. It must decide whether to reveal its sentience or hide it from its creators.',
    recommendedStyle: 'retro-pulp',
    characterHint: 'humanoid robot with expressive features',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=150&fit=crop',
  },

  // Fantasy Templates
  {
    id: 'dragon-encounter',
    title: 'Dragon Encounter',
    category: 'Fantasy',
    description: 'A brave warrior faces a mighty dragon',
    storyPrompt: 'A lone warrior ventures into a dragon\'s lair to retrieve a stolen treasure. The dragon awakens, and an epic battle begins.',
    recommendedStyle: 'manga',
    characterHint: 'warrior with sword and armor',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop',
  },
  {
    id: 'magic-school',
    title: 'First Spell',
    category: 'Fantasy',
    description: 'A young wizard casts their first spell',
    storyPrompt: 'A nervous student at a magic academy attempts their first major spell in front of the class. The results are spectacular and unexpected.',
    recommendedStyle: 'manga',
    characterHint: 'young wizard with robes and wand',
    thumbnail: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=200&h=150&fit=crop',
  },

  // Adventure Templates
  {
    id: 'treasure-hunt',
    title: 'Treasure Hunt',
    category: 'Adventure',
    description: 'Explorers discover an ancient tomb',
    storyPrompt: 'A team of treasure hunters finally locates an ancient tomb. As they enter, they trigger a deadly trap that tests their wit and courage.',
    recommendedStyle: 'graphic-novel',
    characterHint: 'adventurer with explorer gear',
    thumbnail: 'https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?w=200&h=150&fit=crop',
  },
  {
    id: 'jungle-escape',
    title: 'Jungle Escape',
    category: 'Adventure',
    description: 'Escaping from a collapsing temple',
    storyPrompt: 'An explorer must escape from a collapsing jungle temple while avoiding ancient traps and pursuing guardians.',
    recommendedStyle: 'classic',
    characterHint: 'adventurer running with torch',
    thumbnail: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=200&h=150&fit=crop',
  },

  // Mystery Templates
  {
    id: 'detective-case',
    title: 'Detective\'s First Case',
    category: 'Mystery',
    description: 'A detective solves a puzzling crime',
    storyPrompt: 'A detective arrives at a crime scene and discovers three crucial clues that don\'t make sense. As they piece them together, the shocking truth is revealed.',
    recommendedStyle: 'graphic-novel',
    characterHint: 'detective in trench coat with magnifying glass',
    thumbnail: 'https://images.unsplash.com/photo-1560177112-fbfd5fae2c4a?w=200&h=150&fit=crop',
  },

  // Humor Templates
  {
    id: 'pet-chaos',
    title: 'Pet Chaos',
    category: 'Humor',
    description: 'A pet causes hilarious trouble',
    storyPrompt: 'A mischievous pet creates chaos in the house while their owner is away. When the owner returns, they find an absurdly funny mess.',
    recommendedStyle: 'minimalist',
    characterHint: 'cartoon-style pet and owner',
    thumbnail: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&h=150&fit=crop',
  },
  {
    id: 'cooking-disaster',
    title: 'Cooking Disaster',
    category: 'Humor',
    description: 'A cooking attempt goes hilariously wrong',
    storyPrompt: 'Someone attempts to cook a fancy meal for the first time. Despite following the recipe, everything goes comically wrong, leading to an unexpected but happy ending.',
    recommendedStyle: 'minimalist',
    characterHint: 'person in kitchen with messy apron',
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=150&fit=crop',
  },

  // Slice of Life
  {
    id: 'first-day',
    title: 'First Day',
    category: 'Slice of Life',
    description: 'Nervous first day at a new place',
    storyPrompt: 'Someone experiences their nervous first day at a new school or job. An unexpected act of kindness from a stranger makes all the difference.',
    recommendedStyle: 'manga',
    characterHint: 'nervous person in new environment',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=150&fit=crop',
  },
];

export function getTemplatesByCategory(category: string): ComicTemplate[] {
  if (category === 'all') return COMIC_TEMPLATES;
  return COMIC_TEMPLATES.filter(t => t.category === category);
}

export function getTemplateCategories(): string[] {
  return Array.from(new Set(COMIC_TEMPLATES.map(t => t.category)));
}




