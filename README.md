# CareerLyze - AI-Powered Resume Analysis & Career Optimization Platform

![CareerLyze Logo](public/logo.png)

A revolutionary AI-powered platform that transforms how job seekers approach resume optimization. Using cutting-edge Google Gemini AI technology and advanced Natural Language Processing, we provide comprehensive resume analysis that helps you land your dream job.

## 🌟 Key Features

### 🤖 AI-Powered Analysis

- **Google Gemini AI Integration** - State-of-the-art language model for comprehensive text analysis
- **Smart Resume Analysis** - Advanced NLP algorithms analyze resume structure, content quality, and keyword optimization
- **ATS Score Calculation** - Get precise ATS compatibility scores and detailed feedback on how to optimize your resume
- **Intelligent Recommendations** - Receive personalized suggestions for skills, structure improvements, and missing keywords tailored to your industry
- **Job Matching Analysis** - Compare your resume with specific job descriptions to get match percentages and targeted improvement suggestions

### 📊 Comprehensive Reports

- **Detailed Analysis Reports** - Get insights into every aspect of your resume with our advanced AI analysis
- **Contact Information Extraction** - Automatically extract and display contact details from your resume
- **Keyword Optimization** - Intelligent keyword extraction and matching algorithms
- **Industry-Specific Insights** - Tailored recommendations for your field
- **PDF Viewer Integration** - View your original resume alongside analysis results

### 🔐 Security & Privacy

- **Secure & Private** - Your resume data is encrypted and secure. We never share your personal information with third parties
- **JWT Authentication** - Secure authentication with password reset via OTP
- **Data Protection** - All data is encrypted and stored securely

### 🚀 User Experience

- **Instant Results** - Get comprehensive analysis results in seconds, not hours
- **User-Friendly Interface** - Intuitive design makes it easy for anyone to upload, analyze, and improve their resume
- **Dashboard Management** - Comprehensive dashboard to manage all your resume analyses
- **Mobile Responsive** - Optimized for all screen sizes and devices

## 🚀 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend & AI

- **Google Gemini AI** - Advanced language model for resume analysis
- **MongoDB Atlas** - Cloud database for data persistence
- **JWT Authentication** - Secure token-based authentication
- **bcryptjs** - Password hashing and security
- **Multer** - File upload handling

### Additional Services

- **Nodemailer** - Email service with Gmail SMTP
- **Axios** - HTTP client for API requests
- **react-markdown** - Markdown rendering for analysis reports
- **remark-gfm** - GitHub Flavored Markdown support

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Gmail account with App Password
- Google AI API key (for Gemini AI)

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

   # Google AI (Gemini)
   GEMINI_API_KEY=your-google-ai-api-key

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

## 🚀 Getting Started

### For Users

1. **Sign Up** - Create your free account
2. **Upload Resume** - Upload your resume in PDF format
3. **Add Job Details** - Enter the job title and description you're applying for
4. **Get Analysis** - Receive instant AI-powered analysis
5. **View Results** - Check your ATS score, recommendations, and detailed insights
6. **Improve Resume** - Use the recommendations to optimize your resume

### For Developers

1. **Clone Repository** - Get the source code
2. **Install Dependencies** - Run `npm install`
3. **Set Environment Variables** - Configure your API keys
4. **Run Development Server** - Start with `npm run dev`
5. **Start Building** - Add new features and improvements

## 📁 Project Structure

