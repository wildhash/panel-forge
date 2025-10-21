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
- Get Clerk keys from [https://clerk.com](https://clerk.com)
- Get UploadThing keys from [https://uploadthing.com](https://uploadthing.com)

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

# Run Prisma Studio (database GUI)
npx prisma studio
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT
