# Golden Tour App - Backend Architecture Design

## Overview
The backend supports a Figma-integrated design system management platform with component previews, CSS generation, and interactive guided tours.

---

## 1. Core Services Architecture

### 1.1 API Gateway / Authentication Service
- **Endpoints**: `/auth/*`
- **Responsibilities**:
  - OAuth2 with Figma (for plugin authentication)
  - JWT token generation and validation
  - User session management
  - Role-based access control (RBAC)
- **Tech**: Node.js + Passport.js / FastAPI + FastAPI-Users

### 1.2 Project Management Service
- **Endpoints**: `/projects/*`
- **Responsibilities**:
  - Create/read/update/delete projects
  - Manage project metadata and settings
  - Handle project versioning
  - Project collaboration features
- **Database**: Projects, ProjectMembers, ProjectVersions
- **Key Models**:
  ```
  Project {
    id, name, description, ownerId, figmaFileId, 
    createdAt, updatedAt, isPublic, settings
  }
  ```

### 1.3 Design Component Service
- **Endpoints**: `/components/*`
- **Responsibilities**:
  - Store component metadata (name, properties, variants)
  - Manage component documentation
  - Track component usage across projects
  - Version control for components
- **Database**: Components, ComponentVariants, ComponentPropertes
- **Key Features**:
  - Component library management
  - Variant tracking (sizes, colors, states)
  - Component dependency graph

### 1.4 CSS Builder & Generator Service
- **Endpoints**: `/css/*`, `/styles/*`
- **Responsibilities**:
  - Generate CSS from design tokens
  - CSS-in-JS compilation
  - Tailwind configuration generation
  - SCSS/LESS compilation
  - CSS validation and optimization
- **Key Operations**:
  - Parse design system (colors, typography, spacing, shadows)
  - Generate utility classes
  - Create component stylesheets
  - Output in multiple formats (CSS, SCSS, Tailwind config)

### 1.5 Code Generation Service
- **Endpoints**: `/codegen/*`
- **Responsibilities**:
  - Generate React/Vue/Angular components from Figma
  - Generate HTML/CSS mockups
  - TypeScript type definitions
  - Component prop documentation
  - Storybook story generation
- **Outputs**:
  - Component files (JSX/TSX/VUE)
  - Type definitions
  - Story files
  - README documentation

### 1.6 Preview & Rendering Service
- **Endpoints**: `/preview/*`
- **Responsibilities**:
  - Serve live component previews
  - iframe-based preview rendering
  - Real-time style updates
  - Component interaction testing
- **Tech**: Headless browser (Puppeteer) for screenshots/exports

### 1.7 Tour/Interactive Guide Service
- **Endpoints**: `/tours/*`
- **Responsibilities**:
  - Create/manage interactive tours
  - Store tour steps and navigation flows
  - Track user progress through tours
  - Analytics for tour completion
- **Database**: Tours, TourSteps, UserTourProgress
- **Key Models**:
  ```
  Tour {
    id, projectId, title, description, steps[], 
    createdAt, updatedAt, isPublished
  }
  TourStep {
    id, tourId, order, title, description, 
    targetElement, highlightBBox, action, duration
  }
  ```

### 1.8 Figma Integration Service
- **Endpoints**: `/figma/*`
- **Responsibilities**:
  - Fetch Figma file structure
  - Parse Figma design tokens
  - Sync design changes
  - Webhook handling for Figma updates
  - Extract colors, typography, spacing, components
- **Key Features**:
  - Figma API client
  - Design token extraction
  - Real-time sync via webhooks
  - Component mapping (Figma → Code)

### 1.9 Asset Management Service
- **Endpoints**: `/assets/*`
- **Responsibilities**:
  - Store and serve design assets
  - Image optimization and compression
  - SVG management and optimization
  - Asset versioning and CDN integration
- **Storage**: AWS S3 / Firebase Storage / MinIO

### 1.10 Export & Delivery Service
- **Endpoints**: `/export/*`
- **Responsibilities**:
  - Generate design system packages
  - Create npm packages
  - Generate design documentation
  - Create design system websites
  - Export as ZIP, NPM package, etc.
- **Outputs**:
  - npm package with components
  - Design tokens
  - Documentation site
  - Figma plugin package

---

