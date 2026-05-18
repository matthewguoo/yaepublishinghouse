# Deploying to Vercel

## 1. Set up Neon Database (free)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (looks like `postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require`)

## 2. Deploy to Vercel

1. Push repo to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL` - your Neon connection string
   - `JWT_SECRET` - generate with `openssl rand -base64 32`
   - `RESEND_API_KEY` - get from [resend.com](https://resend.com) (optional, emails log to console without it)
   - `NEXT_PUBLIC_SITE_URL` - your domain (e.g. `https://yaepublishing.house`)

4. Deploy!

## 3. Initialize Database

After first deploy, run in Vercel terminal or locally:
```bash
npx prisma db push
```

Or connect Neon integration in Vercel (automatically syncs).

## Local Development

```bash
# Copy env template
cp .env.example .env

# Fill in DATABASE_URL with your Neon connection string

# Install deps
npm install

# Push schema to database
npm run db:push

# Run dev server
npm run dev
```
