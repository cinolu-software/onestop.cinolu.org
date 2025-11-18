# Frontend Integration Prompts - Feature by Feature

Quick copy-paste prompts for implementing each feature in your Angular + TailwindCSS + NgRx Signal Store frontend.

---

## 📋 Phase Management

### API Endpoints

```
POST   /phases                              # Create phase
GET    /phases/project/:projectId           # Get project phases
PATCH  /phases/:id                          # Update phase
DELETE /phases/:id                          # Delete phase
```

### TypeScript Interface

```typescript
interface Phase {
  id: string;
  name: string;
  started_at?: Date;
  ended_at?: Date;
  description?: string;
  order: number;
  is_active: boolean;
  project: string;
}
```

### Request Body

```json
{
  "name": "Appel à candidature",
  "started_at": "2025-01-01",
  "ended_at": "2025-03-31",
  "order": 1,
  "is_active": true,
  "project": "project-uuid"
}
```

### UI Components

- **Phase List Card**: `bg-white rounded-lg shadow-md p-6`
- **Active Badge**: `px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold`
- **Inactive Badge**: `px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs`

---

## 📎 Resources (Attachments)

### API Endpoints

```
POST   /resources                           # Create resource with URL
POST   /resources/upload                    # Upload file
GET    /resources/phase/:phaseId            # Get phase resources
DELETE /resources/:id                       # Delete resource
```

### TypeScript Interface

```typescript
interface Resource {
  id: string;
  title?: string;
  type: 'PDF' | 'LINK' | 'IMAGE' | 'OTHER';
  url: string;
  phase?: string;
  project?: string;
}
```

### File Upload (multipart/form-data)

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('title', 'Application Form');
formData.append('phase', 'phase-uuid');
```

### UI Components

- **Upload Zone**: `border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 cursor-pointer`
- **Resource Card**: `flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition`
- **PDF Icon**: `w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600`
- **Link Icon**: `w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600`

---

## 👥 Curator Invitations

### API Endpoints

```
POST   /curators/invite                     # Invite curator
POST   /curators/accept-invite              # Accept invitation (public)
POST   /curators/:id/resend-invite          # Resend invitation
GET    /curators/phase/:phaseId             # Get phase curators
```

### TypeScript Interface

```typescript
interface Curator {
  id: string;
  name?: string;
  email: string;
  is_active: boolean;
  phases?: string[];
}
```

### Invite Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phases": ["phase-uuid-1", "phase-uuid-2"]
}
```

### Accept Invite (from email link)

```json
{
  "token": "invitation-token-from-email"
}
```

### Workflow

1. Admin invites → Email sent with link: `{FRONTEND_URL}/curators/accept-invite?token=...`
2. Curator clicks link → Frontend extracts token from URL
3. Frontend calls `POST /curators/accept-invite` with token
4. Redirect to dashboard

### UI Components

- **Invite Form**: `bg-white rounded-xl shadow-lg p-8 space-y-6`
- **Email Input**: `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500`
- **Phase Checkbox**: `flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg`
- **Success Alert**: `p-4 bg-green-50 border border-green-200 rounded-lg text-green-800`

---

## ⭐ Rating System

### API Endpoints

```
POST   /ratings                                          # Submit rating
GET    /ratings/my-ratings                               # My ratings
GET    /ratings/project/:projectId/phase/:phaseId/average # Get average (public)
GET    /ratings/phase/:phaseId/statistics                # Phase statistics
GET    /ratings/phase/:phaseId/qualified                 # Qualified projects (≥50%)
```

### TypeScript Interface

```typescript
interface ProjectPhaseRating {
  id: string;
  score: number; // 0-100
  comment?: string;
  curator: string;
  project: string;
  phase: string;
}

interface ProjectAverageDto {
  average: number;
  count: number;
  passed: boolean; // ≥50%
  threshold: number;
}

interface PhaseStatisticsDto {
  totalProjects: number;
  ratedProjects: number;
  passedProjects: number;
  failedProjects: number;
  averageScore: number;
}
```

### Submit Rating

```json
{
  "score": 75,
  "comment": "Great project execution",
  "project": "project-uuid",
  "phase": "phase-uuid"
}
```

### Validation Rules

- Score: 0-100 (integer)
- Curator must be active
- Curator must be assigned to phase
- One rating per curator per project per phase

### UI Components

- **Score Slider**: `w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600`
- **Score Display**: `text-5xl font-bold text-gray-900`
- **Score Label (Failed)**: `px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold`
- **Score Label (Passed)**: `px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold`
- **Score Label (Good)**: `px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold`
- **Comment Box**: `w-full px-4 py-3 border rounded-lg min-h-32 focus:ring-2 focus:ring-blue-500`

---

## 📝 Dynamic Form Builder

### API Endpoints

#### Form Fields (Admin)

```
POST   /form-fields                         # Create field
POST   /form-fields/phase/:phaseId/bulk     # Bulk create
GET    /form-fields/phase/:phaseId          # Get phase fields
POST   /form-fields/phase/:phaseId/reorder  # Reorder fields
PATCH  /form-fields/:id                     # Update field
DELETE /form-fields/:id                     # Delete field
```

#### Submissions (User + Admin)

