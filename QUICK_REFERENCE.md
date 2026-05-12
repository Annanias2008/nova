# Golden Tour App - Quick Reference

## 🎯 Project Summary

**Golden Tour App** is a Figma-integrated design system management platform that enables teams to:
- Create and manage component libraries
- Extract design tokens from Figma
- Generate production-ready code (React, Vue, Angular)
- Create interactive guided tours
- Collaborate in real-time
- Export design systems as npm packages

---

## 📋 Tech Stack

### Frontend (Your Prototype)
- React (UI framework)
- Figma integration
- Interactive component previews
- Tailwind CSS styling

### Backend (To Build)
| Layer | Technology |
|-------|-----------|
| **API** | Node.js + Express.js |
| **Database** | PostgreSQL + Redis |
| **Real-time** | Socket.IO |
| **File Storage** | AWS S3 / MinIO |
| **Task Queue** | Bull (Job Queue) |
| **Monitoring** | Sentry / DataDog |

---

## 🏗️ Core Services

```
┌──────────────────────────┐
│   Frontend (Your App)    │
└────────────┬─────────────┘
             │ HTTP/WebSocket
             ↓
┌──────────────────────────┐
│  API Gateway & Routes    │
├──────────────────────────┤
│ • Auth Service           │
│ • Project Manager        │
│ • Component Manager      │
│ • Token Manager          │
│ • CSS Generator          │
│ • Code Generator         │
│ • Tour Manager           │
│ • Figma Integration      │
│ • Asset Manager          │
│ • Preview Service        │
└──────────────────────────┘
         │
  ┌──────┼──────┬─────────┐
  ↓      ↓      ↓         ↓
┌────┐ ┌───┐ ┌────┐ ┌────────┐
│ DB │ │SKD│ │Jobs│ │Figma/S3
│PG  │ │   │ │Bull│ │API
└────┘ └───┘ └────┘ └────────┘
```

---

## 📊 Database Schema (Simplified)

```
users
├── id, email, figmaUserId
├── profileImage, createdAt

projects
├── id, ownerId, name, figmaFileId
├── settings, createdAt

projectMembers
├── id, projectId, userId, role

components
├── id, projectId, name, figmaNodeId
├── props, documentation

componentVariants
├── id, componentId, variantProps, css

designTokens
├── id, projectId, category, name, value

tours
├── id, projectId, title, steps

tourSteps
├── id, tourId, title, selector, action

codeExports
├── id, projectId, framework, downloadUrl
```

---

## 🔌 Main API Endpoints

### Authentication
```
POST   /api/auth/figma-login              🔓 Public
GET    /api/auth/figma-callback          🔓 Callback
POST   /api/auth/refresh-token           🔒 Protected
POST   /api/auth/logout                  🔒 Protected
```

### Projects
```
GET    /api/projects                     🔒 List user projects
POST   /api/projects                     🔒 Create project
GET    /api/projects/:id                 🔒 Get details
PUT    /api/projects/:id                 🔒 Update
DELETE /api/projects/:id                 🔒 Delete
POST   /api/projects/:id/members         🔒 Add member
```

### Components
```
GET    /api/projects/:id/components              🔒 List
POST   /api/projects/:id/components              🔒 Create
GET    /api/projects/:id/components/:cId         🔒 Get
PUT    /api/projects/:id/components/:cId         🔒 Update
DELETE /api/projects/:id/components/:cId         🔒 Delete
```

### CSS Generation
```
POST   /api/css/:projectId/generate       🔒 Generate CSS
POST   /api/css/:projectId/tailwind       🔒 Tailwind config
GET    /api/css/:projectId/download       🔒 Download
```

### Code Generation
```
POST   /api/codegen/:projectId/generate   🔒 Generate code
GET    /api/codegen/:projectId/exports    🔒 List exports
GET    /api/codegen/:id/exports/:eId/dl   🔒 Download
```

### Tours
```
GET    /api/tours/:projectId              🔒 List
POST   /api/tours/:projectId              🔒 Create
PUT    /api/tours/:projectId/:tourId      🔒 Update
DELETE /api/tours/:projectId/:tourId      🔒 Delete
```

### Figma Integration
```
POST   /api/figma/:projectId/sync         🔒 Sync from Figma
GET    /api/figma/:projectId/status       🔒 Sync status
```

---

## 🚀 Getting Started (Quick Setup)

### Step 1: Setup Backend
```bash
cd backend-starter
npm install
cp .env.example .env
# Edit .env with your config
npm run migrate
npm run dev
```

### Step 2: Setup Database
```bash
# Create database
createdb golden_tour

# Run migrations
npm run migrate

# (Optional) Seed data
npm run seed
```

### Step 3: Verify API
```bash
curl http://localhost:3000/health
# Response: { "status": "ok" }
```

### Step 4: Connect Frontend
```javascript
// In frontend .env
REACT_APP_API_URL=http://localhost:3000/api

// In frontend code
const response = await fetch('http://localhost:3000/api/projects', {
  headers: {
    'Authorization': `Bearer ${jwtToken}`
  }
});
```

---

## 💾 Database Setup

### PostgreSQL (Windows)
```bash
# Via Chocolatey
choco install postgresql

# Or download: https://www.postgresql.org/download/windows/

# Create user & database
psql -U postgres
CREATE DATABASE golden_tour;
CREATE USER golden_tour WITH PASSWORD 'password';
GRANT ALL ON DATABASE golden_tour TO golden_tour;
```

### Connection String (.env)
```
DATABASE_URL=postgresql://golden_tour:password@localhost:5432/golden_tour
```

---

## 🔑 Required Environment Variables

```env
# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Redis (Caching & Sessions)
REDIS_URL=redis://localhost:6379

# JWT Auth
JWT_SECRET=your-super-secret-key-change-in-prod
JWT_EXPIRY=7d

# Figma API
FIGMA_CLIENT_ID=your-id
FIGMA_CLIENT_SECRET=your-secret
FIGMA_REDIRECT_URI=http://localhost:3000/api/auth/figma-callback

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
```

---

## 🎯 Key Features Implementation Guide

### 1. Figma Sync
```javascript
// Fetch components from Figma
POST /api/figma/:projectId/sync
// Returns: { components[], designTokens[] }
```

### 2. CSS Generation
```javascript
// Generate CSS variables + utilities
POST /api/css/:projectId/generate
// Returns: { css: "..." }
```

### 3. Code Generation
```javascript
// Generate React components
POST /api/codegen/:projectId/generate
// Returns: { exportId: "..." }
// Poll: GET /api/codegen/:projectId/exports/:exportId
```

### 4. Real-time Sync (WebSocket)
```javascript
// Connect
socket.emit('join-project', projectId)

// Listen for updates
socket.on('component-updated', (data) => {
  // Update UI
})

// Broadcast to all users in project
io.to(`project-${projectId}`).emit('component-updated', data)
```

### 5. Interactive Tours
```javascript
// Define tour steps with CSS selectors
POST /api/tours/:projectId
{
  "title": "Button Component Tour",
  "steps": [
    {
      "title": "Click button",
      "selector": ".button",
      "action": "click",
      "duration": 3000
    }
  ]
}
```

---

## 🧪 Testing

### Manual API Testing (cURL)
```bash
# Login
curl -X POST http://localhost:3000/api/auth/figma-login

# Get projects
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/api/projects

# Create project
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Design","figmaFileId":"abc123"}'

# Generate CSS
curl -X POST http://localhost:3000/api/css/project-id/generate \
  -H "Authorization: Bearer $TOKEN"
```

### Automated Testing
```bash
npm test                 # Unit tests
npm run test:int         # Integration tests
npm run test:load        # Load testing
```

---

## 📦 Deployment

### Docker
```bash
docker build -t golden-tour .
docker run -p 3000:3000 -e DATABASE_URL=... golden-tour
```

### Kubernetes
```bash
kubectl apply -f k8s/
# See k8s/ directory for manifests
```

