# Frontend-Backend Integration Guide

## Architecture Overview

```
┌─────────────────────────────────────┐
│     Frontend (React/SPA)            │
│  (Your Figma Design App Prototype)  │
└────────────┬────────────────────────┘
             │ HTTP/WebSocket
             ↓
┌─────────────────────────────────────┐
│    Backend API Gateway (Node.js)    │
│  - Authentication                   │
│  - Request validation               │
│  - Rate limiting                    │
│  - WebSocket handler                │
└────────────┬────────────────────────┘
             │
     ┌───────┼───────┬────────────┐
     ↓       ↓       ↓            ↓
  ┌────┐ ┌────┐ ┌───────┐ ┌─────────┐
  │ DB │ │Cach│ │ Queue │ │ Figma   │
  │ PG │ │Redi│ │ Bull  │ │ API     │
  └────┘ └────┘ │       │ └─────────┘
            │   └───────┘
            │
        ┌─────────┐
        │ S3/CDN  │
        │ Storage │
        └─────────┘
```

---

## Component Communication

### 1. Authentication Flow

```
┌─────────────┐
│   Frontend  │
│ "Login with │
│   Figma"    │
└──────┬──────┘
       │ GET /api/auth/figma-login
       ↓
┌──────────────────┐
│ Backend Server   │ 
│ Redirects to     │
│ Figma OAuth      │
└──────┬───────────┘
       │ User authorizes
       ↓
┌──────────────────────┐
│ Figma redirects back │
│ /api/auth/callback   │
└──────┬───────────────┘
       │
       ↓
┌──────────────────┐
│ Backend validates│
│ Creates JWT      │
│ Returns token    │
└──────┬───────────┘
       │ JWT + Refresh Token
       ↓
┌─────────────┐
│   Frontend  │
│ Stores JWT  │
│ in localStorage
└─────────────┘
```

### 2. Project Data Flow

```
Frontend                          Backend
┌───────────────┐
│ User clicks   │
│ "New Project" │
└───────┬───────┘
        │ POST /api/projects
        │ { name, figmaFileId }
        ├──────────────────────→ ┌─────────────┐
                                 │ Validate    │
                                 │ Auth        │
                                 └──────┬──────┘
                                        │
                                        ↓
                                 ┌────────────────┐
                                 │ Parse Figma    │
                                 │ Extract tokens │
                                 │ Components     │
                                 └──────┬─────────┘
                                        │
                                        ↓
                                 ┌─────────────┐
                                 │ Save to DB  │
                                 └──────┬──────┘
                                        │
        ┌───────────────────────────────┘
        │ { projectId, components, tokens }
        ↓
┌─────────────────┐
│ Frontend updates│
│ UI with project │
│ components      │
└─────────────────┘
```

### 3. Real-time Collaboration with WebSocket

```
┌──────────┐
│ Frontend │ (Room: project-123)
│ User A   │
└─────┬────┘
      │ WebSocket: connect()
      ├──────→ ┌─────────┐
               │ Server  │
               │         │
      ┌────────┤ Join    │
      │        │ Rooms   │
      ↓        └────┬────┘
┌──────────┐        │
│ Frontend │        │
│ User B   │ ←──────┤ Broadcast updates
└─────┬────┘        │
      │ component-  ├──→ All users in room get
      │ updated     │    real-time updates
      ↓
┌─────────────────┐
│ User A & B see  │
│ real-time sync  │
└─────────────────┘
```

---

## Data Models & API Contracts

### Project Model
```json
{
  "id": "uuid",
  "name": "My Design System",
  "description": "...",
  "ownerId": "uuid",
  "figmaFileId": "figma-file-id",
  "components": [...],
  "designTokens": [...],
  "createdAt": "2026-05-08T...",
  "updatedAt": "2026-05-08T..."
}
```

### Component Model
```json
{
  "id": "uuid",
  "projectId": "uuid",
  "name": "Button",
  "figmaNodeId": "figma-node-id",
  "props": {
    "variant": {
      "type": "VARIANT",
      "options": ["primary", "secondary", "danger"]
    },
    "size": {
      "type": "VARIANT",
      "options": ["small", "medium", "large"]
    },
    "disabled": {
      "type": "BOOLEAN"
    }
  },
  "variants": [
    {
      "id": "uuid",
      "name": "primary-small",
      "props": { "variant": "primary", "size": "small" },
      "css": "..."
    }
  ]
}
```

### Design Token Model
```json
{
  "id": "uuid",
  "projectId": "uuid",
  "category": "color",
  "name": "Primary Blue",
  "value": "#1E90FF",
  "description": "Primary brand color"
}
```

---

## API Usage Examples

### Frontend Setup (JavaScript)

```javascript
// src/api/client.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
```

### Login
```javascript
// src/hooks/useAuth.js
export const useLogin = () => {
  const navigate = useNavigate();
  
  const handleFigmaLogin = async () => {
    try {
      // Get login URL from backend
      const response = await client.get('/auth/figma-login');
      // Redirect to Figma OAuth
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return { handleFigmaLogin };
};
```

### Fetch Projects
```javascript
// src/hooks/useProjects.js
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await client.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  return { projects, loading };
};
```

### Generate CSS
```javascript
// src/services/cssGenerator.js
export const generateCSS = async (projectId) => {
  try {
    const response = await client.post(`/css/${projectId}/generate`, {
      format: 'css',
      includeUtilities: true
    });
    
    return response.data.css;
  } catch (error) {
    console.error('CSS generation failed:', error);
    throw error;
  }
};
```

