# 🏗️ Golden Tour App - Architecture Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          END USERS                              │
│   Designers  │  Developers  │  Product Managers  │  Teams       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    HTTP / WebSocket
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
    ┌─────────────┐            ┌──────────────────┐
    │   CDN &     │            │  API Gateway &   │
    │   Static    │            │  Load Balancer   │
    │  Files      │            └────────┬─────────┘
    └─────────────┘                     │
                                        │
         ┌──────────────┬───────────────┼─────────────┬──────────────┐
         │              │               │             │              │
         ▼              ▼               ▼             ▼              ▼
    ┌────────┐   ┌────────┐      ┌────────┐     ┌──────────┐  ┌────────────┐
    │   API  │   │   API  │      │   API  │     │   Real   │  │  File Proc │
    │ Server │   │ Server │      │ Server │     │  Time    │  │  Workers   │
    │ Node 1 │   │ Node 2 │      │ Node N │     │  Socket  │  │            │
    └─────┬──┘   └────┬───┘      └────┬───┘     │   IO     │  └────────────┘
          │           │                │         └──┬───────┘
          │           │                │            │
          └───────────┼────────────────┴────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
    ┌──────────────┐          ┌─────────────┐
    │  PostgreSQL  │          │    Redis    │
    │  Main DB     │          │   Cache &   │
    │              │          │  Queue      │
    │  • Users     │          │             │
    │  • Projects  │          │  Bull Jobs  │
    │  • Comps     │          │  Sessions   │
    │  • Tokens    │          │  Rate Limit │
    └──────────────┘          └─────────────┘
         │                         │
         └────────────┬────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
   ┌──────────┐             ┌────────────────┐
   │   AWS    │             │   Figma API    │
   │    S3    │             │   Integration  │
   │ Storage  │             │                │
   │   +      │             │  • Components  │
   │  CDN     │             │  • Tokens      │
   │          │             │  • Files       │
   └──────────┘             │  • Webhooks    │
                            └────────────────┘
```

---

## Request Flow Architecture

### 1. User Authentication Flow

```
User                Frontend App           Backend API              Figma
 │                      │                       │                    │
 │ Click "Login"        │                       │                    │
 ├─────────────────────→│                       │                    │
 │                      │ GET /auth/figma-login │                    │
 │                      ├──────────────────────→│                    │
 │                      │                       │ Redirect to OAuth  │
 │                      │◄──────────────────────┤◄───────────────────┤
 │                      │ figma.com/authorize   │                    │
 │                      │                       │                    │
 │◄─────────────────────┤ Redirect to Figma    │                    │
 │                      │                       │                    │
 │ [User authorizes]    │                       │                    │
 │─────────────────────────────────────────────────────────────────→│
 │                      │                       │   [OAuth code]     │
 │                      │                       │◄───────────────────┤
 │                      │                       │                    │
 │                      │ GET /auth/callback    │                    │
 │                      │ [code=...]            │                    │
 │◄─────────────────────┤◄──────────────────────┤                    │
 │ JWT + Refresh Token  │                       │                    │
 │                      │                       │                    │
```

### 2. Component Sync Flow

```
Frontend             Backend API            Figma API            Database
   │                    │                      │                     │
   │ POST /figma/sync   │                      │                     │
   ├───────────────────→│                      │                     │
   │                    │ getFileStructure()   │                     │
   │                    ├─────────────────────→│                     │
   │                    │ ← fileData            │                     │
   │                    │                      │                     │
   │                    │ getComponents()      │                     │
   │                    ├─────────────────────→│                     │
   │                    │ ← components[]       │                     │
   │                    │                      │                     │
   │                    │ parseComponents()    │                     │
   │                    │ extractTokens()      │                     │
   │                    │                      │                     │
   │                    │   INSERT components  │                     │
   │                    ├─────────────────────────────────────────────→│
   │                    │   INSERT tokens      │                     │
   │                    ├─────────────────────────────────────────────→│
   │                    │                      │                     │
   │ ← { components }   │                      │                     │
   │◄───────────────────┤                      │                     │
   │                    │                      │                     │
```

### 3. CSS Generation Flow

```
Frontend             Backend API           Database            File Storage
   │                    │                     │                     │
   │ POST /css/generate │                     │                     │
   ├───────────────────→│                     │                     │
   │                    │ SELECT tokens       │                     │
   │                    ├────────────────────→│                     │
   │                    │ ← tokens[]          │                     │
   │                    │                     │                     │
   │                    │ generateCSS()       │                     │
   │                    │ • Variables         │                     │
   │                    │ • Utilities         │                     │
   │                    │ • Tailwind config   │                     │
   │                    │                     │                     │
   │                    │ minifyCSS()         │                     │
   │                    │ processCSS()        │                     │
   │                    │                     │                     │
   │                    │ [Generate download] │                     │
   │                    ├─────────────────────────────────────────────→│
   │ ← CSS content      │                     │                     │
   │◄───────────────────┤                     │                     │
   │                    │                     │                     │
```

### 4. Code Generation Flow

```
Frontend             Backend API          Job Queue        File Storage
   │                    │                     │                 │
   │ POST /codegen/gen  │                     │                 │
   ├───────────────────→│                     │                 │
   │                    │ Queue job           │                 │
   │                    ├────────────────────→│                 │
   │ ← exportId         │                     │                 │
   │◄───────────────────┤                     │                 │
   │                    │                     │                 │
   │                    │                     │ [Processing]    │
   │                    │                     │                 │
   │ Poll: /codegen/ex/ │                     │                 │
   │ exportId           │                     │                 │
   ├───────────────────→│                     │                 │
   │                    │ SELECT status       │                 │
   │ ← status: queued   │                     │                 │
   │◄───────────────────┤                     │                 │
   │                    │                     │                 │
   │                    │                     │ generateCode()  │
   │                    │                     │ generateTypes() │
   │                    │                     │ generateStory() │
   │                    │                     │                 │
   │                    │                     │ → Upload files  │
   │                    │                     ├────────────────→│
   │                    │ UPDATE status       │                 │
   │                    │ [complete]          │                 │
   │                    │                     │                 │
   │ Poll again         │                     │                 │
   ├───────────────────→│                     │                 │
   │ ← status: complete │                     │                 │
   │    downloadUrl: ..│                     │                 │
   │◄───────────────────┤                     │                 │
   │                    │                     │                 │
```

---

## Service Dependencies

```
┌─────────────────────────────────────┐
│      API Gateway / Routes           │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │   Auth Service                  │ │
│ │ • OAuth with Figma              │ │
│ │ • JWT generation & validation   │ │
│ └──────────┬──────────────────────┘ │
│            │                         │
│ ┌──────────▼──────────────────────┐ │
│ │  Project Manager                │ │
│ │ • CRUD operations               │ │
│ │ • Collaboration                 │ │
│ └──────────┬──────────────────────┘ │
│            │                         │
│ ┌──────────▼──────────────────────┐ │
│ │  Component Manager              │ │
│ │ • Component storage             │ │
│ │ • Variant management            │ │
│ └──────────┬──────────────────────┘ │
│            │                         │
│ ┌──────────▼──────────────────────┐ │
│ │  Token Manager                  │ │
│ │ • Design tokens                 │ │
│ │ • Token validation              │ │
│ └──────────┬──────────────────────┘ │
│            │                         │
│ ┌──────────▼──────────────────────┐ │
│ │  CSS Generator                  │ │
│ │ • Generate CSS from tokens      │ │
│ │ • Multiple formats              │ │
│ └──────────┬──────────────────────┘ │
│            │                         │
│ ┌──────────▼──────────────────────┐ │
│ │  Code Generator                 │ │
│ │ • Component code generation     │ │
│ │ • Multi-framework support       │ │
│ └──────────┬──────────────────────┘ │
│            │                         │
│ ┌──────────▼──────────────────────┐ │
│ │  Figma Integration              │ │
│ │ • Fetch Figma data              │ │
│ │ • Parse tokens & components     │ │
│ └──────────┬──────────────────────┘ │
│            │                         │
│ ┌──────────▼──────────────────────┐ │
│ │  Tour Manager                   │ │
│ │ • Tour CRUD                     │ │
│ │ • Progress tracking             │ │
│ └──────────┬──────────────────────┘ │
│            │                         │
│ ┌──────────▼──────────────────────┐ │
│ │  Asset Manager                  │ │
│ │ • File upload/download          │ │
│ │ • CDN integration               │ │
│ └──────────┬──────────────────────┘ │
│            │                         │
│ ┌──────────▼──────────────────────┐ │
│ │  Preview Service                │ │
│ │ • Component previews            │ │
│ │ • Rendering                     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
         │
    ┌────┴────────────────────┬────────────────────┐
    ▼                         ▼                    ▼
Database                   Cache               File Storage
PostgreSQL                 Redis               AWS S3
```

---

## Data Flow: Complete Project Workflow

```
Step 1: Create Project
┌──────────────────┐
│ User creates     │
│ project with     │
│ Figma file ID    │
└────────┬─────────┘
         │
    ┌────▼────────────────────┐
    │ Backend stores project  │
    │ in database             │
    └────┬────────────────────┘
         │
         
Step 2: Sync Figma Components
┌──────────────────┐
│ User clicks      │
│ "Sync Figma"     │
└────────┬─────────┘
         │
    ┌────▼────────────────────┐
    │ Fetch from Figma API    │
    │ Parse components        │
    │ Extract tokens          │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ Store in database:      │
    │ • Components table      │
    │ • Design tokens table   │
    │ • Component variants    │
    └────┬────────────────────┘
         │
         
Step 3: Generate CSS
┌──────────────────┐
│ User requests    │
│ CSS generation   │
└────────┬─────────┘
         │
    ┌────▼────────────────────┐
    │ Fetch tokens from DB    │
    │ Generate CSS:           │
    │ • Variables             │
    │ • Utilities             │
    │ • Config                │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ Store/cache result      │
    │ Return to frontend      │
    └────┬────────────────────┘
         │
         
Step 4: Generate Code
┌──────────────────┐
│ User requests    │
│ code generation  │
│ (React)          │
└────────┬─────────┘
         │
    ┌────▼────────────────────┐
    │ Queue background job    │
    │ Return job ID           │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ Job processes:          │
    │ • Fetch components      │
    │ • Generate JSX files    │
    │ • Generate TypeScript   │
    │ • Generate stories      │
    │ • Create package.json   │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ Upload to S3            │
    │ Create download link    │
    │ Update job status       │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ Frontend polls for      │
    │ completion              │
    │ Shows download link     │
    └────────────────────────┘
```

---

## Deployment Architecture

```
Production Environment
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │         DNS & CDN                               │ │
│  │  (Cloudflare / CloudFront)                      │ │
│  └────────────┬─────────────────────────────────────┘ │
│               │                                        │
│  ┌────────────▼─────────────────────────────────────┐ │
│  │     Application Load Balancer                    │ │
│  │     (AWS ALB / NGINX)                            │ │
│  └────────────┬─────────────────────────────────────┘ │
│               │                                        │
│    ┌──────────┴──────────┐                            │
│    │                     │                            │
│  ┌─▼────────┐        ┌──▼─────────┐                 │
│  │ API Pod 1│        │ API Pod 2  │                 │
│  │ (Node 1) │        │ (Node 2)   │                 │
│  │ Port 3000│        │ Port 3000  │                 │
│  └─┬────────┘        └──┬─────────┘                 │
│    │                    │                            │
│    └────────┬───────────┘                            │
│             │                                        │
│  ┌──────────▼─────────────────────────────────────┐ │
│  │     Service Mesh (Istio)                       │ │
│  │  • Traffic management                          │ │
│  │  • Service discovery                           │ │
│  │  • Load balancing                              │ │
│  └──────────┬─────────────────────────────────────┘ │
│             │                                        │
│   ┌─────────┴──────────┬──────────┐                  │
│   ▼                    ▼          ▼                  │
│ ┌────────┐         ┌────────┐  ┌──────────┐         │
│ │PostgreSQL        │ Redis  │  │ Bull Job │         │
│ │Primary           │ Cache  │  │ Queue    │         │
│ │(Multi-AZ)        │Cluster │  │(Redis)   │         │
│ └─┬──────┘         └────────┘  └──────────┘         │
│   │                                                  │
│   └─── Backups to S3                               │
│                                                     │
└────────────────────────────────────────────────────┘

External Integrations
┌────────┐         ┌────────┐         ┌──────────┐
│ Figma  │         │  AWS   │         │ SendGrid │
│  API   │         │   S3   │         │  Email   │
└────────┘         └────────┘         └──────────┘
```

---

## Real-time Collaboration Architecture

```
Multiple Users with WebSocket
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User A    │    │   User B    │    │   User C    │
│  Browser    │    │  Browser    │    │  Browser    │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       │         WebSocket (Socket.IO)       │
       │                  │                  │
       │  ┌───────────────┴───────────────┐  │
       │  │                               │  │
       └──→ Socket.IO Server               ←──┘
           (Node.js + Socket.IO)
           │
           ├─ Connection pool
           ├─ Room manager (project-123)
           ├─ Event emitter
           └─ Redis adapter (for horizontal scaling)
           │
           ├─ Broadcast: component-updated
           ├─ Broadcast: css-generated
           ├─ Broadcast: tour-step-completed
           └─ Broadcast: member-joined
           │
       ┌───┴────┐
       │        │
       ▼        ▼
   Database   Cache
   (Persist)  (Speed)
