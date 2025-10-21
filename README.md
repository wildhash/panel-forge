# Panel Forge - AI Comic Creator

Create professional comic strips in minutes using AI. Turn your story ideas into three-panel comic strips with multiple art styles.

## Features

- 🎨 **5 Art Styles**: Classic Comic Book, Manga, Graphic Novel, Retro Pulp, Minimalist
- 🤖 **AI-Powered Generation**: Uses OpenAI DALL-E 3 for high-quality image generation
- 📖 **Three-Panel Structure**: Classic storytelling format (Setup, Action, Payoff)
- ✨ **Visual Continuity**: Characters and settings stay consistent across panels
- 🔄 **Panel Iteration**: Refine individual panels with additional prompts
- 📚 **Strip History**: Create multiple strips while maintaining character continuity
- 🔒 **Authentication**: Secure user authentication with Clerk

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Clerk
- **Database**: Prisma + SQLite
- **AI**: OpenAI DALL-E 3
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Clerk account (optional, for authentication)

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

4. Add your API keys to `.env`:
```env
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key

# Clerk Authentication (optional)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wildhash/panel-forge)

### Manual Deployment

1. Push your code to GitHub

2. Import project to Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. Add Environment Variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file:
     - `DATABASE_URL`
     - `OPENAI_API_KEY`
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`
     - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
     - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`

4. Deploy:
   - Click "Deploy"
   - Vercel will build and deploy your app

5. Set up database (one-time):
```bash
# After first deployment, run migrations
npx prisma db push
```

## Usage

### Creating Your First Comic

1. **Select an Art Style**: Choose from 5 different comic art styles
2. **Enter Your Story**: Describe your comic in 10-500 characters
3. **Add Character Details** (optional): Describe your characters for consistency
4. **Upload Reference Images** (optional): Upload character reference photos
5. **Generate**: Click submit and watch your 3-panel comic generate automatically
6. **Iterate**: Hover over any panel to regenerate or refine it
7. **Continue**: Create additional strips while maintaining character continuity

### Art Styles

- **Classic Comic Book**: Bold lines, vibrant colors, superhero aesthetic
- **Manga Style**: Screentone shading, dynamic angles, Japanese style
- **Graphic Novel**: Realistic, muted tones, mature themes
- **Retro Pulp**: Vintage comic aesthetic, classic pulp fiction style
- **Minimalist Line Art**: Simple, clean lines, modern aesthetic

## Project Structure

```
panel-forge/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── create/        # Comic creation page
│   │   ├── stories/       # Stories dashboard
│   │   ├── novels/        # Novels dashboard
│   │   ├── test-api/      # API testing page
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   └── lib/              # Utilities and helpers
├── public/               # Static assets
├── prisma/              # Database schema
└── docs/                # Documentation
```

## Environment Variables

### Required
- `OPENAI_API_KEY`: Your OpenAI API key for DALL-E 3

### Optional (Authentication)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: Redirect after sign in
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: Redirect after sign up

### Database
- `DATABASE_URL`: Prisma database connection string

## API Routes

- `/api/comic-generate` - Generate 3-panel comic strip
- `/api/regenerate-panel` - Regenerate individual panel
- `/api/test-generation` - Test OpenAI API connection

## Troubleshooting

### Generation Fails
1. Check OpenAI API key is valid
2. Verify you have credits in your OpenAI account
3. Check browser console and terminal for errors
4. Visit `/test-api` to test your API connection

### Authentication Issues
1. Verify Clerk keys are correctly set in `.env`
2. Check Clerk dashboard for account status
3. Authentication can be disabled for testing (see middleware.ts)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation in `/docs`
- Visit the test page at `/test-api` for API debugging

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [OpenAI DALL-E 3](https://openai.com/dall-e-3)
- Authentication by [Clerk](https://clerk.com/)
