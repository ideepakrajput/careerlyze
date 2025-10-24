# Careerlyze - AI-Powered Resume Evaluation & Job Fit System

![Careerlyze Logo](public/logo.png)

A cutting-edge AI-powered platform that revolutionizes resume evaluation and job matching using advanced Natural Language Processing (NLP) technology.

## 🌟 Features

- **Smart Resume Analysis** - Advanced NLP algorithms analyze resume structure, content quality, and keyword optimization
- **ATS Score Calculation** - Get precise ATS compatibility scores and detailed feedback
- **Intelligent Recommendations** - Receive personalized suggestions for skills, structure improvements, and missing keywords
- **Job Matching** - Compare resume content with job descriptions to estimate match percentages
- **Professional Email Templates** - Beautiful HTML email templates for user communication
- **Secure Authentication** - JWT-based authentication with password reset via OTP

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB Atlas
- **Authentication**: JWT with bcryptjs
- **Email**: Nodemailer with Gmail SMTP
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Gmail account with App Password

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ideepakrajput/careerlyze.git
   cd careerlyze
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=careerlyze

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Email Configuration
   GMAIL_USER=careerlyze@ideepakrajput.in
   GMAIL_APP_PASSWORD=your-gmail-app-password

   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
careerlyze/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/auth/          # Authentication API routes
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # Protected dashboard
│   │   ├── forgot-password/   # Password reset flow
│   │   └── reset-password/    # Password reset form
│   ├── components/            # Reusable React components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Site footer
│   │   ├── AuthProvider.tsx   # Authentication context
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── hooks/                 # Custom React hooks
│   │   └── useAuth.ts         # Authentication hook
│   ├── lib/                   # Utility libraries
│   │   ├── api.ts            # Axios API client
│   │   ├── auth.ts           # Authentication utilities
│   │   ├── email.ts          # Email templates
│   │   ├── jwt.ts            # JWT utilities
│   │   └── mongodb.ts         # Database connection
│   ├── models/               # Database models
│   │   └── User.ts           # User schema
│   └── types/                # TypeScript type definitions
└── public/                   # Static assets
```

## 🔐 Authentication API

### Endpoints

| Method | Endpoint                    | Description                 | Auth Required |
| ------ | --------------------------- | --------------------------- | ------------- |
| POST   | `/api/auth/register`        | Register new user           | No            |
| POST   | `/api/auth/login`           | Login user                  | No            |
| POST   | `/api/auth/forgot-password` | Send OTP for password reset | No            |
| POST   | `/api/auth/verify-otp`      | Verify OTP                  | No            |
| POST   | `/api/auth/reset-password`  | Reset password with OTP     | No            |
| GET    | `/api/auth/profile`         | Get user profile            | Yes           |
| PUT    | `/api/auth/profile`         | Update user profile         | Yes           |

### Usage Example

```typescript
import { authAPI } from "@/lib/api";

// Register a new user
const response = await authAPI.register({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "password123",
});

// Login user
const loginResponse = await authAPI.login({
  email: "john@example.com",
  password: "password123",
});
```

## 🎨 UI Components

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern Icons** - Lucide React icons throughout the application
- **Professional Styling** - Clean, modern design with smooth animations
- **Accessibility** - WCAG compliant components
- **Dark Mode Ready** - Prepared for dark mode implementation

## 📧 Email Templates

The application includes professional HTML email templates:

- **Welcome Email** - Sent after successful registration
- **OTP Email** - Password reset with 6-digit OTP code
- **Professional Design** - Branded templates with Careerlyze styling

## 🔒 Security Features

- **Password Hashing** - bcryptjs with 12 salt rounds
- **JWT Tokens** - Secure authentication with 7-day expiry
- **OTP Security** - 10-minute expiration for password reset codes
- **Input Validation** - Client and server-side validation
- **Rate Limiting** - Protection against brute force attacks

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Deepak Rajput**

- Website: [ideepakrajput.in](https://ideepakrajput.in)
- GitHub: [@ideepakrajput](https://github.com/ideepakrajput)
- Email: [careerlyze@ideepakrajput.in](mailto:careerlyze@ideepakrajput.in)
- Phone: [+91 7254880990](tel:+917254880990)
- Location: Naraina, Delhi - 110020

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icon set
- MongoDB for the database solution
- All open-source contributors

## 📞 Support

If you have any questions or need support, please contact:

- **Email**: [careerlyze@ideepakrajput.in](mailto:careerlyze@ideepakrajput.in)
- **Phone**: [+91 7254880990](tel:+917254880990)
- **GitHub Issues**: [Create an issue](https://github.com/ideepakrajput/careerlyze/issues)

---

**Made with ❤️ by [ideepakrajput.in](https://ideepakrajput.in)**
