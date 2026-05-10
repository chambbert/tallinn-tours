# Tallinn Tours

A full-stack booking platform for guided city tours in Tallinn, Estonia. Built with Next.js 16, Prisma 7, PostgreSQL, Tailwind CSS, and Resend.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL via Prisma 7 ORM
- **Styling**: Tailwind CSS v4
- **Auth**: JWT (jsonwebtoken) with HttpOnly cookies
- **Email**: Resend
- **Validation**: Zod v4

## Features

### Public
- Homepage with hero, featured tours, testimonials
- Tours calendar with category filtering
- Tour detail pages with booking
- Registration flow with server-side capacity enforcement
- Booking confirmation page
- Self-service booking cancellation
- About Us page

### Admin (`/admin`)
- Secure login (JWT, bcrypt)
- Dashboard with stats
- Create / edit / deactivate tours
- View and manage registrations
- Export registrations to CSV
- Delete customer data (GDPR)

---

## Database Setup

**We manage our own PostgreSQL database — no hosted database is provisioned automatically.**

### 1. Create the database

```sql
CREATE DATABASE tallinn_tours;
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/tallinn_tours"
```

For local development with default PostgreSQL settings:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tallinn_tours"
```

### 3. Run migrations

```bash
npm run db:migrate
```

This creates all tables: `Tour`, `Registration`, `Admin`.

### 4. Seed development data

```bash
npm run db:seed
```

Creates:
- 1 admin account: `admin@tallinn-tours.com` / `admin123`
- 6 sample tours (June–September 2026)
- Sample registrations

### 5. Generate Prisma client

If you pulled a fresh checkout without running migrations:

```bash
npm run db:generate
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random secret for JWT tokens (`openssl rand -hex 32`) |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) |
| `FROM_EMAIL` | Sender address (must be verified in Resend) |
| `ADMIN_NOTIFICATION_EMAIL` | Where to send new booking notifications |
| `APP_BASE_URL` | Full URL of the app (e.g. `https://tallinn-tours.com`) |

---

## Development

```bash
npm install
cp .env.example .env
# edit .env

npm run db:migrate   # apply schema to your database
npm run db:seed      # optional: load sample data
npm run dev          # start at http://localhost:3000
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:migrate` | Apply new migrations |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |

---

## Production

1. Set all environment variables on your hosting platform
2. Run `npm run db:migrate` against your production database
3. Run `npm run build && npm run start`

### Connecting your own PostgreSQL

Any standard PostgreSQL 14+ database works:

```env
# Supabase
DATABASE_URL="postgresql://postgres.xxxx:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Neon
DATABASE_URL="postgresql://user:password@ep-xxx.eu-west-1.aws.neon.tech/tallinn_tours?sslmode=require"

# Self-hosted
DATABASE_URL="postgresql://tallinn_tours_user:PASSWORD@db.example.com:5432/tallinn_tours"
```

---

## Admin Access

After seeding, log in at `/admin/login`:

- **Email**: `admin@tallinn-tours.com`
- **Password**: `admin123`

Change the admin password before going to production.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── about/page.tsx            # About Us
│   ├── tours/page.tsx            # Tours listing
│   ├── tours/[id]/page.tsx       # Tour detail
│   ├── book/[tourId]/            # Booking form
│   ├── confirmation/[code]/      # Booking confirmation
│   ├── cancel/[token]/           # Cancellation
│   ├── admin/                    # Admin dashboard
│   └── api/                      # API routes
├── components/                   # Shared React components
└── lib/
    ├── prisma.ts                 # Prisma client singleton
    ├── auth.ts                   # JWT auth helpers
    ├── email.ts                  # Resend email templates
    ├── validations.ts            # Zod schemas
    └── utils.ts                  # Formatting helpers
prisma/
├── schema.prisma                 # Database schema
├── seed.ts                       # Development seed data
└── migrations/                   # SQL migrations
```