## 2. Database Schema

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  figmaUserId VARCHAR(255) UNIQUE,
  profileImage VARCHAR(512),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  ownerId UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  figmaFileId VARCHAR(255),
  figmaTeamId VARCHAR(255),
  projectType ENUM('design-system', 'component-library', 'app-design'),
  isPublic BOOLEAN DEFAULT false,
  settings JSONB,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Project Members (for collaboration)
CREATE TABLE projectMembers (
  id UUID PRIMARY KEY,
  projectId UUID REFERENCES projects(id) ON DELETE CASCADE,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  role ENUM('owner', 'editor', 'viewer'),
  joinedAt TIMESTAMP,
  UNIQUE(projectId, userId)
);

-- Components
CREATE TABLE components (
  id UUID PRIMARY KEY,
  projectId UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  figmaNodeId VARCHAR(255),
  category VARCHAR(100),
  tags TEXT[],
  documentation JSONB,
  props JSONB,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Component Variants
CREATE TABLE componentVariants (
  id UUID PRIMARY KEY,
  componentId UUID REFERENCES components(id) ON DELETE CASCADE,
  name VARCHAR(255),
  variantProps JSONB,
  preview VARCHAR(512),
  css TEXT,
  createdAt TIMESTAMP
);

-- Design Tokens
CREATE TABLE designTokens (
  id UUID PRIMARY KEY,
  projectId UUID REFERENCES projects(id) ON DELETE CASCADE,
  category ENUM('color', 'typography', 'spacing', 'shadow', 'border', 'animation'),
  name VARCHAR(255) NOT NULL,
  value VARCHAR(512) NOT NULL,
  description TEXT,
  figmaVariableId VARCHAR(255),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  UNIQUE(projectId, category, name)
);

-- Tours
CREATE TABLE tours (
  id UUID PRIMARY KEY,
  projectId UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  isPublished BOOLEAN DEFAULT false,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Tour Steps
CREATE TABLE tourSteps (
  id UUID PRIMARY KEY,
  tourId UUID REFERENCES tours(id) ON DELETE CASCADE,
  stepOrder INTEGER,
  title VARCHAR(255),
  description TEXT,
  targetSelector VARCHAR(512),
  highlightBox JSONB,
  action VARCHAR(50),
  duration INTEGER,
  createdAt TIMESTAMP
);

-- User Tour Progress
CREATE TABLE userTourProgress (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  tourId UUID REFERENCES tours(id) ON DELETE CASCADE,
  currentStep INTEGER,
  completedAt TIMESTAMP,
  startedAt TIMESTAMP,
  UNIQUE(userId, tourId)
);

-- Generated Code Exports
CREATE TABLE codeExports (
  id UUID PRIMARY KEY,
  projectId UUID REFERENCES projects(id) ON DELETE CASCADE,
  userId UUID REFERENCES users(id),
  framework ENUM('react', 'vue', 'angular', 'html', 'storybook'),
  language ENUM('javascript', 'typescript'),
  outputFormat ENUM('components', 'npm-package', 'zip'),
  downloadUrl VARCHAR(512),
  generatedAt TIMESTAMP,
  expiresAt TIMESTAMP
);

-- API Keys (for third-party integrations)
CREATE TABLE apiKeys (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  projectId UUID REFERENCES projects(id),
  keyHash VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  scopes TEXT[],
  lastUsedAt TIMESTAMP,
  createdAt TIMESTAMP,
  expiresAt TIMESTAMP
);

-- Audit Logs
CREATE TABLE auditLogs (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  projectId UUID REFERENCES projects(id),
  action VARCHAR(100),
  resource VARCHAR(100),
  resourceId VARCHAR(255),
  changes JSONB,
  createdAt TIMESTAMP
);
```

---

## 3. API Endpoints Reference

### Authentication
```
POST   /api/auth/figma-login        - Initiate Figma OAuth
GET    /api/auth/figma-callback    - Handle Figma OAuth callback
POST   /api/auth/logout            - Logout user
POST   /api/auth/refresh-token     - Refresh JWT token
```

### Projects
```
GET    /api/projects               - List user's projects
POST   /api/projects               - Create new project
GET    /api/projects/:projectId    - Get project details
PUT    /api/projects/:projectId    - Update project
DELETE /api/projects/:projectId    - Delete project
POST   /api/projects/:projectId/members      - Add collaborator
GET    /api/projects/:projectId/members      - List collaborators
```

### Components
```
GET    /api/projects/:projectId/components                    - List components
POST   /api/projects/:projectId/components                    - Create component
GET    /api/projects/:projectId/components/:componentId       - Get component
PUT    /api/projects/:projectId/components/:componentId       - Update component
DELETE /api/projects/:projectId/components/:componentId       - Delete component
GET    /api/projects/:projectId/components/:componentId/variants - List variants
```

### Design Tokens
```
GET    /api/projects/:projectId/tokens                        - List all tokens
POST   /api/projects/:projectId/tokens                        - Create token
GET    /api/projects/:projectId/tokens/:tokenId               - Get token
PUT    /api/projects/:projectId/tokens/:tokenId               - Update token
DELETE /api/projects/:projectId/tokens/:tokenId               - Delete token
POST   /api/projects/:projectId/tokens/sync-figma             - Sync from Figma
```

### CSS & Style Generation
```
POST   /api/projects/:projectId/css/generate                  - Generate CSS
POST   /api/projects/:projectId/css/tailwind-config           - Generate Tailwind config
POST   /api/projects/:projectId/css/preview                   - Preview CSS
GET    /api/projects/:projectId/css/download                  - Download CSS files
```

### Code Generation
```
POST   /api/projects/:projectId/codegen/generate              - Generate code
GET    /api/projects/:projectId/codegen/exports               - List exports
GET    /api/projects/:projectId/codegen/exports/:exportId     - Get export details
POST   /api/projects/:projectId/codegen/exports/:exportId/download - Download
```

### Preview & Rendering
```
GET    /api/preview/:componentId                              - Get component preview
POST   /api/preview/:componentId/screenshot                   - Generate screenshot
GET    /api/preview/iframe/:previewToken                      - Render iframe preview
```

### Tours
```
GET    /api/projects/:projectId/tours                         - List tours
POST   /api/projects/:projectId/tours                         - Create tour
GET    /api/projects/:projectId/tours/:tourId                 - Get tour
PUT    /api/projects/:projectId/tours/:tourId                 - Update tour
DELETE /api/projects/:projectId/tours/:tourId                 - Delete tour
POST   /api/projects/:projectId/tours/:tourId/steps           - Add tour step
PUT    /api/projects/:projectId/tours/:tourId/steps/:stepId   - Update step
GET    /api/users/tour-progress/:tourId                       - Get user progress
POST   /api/users/tour-progress/:tourId/step                  - Update step progress
```

### Assets
```
POST   /api/projects/:projectId/assets/upload                 - Upload asset
GET    /api/projects/:projectId/assets                        - List assets
DELETE /api/projects/:projectId/assets/:assetId               - Delete asset
GET    /api/assets/:assetId                                   - Get asset (CDN)
```

### Figma Integration
```
POST   /api/projects/:projectId/figma/sync                    - Sync from Figma
GET    /api/projects/:projectId/figma/status                  - Get sync status
POST   /api/projects/:projectId/figma/webhook                 - Webhook endpoint
```

### Export & Delivery
```
POST   /api/projects/:projectId/export/npm-package            - Generate npm package
POST   /api/projects/:projectId/export/design-system-website  - Generate doc site
POST   /api/projects/:projectId/export/figma-plugin           - Generate plugin
GET    /api/projects/:projectId/export/download               - Download export
```

---

## 4. Technology Stack Recommendations

### Backend Framework
- **Option 1**: Node.js + Express.js or Fastify
- **Option 2**: Python + FastAPI or Django
- **Option 3**: Go + Gin or Echo

### Database
- **Primary**: PostgreSQL (relational data, JSONB support)
- **Cache**: Redis (sessions, rate limiting, real-time updates)
- **Search**: Elasticsearch (full-text component search)

### Message Queue & Real-time
- **Message Queue**: RabbitMQ or Kafka (async job processing)
- **Real-time**: WebSocket (Socket.io or native) for live tours/previews
- **Job Queue**: Bull (Node.js) or Celery (Python)

### File Storage & CDN
- **Storage**: AWS S3, Google Cloud Storage, or MinIO
- **CDN**: CloudFront, Cloudflare, or Bunny CDN
- **Image Processing**: Sharp (Node.js) or Pillow (Python)

### Code Generation
- **Template Engine**: EJS, Handlebars, or Jinja2
- **AST Tools**: Babel (JavaScript), TypeScript compiler API
- **Code Formatting**: Prettier, ESLint, Autoprefixer

### CSS Generation
- **PostCSS** with plugins
- **Tailwind CSS** (if using utility-first approach)
- **SCSS/LESS** compiler

### External APIs
- **Figma API** (component extraction, design tokens)
- **Analytics**: Segment, Mixpanel (tour completion tracking)

---

## 5. Key Features Implementation

### 5.1 Figma Sync Flow
```
1. User connects Figma account
2. Backend fetches Figma file structure
3. Parse components, extract design tokens
4. Store in database
5. Set up webhook for real-time updates
6. Periodically sync changes (delta sync)
```

### 5.2 CSS Generation Pipeline
```
1. Extract design tokens from database
2. Validate token values
3. Apply transformations (unit conversion, etc.)
4. Generate CSS variables
5. Generate utility classes
6. Minify and optimize
7. Generate documentation
```

### 5.3 Code Generation Pipeline
```
1. Get component metadata
2. Select framework/language
3. Load appropriate template
4. Inject component props/variants
5. Generate prop types
6. Format code with Prettier
7. Create package structure
8. Generate documentation
9. Create download link
```

### 5.4 Tour System Flow
```
1. Creator defines tour steps with CSS selectors
2. Steps stored with highlight bounding boxes
3. Frontend loads tour and attaches to DOM elements
4. User navigates steps (prev/next)
5. Backend tracks progress
6. Analytics captured on completion
```

---

## 6. Scalability Considerations

### Horizontal Scaling
- Stateless API servers (can run multiple instances)
- Separate worker processes for heavy tasks (code gen, rendering)
- Load balancer (NGINX, HAProxy)
- Database read replicas

### Async Processing
- Offload heavy tasks to job queue
- Code generation → background job
- Image processing → background job
- Figma sync → scheduled job

### Caching Strategy
- Cache component metadata (Redis)
- Cache generated CSS (Redis)
- Cache API responses (HTTP caching headers)
- CDN for assets and exports

### Monitoring & Logging
- Centralized logging (ELK stack or DataDog)
- Error tracking (Sentry)
- Performance monitoring (New Relic, Prometheus)
- User analytics

---

## 7. Security Considerations

- **Authentication**: OAuth 2.0 with Figma, JWT for sessions
- **Authorization**: RBAC at endpoint level
- **Data Validation**: Input sanitization, rate limiting
- **API Keys**: Scoped tokens for third-party access
- **Audit Logs**: Track all data modifications
- **Encryption**: TLS for transit, encryption at rest for sensitive data
- **CORS**: Restrict to known frontend origins

---

## 8. Deployment Architecture

```
Frontend (React/SPA)
        ↓
CDN (Static Assets)
        ↓
API Gateway / Load Balancer
        ↓
API Servers (Multiple instances)
        ↓
Job Queue Workers (Background tasks)
        ↓
PostgreSQL (Primary DB)
        ↓
Redis (Cache/Sessions)
        ↓
S3 / Object Storage (Files & Assets)
```

### Environment Setup
- **Dev**: Local services or Docker Compose
- **Staging**: Kubernetes or Docker Swarm
- **Production**: Kubernetes with auto-scaling, CDN, managed DB

---

## 9. Integration Points

1. **Figma API** - Component extraction, design tokens
2. **GitHub API** - Export as repository
3. **NPM Registry** - Publish design system packages
4. **Slack** - Notifications for team collaboration
5. **Datadog/New Relic** - Monitoring and performance
6. **Auth0/Okta** - Enterprise authentication (future)

---

## Implementation Roadmap

### Phase 1 (MVP)
- Authentication with Figma
- Basic project/component management
- Figma sync (read-only)
- CSS generation from design tokens
- Basic preview system

### Phase 2
- Code generation (React components)
- Tour system
- Collaboration features
- Export to npm

### Phase 3
- Multi-framework support (Vue, Angular)
- Advanced code generation (Storybook, tests)
- Design system documentation site generator
- Figma plugin for direct export

### Phase 4
- Enterprise features (SSO, audit logs)
- Advanced analytics
- Version control for design tokens
- AI-powered component naming/documentation
