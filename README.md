# Home Loan Comparison App

A Next.js application for comparing home loan scenarios with bilingual support (English/Arabic).

## Features

- ✅ Calculate loan scenarios (Reducing Balance & Flat Rate)
- ✅ Save and compare up to 10 scenarios
- ✅ Amortization schedule visualization
- ✅ Bilingual support (English/Arabic with RTL)
- ✅ Mobile-responsive design
- ✅ SQLite database for persistent storage

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: better-sqlite3
- **UI Components**: Headless UI

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deploy to Railway

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Next.js and deploy
   - **Important**: Add a Volume in Railway settings:
     - Go to your service → Settings → Volumes
     - Click "New Volume"
     - Mount path: `/app/data`
     - This ensures your database persists across deployments

3. **Environment Variables** (Optional)
   - No environment variables are required for basic deployment
   - The app uses SQLite stored in `/app/data/app.db`

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   └── page.tsx         # Main page
├── components/          # React components
├── lib/                 # Utilities
│   ├── calculator.ts    # Loan calculation logic
│   └── db.ts           # Database configuration
├── locales/            # Translation files
│   ├── en.json
│   └── ar.json
└── data/               # SQLite database (gitignored)
```

## License

MIT
