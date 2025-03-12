# ShiftFlow - Personal Shift Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Ready-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)

ShiftFlow is a user-friendly application designed to help individuals in Israel track their work shifts, calculate income, and manage multiple employment sources efficiently.

## 🔗 Live Demo

**[Try ShiftFlow Live](https://shift-flow.vercel.app/)**

## 🚀 Features

- **User Authentication** - Secure login and registration system
- **Employer Management** - Add, edit, and manage multiple employers
- **Shift Tracking** - Record shifts with start/end times and breaks
- **Income Calculations** - Automatic income calculations based on rates
- **Dashboard Analytics** - Visual reports of hours worked and earnings
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **State Management**: React Context API
- **Styling**: Tailwind CSS, HeadlessUI
- **Deployment**: Vercel (frontend & backend), MongoDB Atlas (database)

## 📋 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas account)

### Environment Setup

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/shiftflow.git
   cd shiftflow
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   # MongoDB database connection
   MONGODB_URI=mongodb://localhost:27017/shiftflow
   # Replace with your MongoDB connection string

   # NextAuth.js configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-change-in-production
   # Generate a strong secret for production

   # Environment
   NODE_ENV=development
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Authentication Setup

For testing purposes, you can register a new account at `/auth/register`. The application uses NextAuth.js with credentials provider for authentication.

## 📁 Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable UI components
- `/context` - React context providers
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and libraries
- `/models` - Mongoose data models
- `/public` - Static assets
- `/styles` - Global CSS and Tailwind utilities
- `/types` - TypeScript type definitions

## 📊 Development Roadmap

See the [ROADMAP.md](docs/ROADMAP.md) file for the detailed development plan.

## 🚀 Deployment

The application is deployed on Vercel with MongoDB Atlas for database hosting. Follow these steps for deployment:

1. Create a MongoDB Atlas account and set up a cluster
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NEXTAUTH_URL`: Your deployed application URL
   - `NEXTAUTH_SECRET`: A secure secret for NextAuth.js
4. Deploy the application

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Vercel](https://vercel.com/)
