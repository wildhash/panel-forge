# Panel Forge

Turn your photos + prompts into editable, multi-panel comics in minutes.

## Features

- 🎨 **Comic Studio**: Interactive panel-based comic editor
- 📸 **Image Upload**: Upload your own images with UploadThing integration
- ✨ **AI Generation**: Generate and iterate on comic panels with AI prompts
- 💬 **Speech Balloons**: Add and edit text balloons on your panels
- 🔐 **Authentication**: Secure user authentication with Clerk
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

### Quick Start (Development Mode)

The app can run without any external services configured for local development:

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
# The app will work with defaults for local development
```

4. Set up the database:
```bash
npm run db:migrate
```

5. (Optional) Seed demo data:
```bash
npm run db:seed
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Setup

For production use with authentication and file uploads:

1. **Configure Clerk (Authentication)**
   - Sign up at [https://clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable and secret keys to `.env`

2. **Configure UploadThing (File Uploads)**
   - Sign up at [https://uploadthing.com](https://uploadthing.com)
   - Create a new app
   - Copy your secret and app ID to `.env`

3. **Configure AI Generation (Optional)**
   - For OpenAI DALL-E: Get API key from [https://platform.openai.com](https://platform.openai.com)
   - For Replicate: Get API key from [https://replicate.com](https://replicate.com)
   - Add keys to `.env` to enable real AI generation

Without AI keys, the app runs in **fallback mode** with placeholder images.

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

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Database commands
npm run db:migrate      # Run migrations
npm run db:generate     # Generate Prisma client
npm run db:studio       # Open Prisma Studio (database GUI)
npm run db:seed         # Seed demo data
```

## Features Walkthrough

### 1. Upload Images
- Click "Upload Images" to add photos to your library
- Uploaded images are saved to your account
- Images persist across sessions

### 2. Create Panels
- Drag images from your upload library onto the panel grid
- Each panel can have different images
- Click a panel to select it for editing

### 3. Add Speech Balloons
- Select a panel to open the balloon editor
- Click "Add Balloon" to create speech bubbles
- Edit text and position for each balloon
- Balloons are saved with the panel

### 4. Generate AI Art
- Enter a prompt in the Prompt Generator
- Click "Generate" to create AI images (requires API keys)
- In fallback mode, placeholder images are created

### 5. Save Your Work
- Click "Save Page" to persist your comic to the database
- All panels and balloons are saved automatically
- Revisions are tracked for undo functionality

## Security Features

- **Rate Limiting**: API endpoints are rate-limited (10 requests/minute per user)
- **File Validation**: Only allowed image types (JPEG, PNG, WebP, GIF) up to 4MB
- **Authentication**: Protected routes require sign-in (when Clerk is configured)
- **User Isolation**: All queries filter by userId to ensure data privacy

## Fallback Mode

Without external API keys, Panel Forge runs in **fallback mode**:
- ✅ Full UI functionality
- ✅ Image uploads work (stored locally)
- ✅ Panel editing and balloons work
- ✅ Page saving and database features work
- ⚠️ AI generation returns placeholder images with your prompt text

This allows development and testing without external dependencies.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT
