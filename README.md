# DiabetCare Connect

A comprehensive diabetes management application built with modern web technologies. DiabetCare Connect enables users to track glucose levels, insulin doses, and manage their diabetes health efficiently through an intuitive, responsive interface.

## 🎯 Key Features

- **Glucose Tracking**: Log and monitor blood glucose levels with detailed timestamps and meal-related context
- **Insulin Management**: Record insulin doses with type and dosage information
- **User Authentication**: Secure authentication via LINE LIFF integration and NextAuth
- **Health Data Visualization**: Interactive charts and graphs powered by Recharts
- **Real-time Notifications**: Toast notifications for user feedback using Sonner
- **Responsive Design**: Mobile-first design with Tailwind CSS for seamless experience across devices
- **Type-Safe Development**: Built with TypeScript for robust and maintainable code

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org) 16.2.10 (React 19)
- **Authentication**: [NextAuth](https://next-auth.js.org) 5.0.0-beta & LINE LIFF
- **Database ORM**: [Prisma](https://www.prisma.io) 5.22.0
- **Database**: PostgreSQL
- **Styling**: [Tailwind CSS](https://tailwindcss.com) 4
- **UI Components**: React Icons, Lucide React
- **Data Visualization**: [Recharts](https://recharts.org) 3.9.2
- **Notifications**: [Sonner](https://sonner.emilkowal.ski) 2.0.7
- **Security**: bcryptjs for password hashing
- **Language**: TypeScript 5
- **Linting**: ESLint 9

## 📋 Prerequisites

Before getting started, ensure you have the following installed:

- Node.js 18+ 
- npm, yarn, pnpm, or bun (choose one)
- PostgreSQL database
- LINE bot account with LIFF app (for authentication)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Lulixxy/diabetcare-app.git
cd diabetcare-app
```

### 2. Install Dependencies

Choose your preferred package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

The `postinstall` script will automatically run `prisma generate` after dependencies are installed.

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/diabetcare"
DIRECT_URL="postgresql://user:password@localhost:5432/diabetcare"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# LINE LIFF
NEXT_PUBLIC_LIFF_ID="your-liff-id-here"
LINE_CLIENT_ID="your-line-client-id"
LINE_CLIENT_SECRET="your-line-client-secret"
```

**Note**: Generate a secure `NEXTAUTH_SECRET` using:
```bash
openssl rand -base64 32
```

### 4. Set Up the Database

Initialize and migrate your PostgreSQL database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed the database if you have a seed script
npx prisma db seed
```

To view and manage your database using Prisma Studio:

```bash
npx prisma studio
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000). Open it in your browser to see the result.

The page auto-updates as you edit files. For example, modify `src/app/page.tsx` to see changes immediately.

### 6. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
diabetcare-app/
├── src/
│   ├── app/                 # Next.js App Router pages and layouts
│   ├── components/          # Reusable React components
│   ├── context/             # React Context for state management
│   ├── lib/                 # Utility functions and helpers
│   └── middleware.ts        # NextAuth middleware (if applicable)
├── prisma/
│   ├── schema.prisma        # Database schema definition
│   └── migrations/          # Database migration files
├── public/                  # Static assets (images, icons, etc.)
├── .env.local               # Environment variables (not committed)
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
├── eslint.config.mjs        # ESLint configuration
└── package.json             # Project dependencies and scripts
```

## 📊 Database Schema

The application uses the following main data models:

### User
- `id`: Unique identifier (CUID)
- `line_user_id`: LINE platform user ID (unique)
- `name`: User's display name
- `status`: Account status (default: "active")
- `createdAt`: Account creation timestamp
- Relationships: `glucoseLogs`, `insulinDoses`

### GlucoseLog
- `id`: Unique identifier (UUID)
- `userId`: Reference to User
- `value`: Blood glucose level (Float)
- `type`: Glucose type (e.g., fasting, random, postprandial)
- `mealType`: Associated meal type (optional)
- `note`: Additional notes (optional)
- `createdAt`: Log timestamp

### InsulinDose
- `id`: Unique identifier (UUID)
- `userId`: Reference to User
- `units`: Insulin dosage amount
- `type`: Insulin type
- `createdAt`: Dose timestamp

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint checks
```

## 🔐 Authentication

This project uses:

- **LINE LIFF**: For LINE messaging app integration and user authentication
- **NextAuth.js**: For session management and OAuth flows with Prisma adapter
- **bcryptjs**: For secure password hashing (if local auth is implemented)

Users authenticate via LINE, and their sessions are managed securely through NextAuth.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs) - Database ORM guide
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Utility-first CSS framework
- [NextAuth.js Guide](https://next-auth.js.org) - Authentication solution
- [LINE LIFF Documentation](https://developers.line.biz/en/docs/liff) - LINE front-end framework

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), the creators of Next.js.

For detailed deployment instructions, check the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

**Important**: Ensure all environment variables are configured in Vercel's environment settings before deployment.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the project's linting standards and includes appropriate tests.

## 📞 Contact & Support

For questions, issues, or feedback, please reach out:

- **GitHub Issues**: [Open an issue](https://github.com/Lulixxy/diabetcare-app/issues)
- **Author**: Lulixxy
- **Email**: [Your email here]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy coding!** 🎉 If you find this project helpful, please consider giving it a star ⭐
