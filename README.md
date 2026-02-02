# Leven 🎯

> **Get better, together**

Leven is a gamified productivity platform that transforms habit building into a competitive and collaborative experience. Create or join communities (called "Basecamps"), track your progress across different modules, and compete with friends to build better habits together.

## ✨ Features

### 🏕️ Basecamps (Communities)
- **Create & Join Communities**: Build your own productivity basecamp or join existing ones
- **Customizable Modules**: Each community can enable different productivity modules (e.g., LeetCode, fitness, reading)
- **Flexible Privacy Settings**: Public communities or private invite-only basecamps
- **Custom Point Systems**: Admins can customize point schemes per module to match community goals

### 🏆 Gamification & Competition
- **Real-time Leaderboards**: Track your rank against friends and community members
- **Streak System**: Build momentum with consecutive day streaks
  - Customizable streak thresholds and multipliers per community
  - Track both current and longest streaks
- **Points & Progress**: Earn points for completing tasks across different modules
- **Rank Tracking**: Monitor your progress with previous vs. current rank indicators

### 📊 Progress Tracking
- **Module-based Progress**: Track points and time spent across different productivity modules
- **Task History**: Complete record of all completed tasks with metadata
- **Personal Analytics**: Visualize your productivity journey
- **Multi-Community Support**: Participate in multiple communities simultaneously

### 👥 Social Features
- **Invite System**: Share unique invite links for private communities
- **Member Roles**: Admin and member role management
- **Collaborative Growth**: Build habits alongside friends and accountability partners

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: 
  - Radix UI primitives
  - Framer Motion for animations
  - Recharts for data visualization
  - Lucide React for icons
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database
- npm/yarn/pnpm/bun

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd leven
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OAuth Providers (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Add other environment variables as needed
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
leven/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── communities/       # Community pages
│   ├── create-community/  # Community creation flow
│   ├── invite/            # Invite handling
│   └── user/              # User profile pages
├── components/            # React components
│   └── ui/               # UI components (shadcn/ui)
├── models/               # Mongoose models
│   ├── Community.model.ts
│   ├── Module.model.ts
│   ├── Task.model.ts
│   └── User.model.ts
├── services/             # Business logic services
│   ├── communityService.ts
│   ├── inviteService.ts
│   ├── streakService.ts
│   ├── taskService.ts
│   └── userService.ts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── util/                 # Helper utilities
```

## 🎮 Usage

### Creating a Basecamp
1. Navigate to "Browse Basecamps"
2. Click "Create New Community"
3. Configure your community settings:
   - Name and description
   - Privacy settings (public/private)
   - Enable productivity modules
   - Customize point schemes
   - Set streak multipliers

### Joining a Basecamp
- **Public Communities**: Browse and join directly
- **Private Communities**: Use an invite link shared by an admin

### Tracking Progress
1. Select a community from your dashboard
2. Log completed tasks in enabled modules
3. Earn points based on the community's point scheme
4. Build streaks by completing tasks consistently
5. Compete on the leaderboard

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run create-env   # Create .env from environment variables
```

## 🐳 Docker Support

The project includes Docker configuration for containerized deployment:

```bash
docker build -t leven .
docker run -p 3000:3000 leven
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Google Cloud Platform
The project includes `cloudbuild.yaml` for GCP deployment:

```bash
gcloud builds submit --config cloudbuild.yaml
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

Built with modern web technologies and best practices to create an engaging productivity experience.

---

**Get better, together with Leven** 🎯