```
careerlyze/
├── src/
│   ├── app/                           # Next.js App Router pages
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   │   ├── login/            # Login API
│   │   │   │   ├── register/         # Registration API
│   │   │   │   ├── forgot-password/  # Password reset API
│   │   │   │   ├── verify-otp/       # OTP verification API
│   │   │   │   ├── reset-password/   # Password reset API
│   │   │   │   ├── profile/          # Profile management API
│   │   │   │   └── change-password/  # Password change API
│   │   │   └── resume-analyze/       # Resume analysis endpoints
│   │   │       ├── route.ts          # Main analysis API
│   │   │       ├── [id]/             # Individual analysis API
│   │   │       └── pdf/[filename]/   # PDF serving API
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Registration page
│   │   ├── dashboard/                # Protected dashboard
│   │   ├── resume-analyze/           # Resume upload page
│   │   ├── resume-analysis/[id]/     # Detailed analysis page
│   │   ├── how-it-works/             # How it works page
│   │   ├── forgot-password/          # Password reset flow
│   │   ├── reset-password/           # Password reset form
│   │   ├── about/                    # About page
│   │   ├── features/                 # Features page
│   │   ├── contact/                  # Contact page
│   │   ├── privacy/                  # Privacy policy
│   │   └── terms/                    # Terms of service
│   ├── components/                   # Reusable React components
│   │   ├── Header.tsx               # Navigation header
│   │   ├── Footer.tsx               # Site footer
│   │   ├── Hero.tsx                 # Landing page hero
│   │   ├── About.tsx                # About section
│   │   ├── Features.tsx             # Features section
│   │   ├── HowItWorks.tsx           # How it works section
│   │   ├── CTA.tsx                  # Call-to-action section
│   │   ├── AuthProvider.tsx         # Authentication context
│   │   └── ProtectedRoute.tsx       # Route protection
│   ├── hooks/                       # Custom React hooks
│   │   └── useAuth.ts               # Authentication hook
│   ├── lib/                         # Utility libraries
│   │   ├── api.ts                  # Axios API client
│   │   ├── auth.ts                 # Authentication utilities
│   │   ├── email.ts                # Email templates
│   │   ├── jwt.ts                  # JWT utilities
│   │   └── mongodb.ts              # Database connection
│   ├── models/                     # Database models
│   │   ├── User.ts                 # User schema
│   │   └── Resume.ts               # Resume analysis schema
│   ├── styles/                     # Custom CSS files
│   │   └── markdown.css            # Markdown styling
│   └── types/                      # TypeScript type definitions
└── public/                         # Static assets
    └── logo.png                    # Application logo
```

## 🔐 API Endpoints

### Authentication API

| Method | Endpoint                    | Description                 | Auth Required |
| ------ | --------------------------- | --------------------------- | ------------- |
| POST   | `/api/auth/register`        | Register new user           | No            |
| POST   | `/api/auth/login`           | Login user                  | No            |
| POST   | `/api/auth/forgot-password` | Send OTP for password reset | No            |
| POST   | `/api/auth/verify-otp`      | Verify OTP                  | No            |
| POST   | `/api/auth/reset-password`  | Reset password with OTP     | No            |
| GET    | `/api/auth/profile`         | Get user profile            | Yes           |
| PUT    | `/api/auth/profile`         | Update user profile         | Yes           |
| PUT    | `/api/auth/change-password` | Change user password        | Yes           |

### Resume Analysis API

| Method | Endpoint                             | Description               | Auth Required |
| ------ | ------------------------------------ | ------------------------- | ------------- |
| POST   | `/api/resume-analyze`                | Upload and analyze resume | Yes           |
| GET    | `/api/resume-analyze/[id]`           | Get specific analysis     | Yes           |
| DELETE | `/api/resume-analyze/[id]`           | Delete analysis           | Yes           |
| GET    | `/api/resume-analyze/pdf/[filename]` | Serve PDF file securely   | Yes           |

### Usage Examples

#### Authentication

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

// Change password
const changePasswordResponse = await authAPI.changePassword(
  "currentPassword",
  "newPassword"
);
```

#### Resume Analysis

```typescript
// Upload and analyze resume
const formData = new FormData();
formData.append("file", resumeFile);
formData.append("jobTitle", "Software Engineer");
formData.append("jobDescription", "Looking for a skilled developer...");

const analysisResponse = await fetch("/api/resume-analyze", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const analysis = await analysisResponse.json();
```

## 🎨 UI Components & Features

### Design System

- **Responsive Design** - Mobile-first approach with Tailwind CSS 4
- **Modern Icons** - Lucide React icons throughout the application
- **Professional Styling** - Clean, modern design with smooth animations
- **Gradient Effects** - Beautiful gradients and visual effects
- **Accessibility** - WCAG compliant components

### Key Pages

- **Landing Page** - Modern hero section with animated elements
- **Dashboard** - Comprehensive resume management interface
- **Resume Analysis** - Upload and analyze resumes with real-time feedback
- **Detailed Analysis** - In-depth analysis results with PDF viewer
- **How It Works** - Step-by-step process explanation
- **About & Features** - Detailed information about the platform

### Interactive Features

- **PDF Viewer** - Secure PDF viewing with iframe integration
- **Markdown Rendering** - Rich text display for analysis results
- **Real-time Updates** - Live feedback during analysis
- **Search & Filter** - Advanced filtering and sorting capabilities
- **Profile Management** - User profile updates with modal interface

## 📧 Email Templates

The application includes professional HTML email templates:

- **Welcome Email** - Sent after successful registration
- **OTP Email** - Password reset with 6-digit OTP code
- **Professional Design** - Branded templates with Careerlyze styling

## 🔒 Security Features

### Authentication & Authorization

- **Password Hashing** - bcryptjs with 12 salt rounds
- **JWT Tokens** - Secure authentication with 7-day expiry
- **OTP Security** - 10-minute expiration for password reset codes
- **Token Verification** - Secure token validation on all protected routes
- **Session Management** - Proper session handling and cleanup

### Data Protection

- **File Upload Security** - Secure file handling with type and size validation
- **PDF Serving** - Authenticated PDF serving with token verification
- **Data Encryption** - All sensitive data encrypted in transit and at rest
- **Input Validation** - Client and server-side validation
- **Rate Limiting** - Protection against brute force attacks

### Privacy & Compliance

- **Data Privacy** - User data is never shared with third parties
- **Secure Storage** - Files stored securely with proper access controls
- **GDPR Ready** - Privacy-focused design and data handling

## 🤖 AI Analysis Features

### Google Gemini AI Integration

- **Advanced NLP** - State-of-the-art natural language processing
- **Structured Output** - Consistent, reliable analysis results
- **Context Understanding** - Deep understanding of resume content and job requirements
- **Industry Expertise** - Tailored analysis for different industries and roles

### Analysis Capabilities

- **ATS Compatibility** - Comprehensive ATS score calculation and optimization tips
- **Keyword Analysis** - Intelligent keyword extraction and matching
- **Content Quality** - Assessment of resume structure, formatting, and content
- **Job Matching** - Compare resume against specific job descriptions
- **Contact Extraction** - Automatically extract contact information from resumes
- **Recommendations** - Personalized improvement suggestions

### Report Features

- **Detailed Analysis** - Comprehensive breakdown of resume strengths and weaknesses
- **Visual Scores** - Easy-to-understand scoring system
- **Actionable Insights** - Specific recommendations for improvement
- **Markdown Formatting** - Rich text formatting for better readability
- **PDF Integration** - View original resume alongside analysis results

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

- **Next.js team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Google AI** for the powerful Gemini language model
- **Lucide** for the beautiful icon set
- **MongoDB** for the database solution
- **React Markdown** for rich text rendering
- **All open-source contributors** who make this project possible

## 📞 Support

If you have any questions or need support, please contact:

- **Email**: [careerlyze@ideepakrajput.in](mailto:careerlyze@ideepakrajput.in)
- **Phone**: [+91 7254880990](tel:+917254880990)
- **GitHub Issues**: [Create an issue](https://github.com/ideepakrajput/careerlyze/issues)

---

**Made with ❤️ by [ideepakrajput.in](https://ideepakrajput.in)**
