# CareerLyze - AI-Powered Resume Analysis & Career Optimization Platform

## MCA Major Project Report - Part 4

**Student Details:**

- **Name:** Deepak Kumar
- **University ID:** 024MCA160487
- **Course:** MCA - Al & ML
- **University:** Chandigarh University

---

### **5. System Design**

#### **5.1 Architectural Design**

**5.1.1 High-Level System Architecture**

The CareerLyze system follows a modern three-tier architecture with cloud-based deployment:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Web UI    │  │  Mobile UI  │  │   Admin UI  │         │
│  │  (Next.js)  │  │  (React)    │  │  (Next.js)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION TIER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Auth API  │  │ Resume API  │  │  Report API │         │
│  │  (Next.js)  │  │  (Next.js)  │  │  (Next.js)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   File API  │  │   AI API    │  │  Email API  │         │
│  │  (Next.js)  │  │  (Gemini)   │  │  (Next.js)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA TIER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   MongoDB   │  │ File Storage │  │   Cache     │         │
│  │  (Atlas)    │  │  (Vercel)    │  │  (Vercel)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

**Add Photo:** High-level system architecture diagram

**5.1.2 Component Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Browser   │  │   Mobile    │  │   Admin     │         │
│  │             │  │   App       │  │   Panel     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Next.js API Routes                        │ │
│  │  • Authentication Middleware                          │ │
│  │  • Rate Limiting                                       │ │
│  │  • CORS Handling                                      │ │
│  │  • Request Validation                                 │ │
│  │  • File Upload Handling                               │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Auth      │  │   Resume    │  │   Report    │         │
│  │  Service    │  │  Service    │  │  Service    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   File      │  │     AI      │  │   Email     │         │
│  │  Service    │  │  Service    │  │  Service    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   User      │  │   Resume    │  │   Report    │         │
│  │ Repository  │  │ Repository │  │ Repository  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA STORAGE                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   MongoDB   │  │ File System │  │   Cache     │         │
│  │   Atlas     │  │  (Vercel)   │  │  (Vercel)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

**Add Photo:** Component architecture diagram

#### **5.2 ER Diagram / Database Design**

**5.2.1 Entity Relationship Diagram**

```
                    ┌─────────────────┐
                    │      USER       │
                    │─────────────────│
                    │ _id (PK)        │
                    │ email           │
                    │ password        │
                    │ firstName       │
                    │ lastName        │
                    │ isEmailVerified │
                    │ createdAt       │
                    │ updatedAt       │
                    └─────────────────┘
                           │
                           │ 1:N
                           │
                    ┌─────────────────┐
                    │     RESUME      │
                    │─────────────────│
                    │ _id (PK)        │
                    │ userId (FK)     │
                    │ filename        │
                    │ originalName    │
                    │ filePath        │
                    │ fileSize        │
                    │ jobTitle        │
                    │ jobDescription  │
                    │ uploadDate      │
                    │ status          │
                    │ analysisData    │
                    └─────────────────┘
```

**Add Photo:** ER Diagram showing relationships between User and Resume entities

**5.2.2 Database Schema**

**User Collection:**

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  isEmailVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Resume Collection:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  filename: String (required),
  originalName: String (required),
  filePath: String (required),
  fileSize: Number (required),
  jobTitle: String (required),
  jobDescription: String (required),
  uploadDate: Date (default: Date.now),
  status: String (enum: ['uploaded', 'processing', 'analyzed', 'error']),
  analysisData: {
    atsScore: Number,
    summary: String,
    strengths: [String],
    improvementAreas: [String],
    keywordMatch: {
      matched: [String],
      missing: [String]
    },
    recommendations: [String],
    detailedAnalysis: String,
    contactInfo: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      website: String
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Add Photo:** Database schema diagram

#### **5.3 Data Flow Diagrams (DFD)**

**5.3.1 Level 0 DFD (Context Diagram)**

```
                    ┌─────────────────┐
                    │   Job Seeker    │
                    └─────────────────┘
                           │
                           │ Resume Upload
                           │ Analysis Request
                           │
                    ┌─────────────────┐
                    │   CareerLyze    │
                    │     System      │
                    └─────────────────┘
                           │
                           │ AI Analysis
                           │ Report Generation
                           │
                    ┌─────────────────┐
                    │   Gemini AI     │
                    │   Service       │
                    └─────────────────┘
```

**Add Photo:** Level 0 DFD - Context Diagram

**5.3.2 Level 1 DFD**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───▶│   User      │───▶│   User      │
│             │    │  Auth       │    │  Profile    │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Resume    │───▶│   File      │───▶│   Resume    │
│   Upload    │    │  Processing │    │  Storage    │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   AI        │───▶│   Analysis  │───▶│   Report    │
│  Analysis   │    │   Engine    │    │ Generation  │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

**Add Photo:** Level 1 DFD - Main Processes

**5.3.3 Level 2 DFD - Resume Analysis Process**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PDF       │───▶│   Text      │───▶│   Content   │
│  Extraction │    │ Extraction  │    │  Analysis   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Format    │───▶│   Keyword   │───▶│   Score     │
│  Analysis   │    │  Analysis   │    │Calculation  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Report    │───▶│   Database  │───▶│   User      │
│ Generation  │    │   Storage   │    │ Dashboard   │
└─────────────┘    └─────────────┘    └─────────────┘
```

**Add Photo:** Level 2 DFD - Resume Analysis Process

#### **5.4 UML Diagrams**

**5.4.1 Use Case Diagram**

```
                    ┌─────────────────┐
                    │   Job Seeker    │
                    └─────────────────┘
                           │
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Register  │    │    Login    │    │   Upload    │
│   Account   │    │             │    │   Resume    │
└─────────────┘    └─────────────┘    └─────────────┘
        │                  │                  │
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   View      │    │   Analyze   │    │   Download  │
│  Profile    │    │   Resume    │    │   Report    │
└─────────────┘    └─────────────┘    └─────────────┘
        │                  │                  │
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Update    │    │   View      │    │   Share     │
│  Profile    │    │  Analysis   │    │   Report    │
└─────────────┘    └─────────────┘    └─────────────┘
```

**Add Photo:** Use Case Diagram

**5.4.2 Class Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                        User                                 │
│ ────────────────────────────────────────────────────────── │
│ + _id: ObjectId                                            │
│ + email: string                                            │
│ + password: string                                         │
│ + firstName: string                                        │
│ + lastName: string                                         │
│ + isEmailVerified: boolean                                 │
│ + createdAt: Date                                          │
│ + updatedAt: Date                                          │
│ ────────────────────────────────────────────────────────── │
│ + register(): Promise<User>                                │
│ + login(): Promise<string>                                 │
│ + updateProfile(): Promise<User>                           │
│ + changePassword(): Promise<boolean>                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              │
┌─────────────────────────────────────────────────────────────┐
│                        Resume                               │
│ ────────────────────────────────────────────────────────── │
│ + _id: ObjectId                                            │
│ + userId: ObjectId                                         │
│ + filename: string                                         │
│ + originalName: string                                     │
│ + filePath: string                                         │
│ + fileSize: number                                         │
│ + jobTitle: string                                         │
│ + jobDescription: string                                   │
│ + uploadDate: Date                                         │
│ + status: string                                           │
│ + analysisData: object                                     │
│ ────────────────────────────────────────────────────────── │
│ + upload(): Promise<Resume>                                │
│ + process(): Promise<string>                                │
│ + analyze(): Promise<object>                                │
│ + delete(): Promise<boolean>                                │
└─────────────────────────────────────────────────────────────┘
```

**Add Photo:** Class Diagram

**5.4.3 Sequence Diagram - Resume Analysis Process**

```
User    │   Frontend   │   Backend    │   AI Service │  Database
  │     │              │              │              │
  │────▶│              │              │              │
  │     │              │              │              │
  │     │─────upload──▶│              │              │
  │     │              │              │              │
  │     │              │─────store───▶│              │
  │     │              │              │              │
  │     │              │              │              │
  │     │              │─────extract─▶│              │
  │     │              │              │              │
  │     │              │              │─────analyze─▶│
  │     │              │              │              │
  │     │              │              │◀────result───│
  │     │              │              │              │
  │     │              │◀────score───│              │
  │     │              │              │              │
  │     │              │─────save───▶│              │
  │     │              │              │              │
  │     │◀────report───│              │              │
  │     │              │              │              │
  │◀────│              │              │              │
```

**Add Photo:** Sequence Diagram - Resume Analysis Process

**5.4.4 Activity Diagram - User Registration Flow**

```
Start
  │
  ▼
┌─────────────┐
│   User      │
│  Visits     │
│  Register   │
│   Page      │
└─────────────┘
  │
  ▼
┌─────────────┐
│   Fill      │
│  Form       │
│  Details    │
└─────────────┘
  │
  ▼
┌─────────────┐
│   Validate  │
│   Input     │
└─────────────┘
  │
  ▼
┌─────────────┐
│   Check     │
│   Email     │
│  Exists     │
└─────────────┘
  │
  ▼
┌─────────────┐
│   Create    │
│   Account   │
└─────────────┘
  │
  ▼
┌─────────────┐
│   Send      │
│ Welcome     │
│   Email     │
└─────────────┘
  │
  ▼
┌─────────────┐
│   Show      │
│ Success     │
│ Message     │
└─────────────┘
  │
  ▼
End
```

**Add Photo:** Activity Diagram - User Registration Flow

---

_[End of Part 4 - System Design]_
_[Next: Part 5 - Coding & Implementation]_
