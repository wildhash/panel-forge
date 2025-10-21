/**
 * Comic Visual Continuity System
 * Ensures character and style consistency across all 3 panels
 */

export interface ArtStyle {
  name: string;
  description: string;
  stylePrompt: string;
}

export const ART_STYLES: Record<string, ArtStyle> = {
  'classic': {
    name: 'Classic Comic Book',
    description: 'Bold lines, vibrant colors',
    stylePrompt: 'A single unified illustration in classic American comic book style. Bold black ink outlines, vibrant primary colors, Ben-Day dots halftone shading, dynamic superhero poses. Professional comic art with strong composition and clear focal point. NOT a collage or multiple panels - ONE cohesive scene only.'
  },
  'manga': {
    name: 'Manga Style',
    description: 'Screentone shading, dynamic angles',
    stylePrompt: 'A single unified illustration in Japanese manga style. Clean precise linework, screentone patterns for shading, dramatic perspective angles, motion speed lines, expressive character faces. Black and white with gray tones. Professional manga art with strong composition. NOT a collage or multiple panels - ONE cohesive scene only.'
  },
  'graphic-novel': {
    name: 'Graphic Novel',
    description: 'Realistic, muted tones',
    stylePrompt: 'A single unified illustration in sophisticated graphic novel style. Realistic human proportions, painterly shading and rendering, muted earthy color palette, cinematic atmospheric lighting, mature illustration aesthetic. Professional graphic novel art with strong composition. NOT a collage or multiple panels - ONE cohesive scene only.'
  },
  'retro-pulp': {
    name: 'Retro Pulp',
    description: 'Vintage comic aesthetic',
    stylePrompt: 'A single unified illustration in vintage 1950s pulp magazine style. Limited spot color palette (red, yellow, blue), aged yellowed paper texture, dramatic noir shadows, retro mid-century illustration. Professional pulp art with strong composition. NOT a collage or multiple panels - ONE cohesive scene only.'
  },
  'minimalist': {
    name: 'Minimalist Line Art',
    description: 'Simple, clean lines',
    stylePrompt: 'A single unified illustration in minimalist line art style. Clean simple vector-style lines, limited flat color palette, strategic use of negative white space, modern geometric shapes, contemporary illustration aesthetic. Professional minimal design with strong composition. NOT a collage or multiple panels - ONE cohesive scene only.'
  }
};

export interface PanelComposition {
  panelNumber: 1 | 2 | 3;
  shotType: string;
  description: string;
  cameraAngle: string;
}

export const PANEL_COMPOSITIONS: PanelComposition[] = [
  {
    panelNumber: 1,
    shotType: 'establishing shot',
    description: 'Wide shot to establish setting and characters',
    cameraAngle: 'eye level or slightly high angle'
  },
  {
    panelNumber: 2,
    shotType: 'action shot',
    description: 'Medium shot focusing on action or dialogue',
    cameraAngle: 'dynamic angle to emphasize action'
  },
  {
    panelNumber: 3,
    shotType: 'reaction shot',
    description: 'Close-up or reveal showing consequence or reaction',
    cameraAngle: 'close angle for emotional impact'
  }
];

export interface CharacterToken {
  appearance: string;
  clothing: string;
  distinctiveFeatures: string;
}

/**
 * Extract character descriptions from user input and images
 */
export function buildCharacterToken(
  userDescription: string,
  hasReferenceImages: boolean
): string {
  if (hasReferenceImages) {
    return `Maintain exact character appearance from the reference image. ${userDescription}`;
  }
  return userDescription;
}

/**
 * Build a consistent prompt for a specific panel
 */
export function buildPanelPrompt(
  panelNumber: 1 | 2 | 3,
  storyPrompt: string,
  artStyleKey: string,
  characterToken: string
): string {
  const style = ART_STYLES[artStyleKey] || ART_STYLES['classic'];
  const composition = PANEL_COMPOSITIONS[panelNumber - 1];
  
  const basePrompt = `
${style.stylePrompt}

SCENE DESCRIPTION:
This is panel ${panelNumber} of 3 in a comic strip sequence.
${composition.shotType.toUpperCase()} - ${composition.description}
Camera angle: ${composition.cameraAngle}

STORY CONTEXT: ${storyPrompt}

CHARACTER DETAILS: ${characterToken}

CRITICAL INSTRUCTIONS:
✓ Create ONE single unified illustration (not a collage, not multiple sub-panels)
✓ Follow the ${style.name} aesthetic exactly
✓ Use ${composition.shotType} framing for this scene
✓ Keep character appearance EXACTLY consistent with previous panels
✓ Maintain the same art style, color palette, and rendering quality
✓ NO text, speech bubbles, captions, sound effects, or typography in the image
✓ NO panel borders or frames within the image
✓ Professional single-scene illustration with clear focal point
✓ Composition suitable for horizontal comic panel format

GENERATE: A single cohesive ${composition.shotType} illustration showing this moment in the story.
`.trim();

  return basePrompt;
}

/**
 * Build prompts for all 3 panels with story progression
 */
export function buildThreePanelPrompts(
  storyPrompt: string,
  artStyleKey: string,
  characterToken: string
): string[] {
  // Break story into 3-act structure with clear visual progression
  const panel1Focus = `SETUP: ${storyPrompt}. Show the initial scene - establish the setting, introduce the characters, and set up what's about to happen. This is the "before" moment that creates context.`;
  
  const panel2Focus = `ACTION: ${storyPrompt}. Show the main action happening NOW - the key dramatic moment, the conflict unfolding, the pivotal event in progress. This is the "during" moment at its peak.`;
  
  const panel3Focus = `PAYOFF: ${storyPrompt}. Show the result or consequence - the aftermath, the reaction, the resolution or cliffhanger. This is the "after" moment that delivers impact.`;
  
  return [
    buildPanelPrompt(1, panel1Focus, artStyleKey, characterToken),
    buildPanelPrompt(2, panel2Focus, artStyleKey, characterToken),
    buildPanelPrompt(3, panel3Focus, artStyleKey, characterToken)
  ];
}

/**
 * Quality checks for generated panels
 */
export function validatePanelQuality(imageUrl: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Basic validation (can be expanded)
  if (!imageUrl || imageUrl.length === 0) {
    errors.push('No image URL provided');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