### Environment Setup by Stage
```
Development:  http://localhost:3000
Staging:      https://staging-api.golden-tour.com
Production:   https://api.golden-tour.com
```

---

## 📈 Performance Metrics

### Expected Performance
- **API Response**: <200ms (avg)
- **CSS Generation**: <500ms
- **Code Generation**: <2s
- **Figma Sync**: <5s
- **Concurrent Users**: 100+ (horizontally scalable)

### Optimization Techniques
- Response caching (Redis)
- Database indexing
- Background jobs (Bull queue)
- CDN for assets
- Gzip compression

---

## 🔒 Security Features

✅ **Implemented**
- JWT token authentication
- Figma OAuth 2.0
- CORS protection
- Rate limiting (100 req/min)
- Input validation
- SQL injection prevention
- XSS protection (Helmet.js)
- HTTPS ready

⚠️ **To Implement**
- CSRF protection
- Audit logging
- Encryption at rest
- Regular security updates
- Penetration testing

---

## 📚 Folder Structure

```
backend-starter/
├── src/
│   ├── index.js                 # Entry point
│   ├── routes/                  # API endpoints
│   ├── services/                # Business logic
│   ├── middleware/              # Express middleware
│   ├── db/                      # Database
│   └── utils/                   # Helpers
├── tests/                       # Test files
├── Dockerfile                   # Docker config
├── docker-compose.yml          # Dev environment
├── package.json                # Dependencies
└── .env.example               # Env template
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000 && kill -9 <PID>` |
| DB connection error | Check PostgreSQL running, verify DATABASE_URL |
| Token expired | Call `/api/auth/refresh-token` endpoint |
| CORS error | Check FRONTEND_URL in .env matches frontend origin |
| Redis connection | Ensure Redis running on localhost:6379 |
| File upload fails | Check AWS S3 credentials and bucket name |

---

## 📞 Support Resources

| Topic | Resource |
|-------|----------|
| Backend | `/BACKEND_ARCHITECTURE.md` |
| Integration | `/FRONTEND_BACKEND_INTEGRATION.md` |
| Figma API | https://www.figma.com/developers |
| Express.js | https://expressjs.com |
| PostgreSQL | https://postgresql.org/docs |
| Socket.IO | https://socket.io/docs |

---

## ✅ Implementation Checklist

### Phase 1: MVP (Weeks 1-2)
- [ ] Set up Node.js backend
- [ ] Configure PostgreSQL database
- [ ] Implement authentication
- [ ] Create project management endpoints
- [ ] Implement Figma sync
- [ ] Basic CSS generation

### Phase 2: Core Features (Weeks 3-4)
- [ ] Component library management
- [ ] Code generation (React)
- [ ] Design token system
- [ ] CSS generation improvements
- [ ] Asset management
- [ ] WebSocket real-time sync

### Phase 3: Polish (Weeks 5-6)
- [ ] Error handling & validation
- [ ] Rate limiting & quotas
- [ ] Testing & documentation
- [ ] Performance optimization
- [ ] Security audit
- [ ] Monitoring setup

### Phase 4: Advanced (Weeks 7+)
- [ ] Multi-framework code gen
- [ ] Tour system
- [ ] npm package export
- [ ] Design system website generator
- [ ] Enterprise features
- [ ] Analytics & insights

---

## 🎓 Learning Path

1. **Understand the architecture** → Read BACKEND_ARCHITECTURE.md
2. **Set up local environment** → Follow Getting Started section
3. **Review database schema** → Examine migrations and models
4. **Study example routes** → Review projects.js, css.js, codegen.js
5. **Implement remaining endpoints** → Follow patterns in examples
6. **Add comprehensive tests** → Set up Jest with sample tests
7. **Deploy to staging** → Use Docker Compose for local testing
8. **Performance tune** → Benchmark and optimize
9. **Add monitoring** → Sentry, DataDog, or similar
10. **Production launch** → Kubernetes or cloud platform

---

**Created:** May 2026  
**Version:** 1.0.0  
**Status:** Ready for implementation