### Generate Code
```javascript
// src/services/codeGenerator.js
export const generateComponentCode = async (projectId, framework = 'react') => {
  try {
    const response = await client.post(`/codegen/${projectId}/generate`, {
      framework,
      language: 'typescript',
      includeStories: true
    });
    
    return response.data.exportId;
  } catch (error) {
    console.error('Code generation failed:', error);
    throw error;
  }
};

// Poll for completion
export const checkExportStatus = async (projectId, exportId) => {
  try {
    const response = await client.get(`/codegen/${projectId}/exports/${exportId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to check status:', error);
    throw error;
  }
};
```

### Real-time Updates with Socket.IO
```javascript
// src/hooks/useProjectSocket.js
import io from 'socket.io-client';

export const useProjectSocket = (projectId) => {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL, {
      auth: {
        token: localStorage.getItem('jwtToken')
      }
    });
    
    newSocket.on('connect', () => {
      console.log('Connected to backend');
      newSocket.emit('join-project', projectId);
    });
    
    newSocket.on('component-updated', (data) => {
      console.log('Component updated:', data);
      // Update UI
    });
    
    newSocket.on('css-generated', (data) => {
      console.log('CSS ready:', data);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, [projectId]);
  
  return socket;
};
```

---

## Workflow: Complete Feature Implementation

### Scenario: Add New Component to Design System

#### Frontend
```javascript
// User adds component in Figma, clicks "Sync"
const syncFromFigma = async (projectId) => {
  setLoading(true);
  try {
    const response = await client.post(`/figma/${projectId}/sync`);
    setComponents(response.data.components);
    showNotification('Design system synced!');
  } catch (error) {
    showError('Sync failed');
  } finally {
    setLoading(false);
  }
};
```

#### Backend - Figma Sync Route
```javascript
router.post('/:projectId/sync', async (req, res) => {
  // 1. Get Figma file
  const figmaClient = new FigmaClient(req.user.figmaToken);
  const fileData = await figmaClient.getFileStructure(project.figmaFileId);
  
  // 2. Parse components and tokens
  const components = parseComponents(fileData);
  const tokens = extractDesignTokens(fileData, variables);
  
  // 3. Store in database
  for (const component of components) {
    await db.query('INSERT INTO components ...');
  }
  
  // 4. Broadcast to connected users
  req.app.io.to(`project-${projectId}`).emit('sync-complete', {
    components,
    tokens
  });
  
  res.json({ components, tokens });
});
```

#### Frontend - Real-time Update
```javascript
socket.on('sync-complete', ({ components, tokens }) => {
  setComponents(components);
  setDesignTokens(tokens);
  // Update preview
  generateAndShowPreview();
});
```

---

## Error Handling

### Frontend Error Handler
```javascript
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, refresh
      refreshToken();
    } else if (error.response?.status === 403) {
      // Permission denied
      showError('You don\'t have permission');
    } else if (error.response?.status >= 500) {
      // Server error
      showError('Server error, please try again');
    }
    
    return Promise.reject(error);
  }
);
```

### Backend Error Codes
- `400` - Validation error
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `409` - Conflict (duplicate entry, etc.)
- `429` - Rate limited
- `500` - Server error

---

## Performance Considerations

### Frontend Optimizations
- Lazy load component previews
- Cache API responses
- Debounce search/filter inputs
- Use React.memo for preview cards
- Implement virtual scrolling for large lists

### Backend Optimizations
- Add database indexes on `projectId`, `componentId`
- Cache Figma data (30min TTL)
- Paginate API responses
- Compress responses with gzip
- Use connection pooling (already configured)

---

## Testing the Integration

### Manual Testing Checklist

- [ ] User can login with Figma
- [ ] Projects load correctly
- [ ] Figma sync fetches components
- [ ] CSS generation works
- [ ] Code generation creates files
- [ ] Real-time updates work (multiple tabs)
- [ ] Tours display correctly
- [ ] Export/download functionality works
- [ ] Error handling shows proper messages
- [ ] Rate limiting works

### Automated Testing

```javascript
// __tests__/integration.test.js
describe('Backend Integration', () => {
  it('should login user and get token', async () => {
    const response = await client.post('/auth/login', credentials);
    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
  });
  
  it('should fetch projects for authenticated user', async () => {
    const response = await client.get('/projects');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
  
  it('should generate CSS from tokens', async () => {
    const response = await client.post(`/css/${projectId}/generate`);
    expect(response.status).toBe(200);
    expect(response.data.css).toBeDefined();
  });
});
```

---

## Deployment Checklist

Before deploying to production:

Frontend:
- [ ] Set correct API_URL
- [ ] Remove console.logs
- [ ] Configure error reporting (Sentry)
- [ ] Set up analytics
- [ ] Test with production backend

Backend:
- [ ] Set NODE_ENV=production
- [ ] Configure HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure CDN for assets
- [ ] Set up monitoring (Datadog/New Relic)
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up CI/CD pipeline

---

## Debugging Tips

### Check Backend Logs
```bash
# Follow logs
tail -f logs/app.log

# Search for errors
grep ERROR logs/app.log

# View with timestamps
grep "ERROR" logs/app.log | tail -20
```

### Database Queries
```sql
-- Check if project exists
SELECT * FROM projects WHERE id = 'project-id';

-- Check components
SELECT * FROM components WHERE "projectId" = 'project-id';

-- Check recent errors
SELECT * FROM audit_logs WHERE "createdAt" > NOW() - INTERVAL '1 hour' AND action = 'error';
```

### Network Debugging
```javascript
// In browser console
fetch('http://localhost:3000/api/projects', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## Support & Resources

- Backend README: See `backend-starter/README.md`
- Architecture Doc: See `BACKEND_ARCHITECTURE.md`
- Figma API: https://www.figma.com/developers/api
- Socket.IO: https://socket.io/docs/
- Express: https://expressjs.com/

---

**Version:** 1.0.0  
**Last Updated:** May 2026
