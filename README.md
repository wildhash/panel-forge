# Panel Forge

**Create a comic in an afternoon.** PanelForge turns your one-line idea into a finished, print-ready comic strip—plot, pages, art, and lettering included.

## Features

- 🎨 **5 Art Styles**: Classic Comic Book, Manga, Graphic Novel, Retro Pulp, Minimalist Line Art
- ✨ **AI-Powered Generation**: Create 3-panel comic strips with OpenAI DALL-E 3
- 🎬 **Visual Continuity**: Characters and settings stay consistent across all panels
- 📖 **Story Structure**: Automatic setup → action → payoff panel composition
- 💬 **Speech Balloons**: Add and edit text balloons on your panels (coming soon)
- 🔐 **Authentication**: Secure user authentication with Clerk (optional)
- 💾 **Database**: SQLite database with Prisma ORM
- 🎯 **Type Safety**: Full TypeScript support with Zod validation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Clerk
- **Database**: Prisma with SQLite
- **Styling**: Tailwind CSS + shadcn/ui
- **File Upload**: UploadThing
- **Validation**: Zod
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (required for comic generation)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/wildhash/panel-forge.git
cd panel-forge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Then edit `.env` and add your actual keys:
- **Required**: Get OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Optional: Get Clerk keys from [https://clerk.com](https://clerk.com) (for authentication)
- Optional: Get UploadThing keys from [https://uploadthing.com](https://uploadthing.com) (for image uploads)

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quick Start - Create Your First Comic

1. Choose an art style from the 5 options on the home page
2. Describe your comic story (e.g., "A cat discovers a portal in their litter box")
3. Click "Generate Comic Strip" and wait 30-90 seconds
4. Save your completed 3-panel strip to the studio

📖 **For detailed usage instructions, see [COMIC_CREATOR_GUIDE.md](./COMIC_CREATOR_GUIDE.md)**

## Project Structure

```
panel-forge/
├── src/
│   ├── app/
│   │   ├── actions/          # Server actions
│   │   ├── api/              # API routes
│   │   │   ├── generate/     # AI generation endpoint
│   │   │   ├── iterate/      # Panel iteration endpoint
│   │   │   ├── plan/         # Comic planning endpoint
│   │   │   └── uploadthing/  # File upload endpoint
│   │   ├── studio/           # Protected studio page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── BalloonEditor.tsx
│   │   ├── ComicViewer.tsx
│   │   ├── PageToolbar.tsx
│   │   ├── PanelGrid.tsx
│   │   ├── PromptBar.tsx
│   │   └── UploadDropzone.tsx
│   └── lib/                  # Utility functions
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

## Database Models

- **Comic**: User's comic projects
- **Page**: Pages within a comic
- **Panel**: Individual panels with images and prompts
- **Asset**: Uploaded files and images
- **Revision**: Version history for pages

## API Routes

- `POST /api/plan` - Generate a comic layout plan
- `POST /api/generate` - Generate panel images (streaming)
- `POST /api/iterate` - Iterate on existing panels (streaming)
- `POST /api/uploadthing` - Handle file uploads

## How It Works

Panel Forge uses AI to generate consistent comic strips:

1. **Art Style Selection**: Choose from 5 professionally-tuned art styles
2. **Story Input**: Describe your comic story in natural language
3. **3-Panel Generation**: 
   - Panel 1: Establishing shot (setup)
   - Panel 2: Action shot (conflict)
   - Panel 3: Reaction shot (payoff)
4. **Visual Continuity**: Character descriptions and style codes ensure consistency
5. **Real-time Progress**: Watch panels generate with live status updates

### Technology Stack

- **AI**: OpenAI DALL-E 3 for image generation
- **Frontend**: Next.js 15 with App Router, React 19, Tailwind CSS
- **Components**: shadcn/ui, Framer Motion for animations
- **Backend**: Next.js API routes with streaming responses
- **Database**: Prisma with SQLite
- **Auth**: Clerk (optional)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run Prisma Studio (database GUI)
npx prisma studio

# Reset database
npx prisma migrate reset
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT
