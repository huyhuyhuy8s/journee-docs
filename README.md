# LiveDocs - Collaborative Document Editor

## 🚀 Overview

LiveDocs is a modern, real-time collaborative document editor built with cutting-edge technologies. It enables multiple users to work together on documents simultaneously, featuring real-time collaboration, user management, and a sleek user interface.

## ✨ Features

### 🔥 Core Features
- **Real-time Collaborative Editing** - Multiple users can edit the same document simultaneously
- **Rich Text Editor** - Full-featured editor with formatting options powered by Lexical
- **Live Comments** - Add and reply to comments in real-time
- **User Authentication** - Secure authentication system with Clerk
- **Document Management** - Create, rename, delete, and organize documents
- **User Permissions** - Granular access control (viewer/editor permissions)
- **Active Collaborators** - See who's currently working on the document
- **Document Sharing** - Invite collaborators via email
- **Search & Filtering** - Advanced document search and filtering capabilities
- **Pagination** - Efficient document listing with pagination

### 🎨 User Experience
- **Modern UI/UX** - Clean, intuitive interface built with Tailwind CSS
- **Real-time Updates** - Instant synchronization across all connected clients
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Dark Theme** - Professional dark theme for comfortable editing
- **User Avatars** - Visual representation of collaborators
- **Notifications** - Real-time notifications for document activities

### 🛡️ Security & Performance
- **JWT Authentication** - Secure token-based authentication
- **CORS Protection** - Proper cross-origin resource sharing configuration
- **Input Validation** - Comprehensive input validation and sanitization
- **Error Handling** - Robust error handling throughout the application
- **Caching** - Intelligent caching for improved performance
- **Rate Limiting** - Protection against abuse and spam

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lexical** - Extensible text editor framework
- **Liveblocks** - Real-time collaboration infrastructure
- **Clerk** - Authentication and user management
- **Radix UI** - Headless UI components
- **Sentry** - Error monitoring and performance tracking

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server-side development
- **Clerk SDK** - Server-side authentication
- **Liveblocks Node** - Real-time collaboration backend
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Cloudinary** - Image and file management (optional)
- **MongoDB/Mongoose** - Database (configured but optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Clerk account (for authentication)
- Liveblocks account (for real-time features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd journee-docs-full
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd journee-docs-main
   npm install

   # Install backend dependencies
   cd ../journee-docs-backend-main
   npm install
   ```

3. **Environment Setup**

   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   NEXT_PUBLIC_LIVEBLOCKS_PUBLISHABLE_KEY=your_liveblocks_publishable_key
   LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key

   NEXT_PUBLIC_API_URL=http://localhost:5001

   # Sentry (optional)
   SENTRY_DSN=your_sentry_dsn
   ```

   **Backend (.env)**
   ```env
   NODE_ENV=development
   PORT=5001

   # Clerk Configuration
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

   # Liveblocks Configuration
   LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
   LIVEBLOCKS_WEBHOOK_SECRET=your_liveblocks_webhook_secret

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # Database (optional)
   MONGODB_URI=mongodb://localhost:27017/journee-docs

   # Cloudinary (optional)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret

   # JWT Secret
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the applications**
   ```bash
   # Start backend (Terminal 1)
   cd journee-docs-backend-main
   npm run dev

   # Start frontend (Terminal 2)
   cd journee-docs-main
   npm run dev
   ```

5. **Open the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 📱 Usage

1. **Sign Up/Sign In** - Create an account or sign in with existing credentials
2. **Create Document** - Click "Add Document" to create a new collaborative document
3. **Collaborate** - Share documents with others via email invitations
4. **Edit Together** - Start editing and see real-time changes from all collaborators
5. **Comment** - Add comments and discuss changes with team members
6. **Manage Documents** - Search, filter, rename, or delete documents as needed

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Liveblocks](https://liveblocks.io/) - Real-time collaboration infrastructure
- [Clerk](https://clerk.com/) - Authentication and user management
- [Lexical](https://lexical.dev/) - Extensible text editor framework
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using modern web technologies**