```
POST   /form-submissions                    # Submit application
GET    /form-submissions/my-submissions     # User's submissions
GET    /form-submissions                    # All submissions (admin)
GET    /form-submissions/phase/:phaseId/statistics # Statistics
PATCH  /form-submissions/:id                # Update/Review
```

### TypeScript Interfaces

```typescript
enum FieldType {
  TEXT = 'TEXT',
  EMAIL = 'EMAIL',
  NUMBER = 'NUMBER',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  FILE = 'FILE',
  DATE = 'DATE',
  URL = 'URL',
  PHONE = 'PHONE'
}

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help_text?: string;
  order: number;
  is_required: boolean;
  options?: string[]; // For SELECT, RADIO, CHECKBOX
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    accept?: string[];
  };
  phase: string;
}

enum SubmissionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

interface FormSubmission {
  id: string;
  responses: Record<string, any>;
  status: SubmissionStatus;
  admin_notes?: string;
  phase: Phase;
  user: User;
  project?: Project;
}
```

### Create Form Field Examples

**Text Field:**

```json
{
  "label": "Project Name",
  "type": "TEXT",
  "placeholder": "Enter project name",
  "order": 1,
  "is_required": true,
  "validation": {
    "minLength": 5,
    "maxLength": 100
  },
  "phase": "phase-uuid"
}
```

**Select Field:**

```json
{
  "label": "Project Category",
  "type": "SELECT",
  "options": ["Technology", "Education", "Health", "Agriculture"],
  "order": 2,
  "is_required": true,
  "phase": "phase-uuid"
}
```

**Number Field:**

```json
{
  "label": "Budget (USD)",
  "type": "NUMBER",
  "order": 3,
  "is_required": true,
  "validation": {
    "min": 0,
    "max": 1000000
  },
  "phase": "phase-uuid"
}
```

**File Upload:**

```json
{
  "label": "Project Proposal (PDF)",
  "type": "FILE",
  "order": 4,
  "is_required": true,
  "validation": {
    "accept": ["application/pdf"]
  },
  "phase": "phase-uuid"
}
```

**Bulk Create:**

```json
POST /form-fields/phase/{phaseId}/bulk
[
  { "label": "Project Name", "type": "TEXT", "order": 1, "is_required": true },
  { "label": "Description", "type": "TEXTAREA", "order": 2, "is_required": true },
  { "label": "Budget", "type": "NUMBER", "order": 3, "is_required": true }
]
```

### Submit Application

```json
{
  "phase": "phase-uuid",
  "responses": {
    "field-uuid-1": "My Awesome Project",
    "field-uuid-2": "Detailed description...",
    "field-uuid-3": 50000,
    "field-uuid-4": "Technology"
  }
}
```

### Update Submission (Admin Review)

```json
{
  "status": "APPROVED",
  "admin_notes": "Excellent proposal!",
  "project": "created-project-uuid"
}
```

**Classes:**

- Field Card: `bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4`
- Drag Handle: `cursor-move text-gray-400 hover:text-gray-600`
- Field Type Badge: `px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold`

**Status Badges:**

- DRAFT: `px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs`
- SUBMITTED: `px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs`
- UNDER_REVIEW: `px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs`
- APPROVED: `px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs`
- REJECTED: `px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs`

---

## 🔄 Complete User Flows

### Flow 1: Admin Creates Application Form

```typescript
// Step 1: Create phase
POST /phases
{ "name": "Saison 1", "is_active": true, "project": "uuid" }

// Step 2: Add form fields
POST /form-fields/phase/{phaseId}/bulk
[
  { "label": "Project Name", "type": "TEXT", "order": 1, "is_required": true },
  { "label": "Category", "type": "SELECT", "options": ["Tech", "Health"], "order": 2 },
  { "label": "Budget", "type": "NUMBER", "order": 3 }
]

// Step 3: Activate phase for submissions
PATCH /phases/{phaseId}
{ "is_active": true }
```

### Flow 2: User Submits Application

```typescript
// Step 1: Get phase fields
GET /form-fields/phase/{phaseId}

// Step 2: Fill form and submit
POST /form-submissions
{
  "phase": "phase-uuid",
  "responses": {
    "field-1-id": "My Project",
    "field-2-id": "Tech",
    "field-3-id": 50000
  }
}

// Step 3: Track status
GET /form-submissions/my-submissions
```

### Flow 3: Admin Reviews Submission

```typescript
// Step 1: View submissions
GET /form-submissions?phase={phaseId}&status=SUBMITTED

// Step 2: Review submission
GET /form-submissions/{id}

// Step 3: Approve/Reject
PATCH /form-submissions/{id}
{
  "status": "APPROVED",
  "admin_notes": "Great proposal!"
}
```

---

## 📌 Key Integration Points

### Authentication

All endpoints require `Authorization: Bearer <token>` except:

- `POST /curators/accept-invite` (public)
- `GET /ratings/project/:projectId/phase/:phaseId/average` (public)

### Error Handling

```typescript
{
  "statusCode": 400,
  "message": "Field 'Project Name' is required",
  "error": "Bad Request"
}
```

### Pagination

```typescript
GET /form-submissions?page=1  // 50 items per page
```
