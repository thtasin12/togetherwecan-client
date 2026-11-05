# TogetherWeCan — Community Volunteering

TogetherWeCan is a community volunteering platform for discovering local causes, joining events, and bringing people together to make a difference. This repository contains the **Next.js web client**; application data and authentication are provided by a separate backend API.

## Features

- Discover and filter volunteering events by cause, location, date, and availability.
- View event details, attendee information, capacity, and countdowns.
- Join events or waitlists, save events, and take part in event discussions.
- Create and manage events, with dashboards for hosted, joined, and saved activities.
- Register and sign in with email/password or Google OAuth.
- Update your profile and track community activity and achievements.
- Responsive layouts, light and dark themes, and accessible mobile navigation.

## Tech stack

- [Next.js 16](https://nextjs.org/) App Router with Cache Components
- [React 19](https://react.dev/) and TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide](https://lucide.dev/) icons and [Sonner](https://sonner.emilkowal.ski/) notifications
- [Google OAuth](https://developers.google.com/identity) client integration

## Routes

| Route | Description |
| --- | --- |
| `/` | Home page, community stats, causes, and upcoming events |
| `/events` | Search and filter events |
| `/events/[id]` | Event details, attendance, waitlist, saves, and comments |
| `/about` | About TogetherWeCan |
| `/contact` | Contact form and support information |
| `/login`, `/register` | Account access |
| `/dashboard` | Personal activity overview |
| `/create-event` | Create an event |
| `/manage-events` | Manage hosted events |
| `/joined-events` | Events you joined |
| `/saved-events` | Your saved events |
| `/profile` | Profile settings |

## Requirements

- Node.js **20.9 or newer**
- npm
- A running TogetherWeCan backend API (defaults to `http://localhost:4000`)

The client sends API requests with cookie credentials. Configure the backend to allow the client origin and credentialed requests. Google sign-in also requires a Google OAuth client ID configured on the backend and in this client.

## Getting started

1. Clone the repository and enter the project directory:

   ```bash
   git clone <repository-url>
   cd togetherwecan-client
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create a `.env.local` file in the project root:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```

   `NEXT_PUBLIC_API_URL` is optional when the API is available at the default address. Set the Google client ID to enable Google sign-in. Values prefixed with `NEXT_PUBLIC_` are included in the browser bundle; never put private credentials or secrets in them.

4. Start the backend API, then run the client:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Create a production build
npm run start  # Serve the production build
```

Run `npm run build` before `npm run start`.

## Project structure

```text
app/          App Router pages and global styles
components/   Shared application components and UI primitives
lib/          API client, authentication context, types, and helpers
public/       Static images and other public assets
```

## Theme

The theme toggle switches the site between light and dark mode. The selected theme is stored in the browser and restored on the next visit; when no preference is saved, the site follows the system color preference.
