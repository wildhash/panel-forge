# Panel Forge - AI Comic Creator Guide

## Overview

Panel Forge is an AI-powered comic strip creator that generates 3-panel comic strips with visual continuity. It uses OpenAI's DALL-E 3 to create consistent, professional-looking comic panels following classic storytelling structure.

## Features

### ✨ Core Features
- **5 Art Styles**: Classic Comic Book, Manga, Graphic Novel, Retro Pulp, and Minimalist Line Art
- **3-Panel Structure**: Setup → Action → Payoff (following comic storytelling conventions)
- **Visual Continuity**: Characters and settings stay consistent across all panels
- **Real-time Generation**: Watch panels being created with live progress updates
- **Interactive Selection**: Click to select your preferred art style
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile

### 🎨 Art Styles

1. **Classic Comic Book** (key: `classic`)
   - Bold black outlines
   - Vibrant colors
   - Halftone dot shading
   - Dynamic superhero aesthetic

2. **Manga Style** (key: `manga`)
   - Clean linework
   - Screentone shading
   - Dramatic angles
   - Japanese manga aesthetic

3. **Graphic Novel** (key: `graphic-novel`)
   - Realistic proportions
   - Detailed shading
   - Muted color palette
   - Sophisticated composition

4. **Retro Pulp** (key: `retro-pulp`)
   - Vintage 1950s style
   - Limited color palette
   - Aged paper texture
   - Dramatic shadows

5. **Minimalist Line Art** (key: `minimalist`)
   - Simple, clean lines
   - Limited colors
   - Negative space emphasis
   - Modern illustration style

## Setup Instructions

### 1. Install Dependencies

All required dependencies are already installed:
```bash
npm install
```

Key packages:
- `openai` - For DALL-E 3 image generation
- `framer-motion` - For smooth animations
- `lucide-react` - For UI icons
- `@clerk/nextjs` - For authentication (optional)

### 2. Configure OpenAI API Key

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env` file:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important**: Without a valid OpenAI API key, comic generation will not work.

### 3. Database Setup

The database is already configured with the necessary fields:
- `artStyle` - Stores the selected comic art style
- `characterReference` - Stores character descriptions
- `stripOrder` - Tracks multi-strip comics

If you need to reset the database:
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## How to Use

### Creating Your First Comic Strip

1. **Choose an Art Style**
   - Browse the 5 art style options on the home page
   - Click on your preferred style (it will show a blue ring when selected)

2. **Describe Your Story**
   - Type your comic story in the input box
   - Keep it concise but descriptive (10-500 characters)
   - Example: "A cat discovers a portal to another dimension in their litter box"

3. **Add Character Details** (Optional)
   - Upload reference images for characters
   - Add character descriptions for better consistency

4. **Generate**
   - Click "Generate Comic Strip" or press Enter
   - Watch as each panel is created sequentially
   - Generation takes approximately 30-90 seconds per panel

5. **Save & Export**
   - Save your comic to the studio
   - Export as high-resolution image (coming soon)

### Tips for Great Comics

- **Be Specific**: Include details about setting, characters, and action
- **Visual Storytelling**: Think about what viewers will see, not just what happens
- **3-Act Structure**: 
  - Panel 1: Establish the scene and characters
  - Panel 2: Show the main action or conflict
  - Panel 3: Reveal the consequence or punchline
- **Character Consistency**: Describe distinctive features (clothing, hair color, props)

### Example Prompts

**Action/Adventure:**
```
"A young wizard accidentally summons a dragon while practicing spells in their bedroom"
```

**Comedy:**
```
"A robot tries to blend in at a human yoga class but keeps short-circuiting in awkward poses"
```

**Drama:**
```
"Two strangers discover they've been unknowingly pen pals for years when they meet at a coffee shop"
```

**Slice of Life:**
```
"A barista notices their regular customer always orders the same complicated drink, decides to memorize it"
```

## Technical Architecture

### Key Components

**Frontend:**
- `src/app/page.tsx` - Home page with style selection and story input
- `src/app/create/page.tsx` - Comic generation workspace
- `src/components/ComicStrip.tsx` - 3-panel display component
- `src/components/ui/ai-input-with-search.tsx` - Story input with file upload

**Backend:**
- `src/app/api/comic-generate/route.ts` - OpenAI integration and panel generation
- `src/lib/comic-continuity.ts` - Visual continuity system and prompt engineering

**Database:**
- `prisma/schema.prisma` - Comic, Page, and Panel models with art style support

### How Visual Continuity Works

1. **Character Tokens**: User descriptions are transformed into consistent character tokens
2. **Style Locking**: Selected art style is embedded in every panel prompt
3. **Shot Composition**: Each panel uses different camera angles:
   - Panel 1: Establishing shot (wide angle)
   - Panel 2: Action shot (medium, dynamic angle)
   - Panel 3: Reaction shot (close-up for impact)
4. **Sequential Generation**: Panels are generated one after another to maintain coherence

### API Structure

**POST /api/comic-generate**

Request:
```json
{
  "story": "A superhero discovers their powers",
  "artStyle": "classic",
  "characterDescription": "young woman with red cape",
  "hasReferenceImages": false
}
```

Response: Server-Sent Events (SSE) stream
```
data: {"progress": 0, "message": "Starting generation..."}
data: {"progress": 33, "message": "Panel 1 complete!", "imageUrl": "https://...", "panelNumber": 1}
data: {"progress": 66, "message": "Panel 2 complete!", "imageUrl": "https://...", "panelNumber": 2}
data: {"progress": 100, "message": "Comic strip complete!", "complete": true, "panels": [...]}
```

## Costs & Rate Limits

### OpenAI Costs (as of 2024)
- **DALL-E 3 Standard**: ~$0.040 per image
- **Cost per 3-panel strip**: ~$0.12

### Rate Limits
- OpenAI has rate limits based on your tier
- Generating 3 panels takes 30-90 seconds total
- Failed panels can be regenerated individually

## Troubleshooting

### "OpenAI API key not configured"
- Check that `OPENAI_API_KEY` is set in your `.env` file
- Restart the development server after adding the key

### "Generation failed"
- Verify your OpenAI API key is valid and has credits
- Check your OpenAI account for rate limit issues
- Try a different, simpler story prompt

### Panels don't match
- Add more specific character descriptions
- Use distinctive features (clothing, colors, props)
- Consider uploading reference images

### Slow generation
- Each panel takes 10-30 seconds with DALL-E 3
- This is normal and expected
- Total generation time: 30-90 seconds

## Roadmap

### Version 1.1
- [ ] Individual panel regeneration
- [ ] Export as high-res PNG
- [ ] Save to database functionality
- [ ] Reference image support

### Version 1.2
- [ ] Speech bubble editor
- [ ] Text overlay tools
- [ ] Multiple comic strips per project
- [ ] Gallery view of created comics

### Version 2.0
- [ ] Custom art style training
- [ ] Multi-page comics
- [ ] Collaborative editing
- [ ] Export to PDF and CBZ formats

## Contributing

When adding new features:

1. Follow the existing component structure
2. Add proper TypeScript types
3. Update this guide with new functionality
4. Test with multiple art styles and prompts

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the OpenAI API documentation
- Check Clerk documentation for auth issues

## License

MIT License - See LICENSE file for details

