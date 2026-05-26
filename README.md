# thingsaboveweb
Landing Page and Devotional Plan Submission Form for Things Above Devotional Companion


# Getting Started
These instructions will get the project running on a local machine for development and testing purposes. 

## Prerequisites
 - Node.js installed on your system.
 - A package manager like npm, yarn, pnpm, or bun.
## Installation
 - Clone the repository:

```bash
git clone https://github.com
```
 - Navigate into the project directory:

```bash
cd your-project-name
```
 - Install the dependencies:

```bash
npm install
```

# or yarn install
# or pnpm install
# or bun install

## Running the Development Server
 - Run the development server:

```bash
npm run dev
```
# or yarn dev
# or pnpm dev
# or bun dev

Open http://localhost:3000 with your browser to see the result. 

## Deployment Channels

Set `NEXT_PUBLIC_SITE_CHANNEL` per hosting environment:

```bash
# Production
NEXT_PUBLIC_SITE_CHANNEL=production
NEXT_PUBLIC_IOS_APP_STORE_URL=https://...
NEXT_PUBLIC_ANDROID_PLAY_STORE_URL=https://...
```

```bash
# Beta
NEXT_PUBLIC_SITE_CHANNEL=beta
NEXT_PUBLIC_IOS_TESTFLIGHT_URL=https://...
NEXT_PUBLIC_ANDROID_BETA_URL=https://...
```

When the value is omitted, the site defaults to `production`.