```

---

## Error Handling & Monitoring

```
Request
  │
  ├─→ Input Validation
  │   └─ If invalid: Return 400
  │
  ├─→ Authentication
  │   └─ If not auth: Return 401
  │
  ├─→ Authorization
  │   └─ If not allowed: Return 403
  │
  ├─→ Business Logic
  │   ├─ Success: Return 200/201
  │   └─ Error:
  │       ├─→ Catch error
  │       ├─→ Log to Sentry
  │       ├─→ Log to CloudWatch
  │       ├─→ Alert if critical
  │       └─→ Return 500 + error msg
  │
  └─→ Global Error Handler
      └─ Format error response
         Logging pipeline
         Monitoring alerts
```

---

## Security Layers

```
┌─────────────────────────────────────┐
│         User Request                │
└────────────────┬────────────────────┘
                 │
        ┌────────▼────────┐
        │  HTTPS/TLS      │ Layer 1: Encryption
        │  Encryption     │ in transit
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Rate Limiting  │ Layer 2: DDoS
        │  (100 req/min)  │ protection
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Helmet.js      │ Layer 3: HTTP
        │  Security       │ headers
        │  Headers        │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  CORS Policy    │ Layer 4: CORS
        │  Whitelist      │ validation
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  JWT Auth       │ Layer 5: Auth
        │  Verification   │ token check
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Input          │ Layer 6: Input
        │  Validation     │ validation
        │  (Joi)          │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Authorization  │ Layer 7: RBAC
        │  Check          │ permission check
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Parameterized  │ Layer 8: SQL
        │  Queries        │ injection
        │  (Prepared)     │ prevention
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Business Logic │ Layer 9: App
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Audit Logging  │ Layer 10: Audit
        │                 │ trail
        └─────────────────┘
```

---

## Performance Optimization Pipeline

```
Request
  │
  ├─→ Check Redis Cache
  │   └─ Hit: Return cached response
  │
  ├─→ Database Query
  │   ├─ Use indexes
  │   ├─ Limit results (pagination)
  │   └─ Select specific columns
  │
  ├─→ Data Processing
  │   ├─ Minimal transformations
  │   └─ Batch operations
  │
  ├─→ Response Formatting
  │   ├─ Gzip compression
  │   ├─ Remove unnecessary fields
  │   └─ Minify JSON
  │
  └─→ Cache Result
      ├─ Set TTL (time-to-live)
      └─ Invalidate on updates
```

---

## Scalability Path

```
Phase 1: MVP (Single Server)
┌─────────────┐
│  API Server │ ← 100 users
│  + Database │
│  + Cache    │
└─────────────┘

         │
         ▼

Phase 2: Horizontal Scaling
┌─────────────┐
│   Server 1  │
├─────────────┤
│   Server 2  │  ← 500 users
├─────────────┤    + Load Balancer
│   Server N  │    + Shared DB/Cache
├─────────────┤
│  Database   │
│  (Read rep) │
└─────────────┘

         │
         ▼

Phase 3: Kubernetes Cluster
┌─────────────────────────────────┐
│     Kubernetes Cluster          │
│  ┌──────────────────────────┐   │
│  │  API Pod Replicas (10+)  │   │ ← 2000+ users
│  │  Auto-scaling            │   │   + Microservices
│  │  Load balancing          │   │   + DB replication
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │  Cache (Redis Cluster)   │   │
│  ├──────────────────────────┤   │
│  │  Background Jobs (50+)   │   │
│  ├──────────────────────────┤   │
│  │  PostgreSQL Multi-node   │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
         │
         ▼

Phase 4: Microservices
┌──────────────────────────────────┐
│  API Gateway                     │
├──────────────────────────────────┤
│ ┌─────┐ ┌──────┐ ┌──────┐ ┌───┐ │
│ │Auth │ │Users │ │Comps │ │...│ │  ← 5000+ users
│ └─────┘ └──────┘ └──────┘ └───┘ │    + Independent scaling
│ ┌──────────────────────────────┐ │    + Fault isolation
│ │  Message Queue (RabbitMQ)    │ │    + Service discovery
│ │  Service Mesh (Istio)        │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

---

## Summary

This architecture supports:
- **100x growth** without code changes
- **High availability** with redundancy
- **Zero downtime** deployments
- **Real-time** collaboration
- **Enterprise-grade** security
- **Multi-region** deployment

---

**Created:** May 2026  
**Version:** 1.0.0
