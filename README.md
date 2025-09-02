# DadConnect - A Community App for Dads

DadConnect is a social platform designed specifically for fathers to connect, support each other, and plan activities together. From football watch parties to playground meetups, find your dad community.

## 🏗️ Architecture

- **Web App**: Next.js 14 with Supabase backend
- **Mobile App**: React Native with Expo, sharing business logic with web
- **Database**: PostgreSQL via Supabase with Row Level Security (RLS)
- **Monorepo**: npm workspaces for shared code and types

## 🚀 Quick Start

### 1. Environment Setup

#### Web App
```bash
cd apps/web
cp env.example .env.local
# Edit .env.local with your Supabase credentials
```

#### Mobile App
```bash
cd apps/mobile
cp env.example .env
# Edit .env with your Supabase credentials
```

### 2. Get Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your `dadConnect` project
3. Go to Settings → API
4. Copy the keys to your `.env` files

### 3. Database Setup

1. In Supabase Dashboard, go to SQL Editor
2. Run `apps/web/db/schema.sql` to create tables
3. Run `apps/web/db/seed.sql` to add sample data

### 4. Install Dependencies

```bash
# From repo root
npm install

# Install mobile deps
cd apps/mobile
npm install
```

### 5. Run the Apps

#### Web App
```bash
# From repo root
npm run dev:web
# Or from apps/web
npm run dev
```

#### Mobile App
```bash
# From repo root
npm run dev:mobile
# Or from apps/mobile
npm start
```

## 📱 Features

### Core Features
- **Dad Groups**: Join support groups, sports groups, and interest-based communities
- **Real-time Chat**: Chat with fellow dads in group conversations
- **Meetups & Activities**: Plan and join watch parties, outdoor adventures, coffee meetups, and playdates
- **Activity Coordination**: Special features for coordinating activities like football watch parties
- **Profile Management**: Manage your interests, kids' ages, and location

### Technical Features
- **Authentication**: Supabase Auth with Apple/Google OAuth
- **Real-time**: Live chat and meetup updates
- **Mobile-First**: Native mobile app with web companion
- **Location-Based**: Find local groups and meetups
- **Activity Types**: Specialized support for different dad activities

## 🗄️ Database Schema

The app uses PostgreSQL with the following main tables:
- `profiles` - User profiles with interests, kids' ages, and location
- `dad_groups` - Community groups for support, sports, activities, and interests
- `group_members` - Group membership and roles
- `group_messages` - Real-time chat messages within groups
- `meetups` - Dad meetups and activities (watch parties, outdoor, sports, etc.)
- `meetup_attendees` - Meetup attendance and RSVP status

## 🔧 Development

### Project Structure
```
dadConnect/
├── apps/
│   ├── web/                 # Next.js web app
│   └── mobile/              # Expo React Native app
└── packages/
    └── shared/              # Common types and utilities
```

### Key Commands
```bash
# Install all dependencies
npm install

# Run web app
npm run dev:web

# Run mobile app
npm run dev:mobile

# Build all packages
npm run build

# Type check
npm run typecheck
```

### Adding New Features
1. Update types in `packages/shared/src/types.ts`
2. Add API routes in `apps/web/app/api/`
3. Update mobile screens in `apps/mobile/app/`
4. Test on both platforms

## 🌐 API Endpoints

### Groups
- `GET /api/groups` - List all dad groups
- `POST /api/groups` - Create a new group
- `POST /api/groups/[id]/join` - Join a group
- `DELETE /api/groups/[id]/join` - Leave a group
- `GET /api/groups/[id]/messages` - Get group chat messages
- `POST /api/groups/[id]/messages` - Send a message to group

### Meetups
- `GET /api/meetups` - List all meetups
- `POST /api/meetups` - Create a new meetup
- `POST /api/meetups/[id]/attend` - RSVP to a meetup
- `DELETE /api/meetups/[id]/attend` - Remove RSVP

## 📱 Mobile Development

### Expo Features
- **Expo Router**: File-based navigation
- **Bottom Tabs**: Groups, Meetups, Chat, Profile
- **Deep Links**: `dadconnect://` scheme
- **Push Notifications**: Expo notifications service

### Testing
- **iOS Simulator**: Press `i` after starting Expo
- **Android Emulator**: Press `a` after starting Expo
- **Physical Device**: Scan QR code with Expo Go

## 🔒 Security

- **Row Level Security (RLS)**: Database-level access control
- **Authentication**: Supabase Auth with secure session management
- **API Validation**: Zod schemas for all inputs
- **Rate Limiting**: Built-in protection against abuse

## 🚀 Deployment

### Web App
- Deploy to Vercel, Netlify, or any Next.js host
- Set environment variables in your hosting platform
- Configure Supabase redirect URLs

### Mobile App
- Build with EAS Build for app store deployment
- Configure deep linking in app store listings
- Set up push notification certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both web and mobile
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the [setup guide](setup.md)
- Review Supabase documentation
- Open an issue in this repository

---

Built with ❤️ for the dad community
