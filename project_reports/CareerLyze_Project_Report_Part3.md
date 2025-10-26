# CareerLyze - AI-Powered Resume Analysis & Career Optimization Platform

## MCA Major Project Report - Part 3

**Student Details:**

- **Name:** Deepak Kumar
- **University ID:** 024MCA160487
- **Course:** MCA - Al & ML
- **University:** Chandigarh University

---

### **3. Software & Hardware Requirements**

#### **3.1 Hardware Requirements**

**3.1.1 Development Environment**

- **Processor:** Intel Core i5 or AMD Ryzen 5 (minimum)
- **RAM:** 8GB DDR4 (16GB recommended)
- **Storage:** 256GB SSD (500GB recommended)
- **Graphics:** Integrated graphics sufficient
- **Network:** Broadband internet connection (minimum 10 Mbps)

**3.1.2 Production Server Requirements**

- **CPU:** 4+ cores, 2.4GHz+
- **RAM:** 8GB+ (16GB recommended for production)
- **Storage:** 100GB+ SSD storage
- **Network:** High-speed internet with load balancing
- **Backup:** Automated backup system

**3.1.3 Client Requirements**

- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM:** 4GB minimum
- **Storage:** 1GB free space for caching
- **Network:** Stable internet connection

#### **3.2 Software Requirements**

**3.2.1 Development Tools**

- **IDE:** Visual Studio Code or WebStorm
- **Version Control:** Git
- **Package Manager:** npm (Node.js 18+)
- **Database Client:** MongoDB Compass
- **API Testing:** Postman or Insomnia

**3.2.2 Runtime Environment**

- **Node.js:** Version 18.0 or higher
- **npm:** Version 8.0 or higher
- **MongoDB:** Version 5.0 or higher (MongoDB Atlas)
- **Operating System:** Windows 10+, macOS 10.15+, Ubuntu 20.04+

**3.2.3 Production Environment**

- **Cloud Platform:** Vercel (recommended), Netlify, Railway
- **Database:** MongoDB Atlas (cloud)
- **CDN:** Vercel Edge Network or Cloudflare
- **Monitoring:** Vercel Analytics or Google Analytics

#### **3.3 Technologies Used**

**3.3.1 Frontend Technologies**

- **Next.js 16:** React framework with App Router for production
- **React 19:** Latest React with concurrent features
- **TypeScript:** Type-safe development
- **Tailwind CSS 4:** Utility-first CSS framework
- **Lucide React:** Beautiful icon library

**3.3.2 Backend Technologies**

- **Next.js API Routes:** Server-side API endpoints
- **Node.js:** JavaScript runtime environment
- **MongoDB Atlas:** Cloud NoSQL database
- **Mongoose:** MongoDB object modeling
- **JWT:** JSON Web Token authentication

**3.3.3 AI and Processing**

- **Google Gemini AI:** Advanced language model for resume analysis
- **@google/genai:** Official Google AI SDK
- **Multer:** File upload middleware
- **PDF Processing:** Built-in PDF handling capabilities

**3.3.4 Additional Libraries**

- **bcryptjs:** Password hashing with 12 salt rounds
- **nodemailer:** Email functionality with Gmail SMTP
- **axios:** HTTP client for API requests
- **react-markdown:** Markdown rendering for analysis reports
- **remark-gfm:** GitHub Flavored Markdown support
- **react-pdf:** PDF viewing capabilities

---

### **4. SDLC / Project Methodology**

#### **4.1 Software Development Life Cycle**

**Methodology:** Agile Development with Scrum Framework

**Rationale for Choosing Agile:**

- Iterative development allows for continuous feedback
- Flexible requirements handling
- Early and frequent delivery of working software
- Collaborative approach with stakeholders
- Adaptability to changing requirements
- Better risk management through short sprints

#### **4.2 Development Phases**

**Phase 1: Planning and Requirements (Week 1-2)**

- Project scope definition
- Requirements gathering and analysis
- Technology stack selection (Next.js, MongoDB, Gemini AI)
- Project timeline creation
- Team role assignment

**Phase 2: Design and Architecture (Week 3-4)**

- System architecture design
- Database schema design with MongoDB
- UI/UX wireframe creation
- API specification and documentation
- Security planning and implementation

**Phase 3: Development Sprint 1 (Week 5-7)**

- User authentication system with JWT
- Basic UI components with Tailwind CSS
- Database setup with MongoDB Atlas
- File upload functionality with Multer

**Phase 4: Development Sprint 2 (Week 8-10)**

- PDF processing implementation
- AI integration with Google Gemini
- Resume analysis logic and algorithms
- Basic reporting system

**Phase 5: Development Sprint 3 (Week 11-13)**

- Advanced analysis features
- Dashboard implementation with analytics
- Report generation with visual elements
- User management and profile features

**Phase 6: Testing and Deployment (Week 14-16)**

- Unit testing with Jest
- Integration testing
- User acceptance testing
- Performance optimization
- Production deployment on Vercel

**Add Flowchart:** SDLC process diagram showing all phases

#### **4.3 Sprint Planning**

**Sprint Duration:** 2 weeks
**Sprint Ceremonies:**

- Sprint Planning
- Daily Standups
- Sprint Review
- Sprint Retrospective

**Sprint Backlog Management:**

- User stories creation
- Task breakdown
- Effort estimation
- Priority assignment
- Definition of Done criteria

#### **4.4 Quality Assurance**

**Testing Strategy:**

- **Unit Testing:** Individual component testing with Jest
- **Integration Testing:** Module interaction testing
- **System Testing:** End-to-end functionality testing
- **User Acceptance Testing:** Real user scenario testing
- **Performance Testing:** Load and stress testing

**Code Quality:**

- Code reviews for all pull requests
- ESLint for code style enforcement
- TypeScript for type safety
- Automated testing pipeline
- Continuous integration with GitHub Actions

#### **4.5 Risk Management**

**Identified Risks:**

1. **AI API Rate Limits:** Mitigation through caching and optimization
2. **PDF Processing Complexity:** Use proven libraries and error handling
3. **Scalability Issues:** Cloud infrastructure and load balancing
4. **Security Vulnerabilities:** Regular security audits and updates
5. **Data Privacy Concerns:** GDPR compliance and data protection

**Risk Mitigation Strategies:**

- Regular risk assessment meetings
- Backup plans for critical components
- Performance monitoring and alerting
- Security best practices implementation
- Data backup and recovery procedures

**Add Diagram:** Risk assessment matrix

#### **4.6 Project Timeline**

```
Timeline Overview (16 weeks):

Week 1-2:   Planning & Requirements
Week 3-4:   Design & Architecture
Week 5-7:   Sprint 1 - Authentication & Basic UI
Week 8-10:  Sprint 2 - PDF Processing & AI Integration
Week 11-13: Sprint 3 - Advanced Features & Dashboard
Week 14-16: Testing, Optimization & Deployment

Milestones:
- Week 4:  Design Complete
- Week 7:  MVP Ready
- Week 10: Core Features Complete
- Week 13: Feature Complete
- Week 16: Production Ready
```

**Add Gantt Chart:** Detailed project timeline with dependencies

---

_[End of Part 3 - Requirements and SDLC Methodology]_
_[Next: Part 4 - System Design]_
