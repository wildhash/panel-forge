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
    stylePrompt: 'classic comic book style with bold black outlines, vibrant colors, halftone dot shading, dynamic action poses, professional superhero comic art'
  },
  'manga': {
    name: 'Manga Style',
    description: 'Screentone shading, dynamic angles',
    stylePrompt: 'Japanese manga style with clean linework, screentone shading, dramatic angles, speed lines, expressive faces, black and white with gray tones'
  },
  'graphic-novel': {
    name: 'Graphic Novel',
    description: 'Realistic, muted tones',
    stylePrompt: 'graphic novel illustration style with realistic proportions, detailed shading, muted color palette, atmospheric lighting, sophisticated composition'
  },
  'retro-pulp': {
    name: 'Retro Pulp',
    description: 'Vintage comic aesthetic',
    stylePrompt: 'vintage 1950s pulp comic style with limited color palette, aged paper texture, bold typography, dramatic shadows, retro aesthetic'
  },
  'minimalist': {
    name: 'Minimalist Line Art',
    description: 'Simple, clean lines',
    stylePrompt: 'minimalist line art style with clean simple lines, limited colors, negative space, modern illustration, bold shapes'
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
Create a comic book panel in ${style.stylePrompt}.

PANEL ${panelNumber}/3 - ${composition.shotType.toUpperCase()}:
${composition.description}
Camera angle: ${composition.cameraAngle}

STORY: ${storyPrompt}

CHARACTER APPEARANCE (keep consistent): ${characterToken}

TECHNICAL REQUIREMENTS:
- Panel ${panelNumber} of a 3-panel horizontal comic strip sequence
- Maintain exact character appearance across all panels
- Same art style, color palette, and line quality as other panels
- NO text, speech bubbles, captions, or sound effects in the image
- Leave room at edges for panel borders
- Professional comic book illustration quality
- Clear, legible, high-contrast composition
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
  // Break story into 3 acts with clear progression
  const panel1Focus = `${storyPrompt}. PANEL 1 FOCUS: Establish the scene and introduce characters/setting.`;
  const panel2Focus = `${storyPrompt}. PANEL 2 FOCUS: Show the main action, conflict, or key moment unfolding.`;
  const panel3Focus = `${storyPrompt}. PANEL 3 FOCUS: Depict the outcome, reaction, or payoff to the action.`;
  
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

