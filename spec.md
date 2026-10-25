# AI MYSTERY ROOM — MASTER PRODUCT SPECIFICATION

**Document:** SPEC.md
**Version:** 1.0.0
**Status:** Approved for MVP development
**Product name:** AI Mystery Room
**Product type:** AI-powered interactive mystery investigation web application
**Architecture:** MERN Stack
**AI provider:** Google Gemini
**Primary audience:** Users who enjoy detective stories, puzzles, logical reasoning, and interactive investigations.

---

# 1. SINGLE SOURCE OF TRUTH

This document defines the authoritative requirements for AI Mystery Room.

Codex MUST use this specification as the source of truth when implementing, modifying, testing, or extending the application.

## 1.1 Development rules

1. Read this entire specification before writing code.
2. Follow the defined architecture, routes, API contracts, data models, and acceptance criteria.
3. Do not introduce unnecessary frameworks, libraries, services, or features.
4. Do not replace MongoDB, Express, React, Node.js, or Gemini without explicit approval.
5. Keep secrets and API keys exclusively on the backend.
6. All investigation evidence, suspects, clues, and the correct culprit must belong to one internally consistent mystery.
7. Never expose the culprit or hidden solution to the frontend before the user submits a final accusation.
8. Never trust AI-generated JSON until it has been parsed, validated, and checked for consistency.
9. Never fabricate successful API responses, database operations, or AI-generation results.
10. Build in small, verifiable phases. Run available tests after each phase.
11. Use reusable components, clear naming, and maintainable code.
12. If a requirement is ambiguous, follow the defaults in this document and record the decision in the project documentation instead of silently inventing major functionality.

## 1.2 Requirement priorities

- **P0:** Required for the MVP to function correctly.
- **P1:** Important improvement after the core MVP.
- **P2:** Optional future enhancement.

P0 requirements must be completed before the application is considered MVP-complete.

---

# 2. PRODUCT OVERVIEW

## 2.1 Product vision

AI Mystery Room is an interactive detective experience in which a user supplies a short scenario, story idea, or mystery premise.

The application uses Google Gemini on the backend to transform the premise into an original fictional investigation.

The generated investigation contains:

- A fictional crime or mystery.
- A cast of suspects.
- Suspect profiles and possible motives.
- A coherent investigation timeline.
- AI-generated evidence, such as fictional chat messages, images, witness statements, and surveillance-style footage.
- Clues, contradictions, and red herrings.
- One predetermined correct culprit.
- A final accusation and a solution explanation.

The user examines the evidence, develops a theory, and selects the person they believe is responsible.

The application then reveals the result and explains how the evidence supports the answer.

## 2.2 Core user journey

1. User opens the website.
2. User selects **Create a Mystery**.
3. User enters a short story or scenario.
4. User chooses optional settings such as difficulty and mystery genre.
5. The backend sends a structured generation request to Gemini.
6. The application validates the generated mystery and its evidence.
7. A playable mystery room is created and stored in MongoDB.
8. The user enters the investigation workspace.
9. The user reviews suspects, evidence, the timeline, and relevant clues.
10. The user selects a suspect as the culprit.
11. The user confirms the accusation.
12. The backend evaluates the submitted suspect against the hidden answer.
13. The application reveals the outcome and an evidence-based explanation.
14. The user can return to the dashboard or create another mystery.

## 2.3 Product principles

- Every mystery must have exactly one canonical culprit.
- Every mystery must be solvable using the evidence provided.
- Evidence must be consistent with the underlying solution.
- The user should be able to distinguish evidence from speculation.
- AI generation should produce structured, validated data rather than unstructured text alone.
- Investigations must remain playable even if optional media generation fails.
- The product must clearly identify all cases and evidence as fictional.

---

# 3. MVP SCOPE

## 3.1 Included in the MVP — P0

- Responsive landing page.
- Mystery creation form.
- Story premise input.
- Mystery genre and difficulty selection.
- Gemini-powered mystery generation.
- Fictional suspect profiles.
- AI-generated investigation evidence.
- Evidence gallery and detail viewer.
- Investigation timeline.
- Suspect selection and accusation flow.
- Backend-only answer evaluation.
- Solution and explanation screen.
- Loading, error, empty, and retry states.
- MongoDB persistence.
- Basic mystery history for the current browser session or anonymous user.
- Server-side validation.
- Secure Gemini API-key handling.
- Setup documentation and environment-variable template.
- Automated tests for important backend and game logic.

## 3.2 Excluded from the initial MVP

Unless explicitly requested later, do not implement:

- Real criminal investigations or real-world case lookup.
- Real WhatsApp account integration.
- Real CCTV integrations.
- Uploading and analyzing arbitrary user videos.
- Live multiplayer investigations.
- Public community mystery sharing.
- Payments, subscriptions, or advertisements.
- Complex user profiles, social login, or role-based administration.
- Voice conversations with suspects.
- Real-time collaborative gameplay.
- A full AI-generated cinematic video pipeline.
- Unnecessary blockchain or Web3 functionality.

## 3.3 Anonymous access

The MVP should not require registration.

A user can create and play a mystery without signing in.

Store a random anonymous session identifier in a secure, appropriately configured cookie where practical. Use that identifier to authorize access to the user's mysteries.

Do not treat a MongoDB document ID alone as authorization.

A mystery history feature should only return mysteries accessible to the current session.

---

# 4. TECHNOLOGY STACK

## 4.1 Frontend

- React
- Vite
- JavaScript with JSX
- React Router
- CSS Modules or a consistent plain CSS architecture
- Fetch API for backend communication
- Lucide React for interface icons, if needed

Use a consistent component structure and avoid mixing unrelated styling approaches.

Do not add Redux, a large UI framework, or a state-management library unless the project demonstrates a real need.

## 4.2 Backend

- Node.js
- Express.js
- JavaScript ES modules
- MongoDB
- Mongoose
- Official Google Gen AI SDK for Gemini
- Zod or an equivalent schema-validation library
- A suitable security middleware such as Helmet
- A suitable rate-limiting middleware

Use supported, mutually compatible package versions and commit the package lockfile.

## 4.3 AI

Primary provider: Google Gemini.

The backend must:

- Read the API key from GEMINI_API_KEY.
- Read the selected model from GEMINI_MODEL.
- Request structured mystery data.
- Validate the response.
- Handle malformed output and provider failures.
- Enforce generation limits.
- Keep the answer key private.
- Avoid assuming that a text model can generate every type of media.

Use a model that supports the required structured-output capabilities in the configured Gemini API.

## 4.4 Optional media generation

Create a provider abstraction for evidence media.

Possible providers include a supported Gemini image-generation model or another explicitly configured image-generation service.

Do not assume the selected text-generation model can generate images or video.

For the MVP:

- Generate fictional text evidence directly.
- Generate image evidence only when a suitable configured provider is available.
- Render surveillance-style footage using a generated sequence, a series of still images, or a clearly labeled fictional video placeholder.
- If real video generation is unavailable, do not claim that a genuine video was generated.
- Allow the investigation to remain playable without optional generated media.

The core application must not depend on successful video generation.

## 4.5 Database

MongoDB stores mystery records, suspects, evidence, investigation metadata, and the private answer key.

The frontend must never connect directly to MongoDB.

## 4.6 Repository structure

Use a monorepo with separate frontend and backend applications.

```
ai-mystery-room/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   ├── mystery/
│   │   │   └── media/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── tests/
├── .gitignore
├── .env.example
├── package.json
├── README.md
└── SPEC.md
```

This is the preferred starting structure. Minor structural adjustments are acceptable if the architecture and separation of responsibilities remain intact.

---

# 5. USER INTERFACE AND EXPERIENCE

## 5.1 Design direction

The application should feel like a premium digital detective workspace.

Visual direction:

- Dark, cinematic interface.
- Charcoal or near-black backgrounds.
- Restrained red accents for alerts and important clues.
- Muted neutral text.
- Clear typography and readable evidence cards.
- Subtle borders and restrained shadows.
- Smooth but minimal transitions.
- Evidence cards inspired by detective case files.
- A clean layout that prioritizes investigation rather than decoration.

Avoid excessive glowing effects, cluttered dashboards, constant animations, and illegible text.

Provide readable contrast and visible keyboard-focus states.

## 5.2 Landing page

Route: `/`

Required elements:

1. Navigation bar with product logo and links.
2. Hero section explaining the product.
3. Main heading: "Every Mystery Has a Story. Every Story Leaves Clues."
4. Short supporting description.
5. Primary CTA: "Create a Mystery".
6. Secondary CTA: "How It Works".
7. Feature section explaining AI-generated cases, evidence, and deduction.
8. Three-step explanation of the investigation process.
9. Example evidence preview using fictional demo data.
10. Footer with product information and fictional-content disclaimer.

The primary CTA navigates to `/create`.

The page must work on mobile and desktop.

## 5.3 Mystery creation page

Route: `/create`

Required fields:

### Story premise

- Required textarea.
- Minimum: 30 characters.
- Maximum: 2,000 characters.
- Show a live character counter.
- Trim surrounding whitespace.
- Explain that the input should describe a fictional mystery idea.

Placeholder:

"An expensive necklace disappears during a private dinner. Five guests had access to the room, and one of them is hiding something..."

### Genre

Options:

- Murder Mystery — fictional and non-graphic.
- Theft.
- Missing Object.
- Corporate Espionage.
- Digital Mystery.
- General Detective Mystery.

Default: General Detective Mystery.

### Difficulty

Options:

- Easy.
- Medium.
- Hard.

Default: Medium.

### Evidence preference

Optional multi-select:

- Chat messages.
- Photographs.
- Witness statements.
- Timeline and access logs.
- Surveillance-style evidence.
- Documents and receipts.

The backend may generate equivalent evidence if a requested optional media type is unavailable. The user must still receive enough usable clues to solve the mystery.

### Generate button

Text: "Generate Mystery"

Behavior:

- Disabled while submission is in progress.
- Validates the form.
- Displays loading feedback.
- Prevents duplicate submissions.
- Shows actionable errors.
- Navigates to the new investigation after successful creation.

Do not clear the story premise when a request fails.

## 5.4 Investigation workspace

Route: `/mystery/:id`

This is the primary gameplay screen.

### Desktop layout

Use a three-column layout when space permits:

1. Left sidebar: case summary and suspects.
2. Main content: evidence viewer and investigation workspace.
3. Right sidebar: timeline and investigation tools.

On smaller screens, collapse sidebars into tabs, drawers, or stacked sections.

### Header

Display:

- Case title.
- Case ID or short identifier.
- Genre.
- Difficulty.
- Investigation status.
- Button to return to the dashboard.

Never display the correct culprit in the header.

### Case summary

Show:

- Scenario summary.
- Incident date and location within the fictional world.
- Incident type.
- Key investigation question.

### Suspect panel

Each suspect card displays:

- Fictional portrait or neutral avatar.
- Name.
- Relationship to the incident.
- Short background.
- Stated motive or possible motive.
- Alibi summary, if available.

Do not reveal the hidden solution in suspect descriptions.

### Evidence panel

Display evidence as cards with:

- Evidence type.
- Evidence title.
- Short description.
- Source or origin.
- Fictional timestamp where relevant.
- Optional generated image or media preview.
- Button to open full evidence details.
- Optional clue significance label.

The significance label should not immediately reveal the solution. Use labels such as "Potentially Relevant" rather than explicitly identifying the culprit.

### Investigation timeline

Show significant events in chronological order.

Each event should contain:

- Timestamp or time interval.
- Event description.
- Relevant suspect or location where applicable.
- Links to related evidence.

### Final accusation panel

Include:

- A list of suspects.
- Exactly one selected suspect at a time.
- A required confirmation step.
- A final submit button.

Button text: "Submit Accusation"

The user should be able to review the case before submitting.

### Submission behavior

The first submitted accusation is final for that attempt.

After submission:

- Disable additional accusations for the same completed attempt.
- Display the result.
- Reveal the correct culprit.
- Explain the decisive evidence.
- Identify important contradictions and red herrings.
- Provide a "Create Another Mystery" button.

The MVP should not silently allow unlimited answer changes.

## 5.5 Result page

Route: `/mystery/:id/result`

Display:

- Correct or incorrect outcome.
- The selected suspect.
- The correct culprit.
- A concise narrative of what happened.
- Explanation of decisive clues.
- Timeline reconstruction.
- Explanation of significant red herrings.
- Optional score or difficulty feedback.
- Button to start another mystery.

The result endpoint must enforce the same authorization rules as the investigation endpoint.

A result must only be available after the server has accepted an accusation.

## 5.6 Loading and error states

Create explicit UI states for:

- Generating a mystery.
- Loading an existing mystery.
- Generating optional evidence media.
- Submitting an accusation.
- Invalid mystery ID.
- Mystery not found.
- Unauthorized mystery access.
- Network failure.
- Gemini rate limit.
- Gemini timeout.
- Invalid AI output.
- Database failure.
- Optional media generation failure.

Do not display raw stack traces, secrets, provider error bodies, or internal answer-key data.

---

# 6. MYSTERY GENERATION ENGINE

## 6.1 Generation requirements

The backend must create a complete mystery before making it playable.

A mystery must contain:

- A title and premise.
- A consistent fictional setting.
- An incident description.
- Three to six suspects.
- One unique culprit.
- Suspect motives, backgrounds, and alibis.
- A canonical event timeline.
- At least six evidence items.
- At least three meaningful clues.
- At least one plausible red herring.
- A complete solution.
- An explanation linking evidence to the culprit.

The mystery must be solvable without external knowledge.

## 6.2 Difficulty rules

### Easy

- Three suspects are preferred.
- At least three clearly interpretable clues.
- Limited ambiguity.
- Timeline contradictions are relatively obvious.

### Medium

- Four or five suspects are preferred.
- Several connected clues.
- At least one plausible red herring.
- The user must combine multiple pieces of evidence.

### Hard

- Five or six suspects are preferred.
- More indirect clues.
- Multiple overlapping motives.
- At least two evidence connections are required to identify the culprit confidently.
- The solution must still be logically supported rather than arbitrary.

Difficulty must change the reasoning complexity, not make the evidence incomplete or contradictory.

## 6.3 Canonical mystery construction

Generate a structured case with one internal truth.

The backend should use a multi-stage process where appropriate:

1. Generate the canonical incident, suspects, culprit, and timeline.
2. Generate evidence from the established truth.
3. Validate evidence against the timeline and suspect data.
4. Validate the solution and clue coverage.
5. Retry generation or repair invalid output within a bounded limit.
6. Save the validated case.

A single structured-generation request may be used for an initial implementation, but the validation requirements still apply.

Do not independently generate each evidence item without providing the established canonical facts.

## 6.4 Evidence consistency

Every evidence item must be linked to the mystery's internal truth.

For each item, store:

- What the evidence visibly or textually contains.
- Which suspects or events it relates to.
- Whether it is direct, indirect, misleading, or contextual.
- Why it matters to the solution.
- Whether it contains a contradiction.
- Which canonical facts it supports or challenges.

Do not generate an image of a suspect doing something that contradicts the canonical timeline unless that discrepancy is intentional and explained.

## 6.5 Clue solvability

Before saving a mystery, validate:

- The correct culprit exists in the suspect list.
- The correct culprit is unique.
- At least three meaningful clues exist.
- The explanation references evidence IDs that actually exist.
- The evidence supports the solution.
- No mandatory clue is missing.
- No two incompatible canonical facts remain unresolved.
- Red herrings can be explained without inventing new facts after the accusation.
- The explanation does not depend on facts unavailable to the player.

Use deterministic rule-based checks where possible. An optional second Gemini call may review logical consistency, but it must not replace deterministic validation.

If the case remains invalid after a limited number of attempts, return a controlled error or use a known-valid fictional demo case.

Never silently store an invalid mystery.

---

# 7. GEMINI INTEGRATION

## 7.1 Architecture

Create an AI provider service:

`server/src/services/ai/geminiService.js`

Create a mystery-generation service:

`server/src/services/mystery/mysteryGenerationService.js`

Create a validation service:

`server/src/services/mystery/mysteryValidationService.js`

Keep provider-specific calls separate from application logic.

## 7.2 Environment variables

Use the following configuration:

```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=
GEMINI_API_KEY=
GEMINI_MODEL=
SESSION_SECRET=
COOKIE_SECURE=false
MAX_MYSTERIES_PER_HOUR=5
```

Values are examples for local development, not production credentials.

Document any additional variables required by the selected media provider.

Never commit real secrets.

The model name must be configured and verified against the selected Google Gen AI SDK and API.

## 7.3 Structured generation

Ask Gemini to return JSON matching a defined schema.

Use the SDK's supported structured-output or JSON-response functionality where available.

Validate the returned data using the application's schema validator.

Reject:

- Missing required properties.
- Unknown suspect IDs in evidence.
- Duplicate IDs.
- Invalid timestamps.
- An absent or ambiguous culprit.
- Incorrect evidence references.
- Excessive array sizes.
- Unexpected data types.
- Unsupported or malformed media references.

Never trust a JSON response merely because it parses successfully.

## 7.4 Recommended generation instructions

The backend generation prompt must instruct Gemini to:

- Create a completely fictional investigation.
- Follow the supplied story premise, genre, and difficulty.
- Establish exactly one culprit.
- Maintain one consistent canonical timeline.
- Create suspects with plausible motives and alibis.
- Ensure every suspect has a reason to be investigated.
- Create evidence that follows from the canonical facts.
- Include meaningful clues and explainable red herrings.
- Ensure the culprit can be identified from the supplied evidence.
- Avoid relying on stereotypes or protected characteristics as evidence of guilt.
- Avoid real private personal data.
- Avoid presenting fabricated evidence as genuine real-world evidence.
- Return only the required structured data.
- Avoid revealing the answer in player-visible content.

## 7.5 Secret answer separation

The frontend must never receive:

- The correct suspect ID before accusation.
- The hidden solution narrative.
- Private canonical facts that disclose the culprit.
- Internal clue-to-answer mappings.
- Hidden generation prompts.
- Internal validation notes.

Store public gameplay data and private answer data separately in the application architecture.

The server should construct explicit public response objects rather than serializing complete database documents.

## 7.6 Failure handling

Use bounded retries for malformed or logically invalid AI output.

Implement:

- Request timeout.
- Limited retries.
- Retry delays where appropriate.
- Input size limits.
- Rate limits.
- Safe error messages.
- Logging without API keys or sensitive user content.

Do not retry indefinitely.

Do not make the entire application unavailable when optional image generation fails.

---

# 8. DATABASE DESIGN

Use Mongoose models with timestamps.

All IDs shown in public evidence references should be stable identifiers generated by the application or validated from the model output.

## 8.1 Mystery model

Collection: `mysteries`

Suggested schema:

```
{
  _id: ObjectId,
  ownerSessionId: String,
  title: String,
  premise: String,
  genre: String,
  difficulty: String,
  status: String,
  incident: {
    description: String,
    location: String,
    occurredAt: Date
  },
  suspects: [
    {
      id: String,
      name: String,
      role: String,
      background: String,
      motive: String,
      publicAlibi: String,
      portraitMediaId: String
    }
  ],
  timeline: [
    {
      id: String,
      timestamp: Date,
      description: String,
      suspectIds: [String],
      evidenceIds: [String]
    }
  ],
  evidence: [
    {
      id: String,
      type: String,
      title: String,
      description: String,
      source: String,
      occurredAt: Date,
      relatedSuspectIds: [String],
      media: {
        kind: String,
        status: String,
        url: String
      }
    }
  ],
  privateSolution: {
    culpritSuspectId: String,
    narrative: String,
    decisiveEvidenceIds: [String],
    redHerringExplanations: [
      {
        evidenceId: String,
        explanation: String
      }
    ]
  },
  generationMetadata: {
    model: String,
    promptVersion: String,
    generationStatus: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

This is a conceptual schema. Implement nested Mongoose schemas with explicit validation rather than accepting arbitrary nested objects.

## 8.2 Attempt model

Collection: `attempts`

Suggested schema:

```
{
  _id: ObjectId,
  mysteryId: ObjectId,
  ownerSessionId: String,
  selectedSuspectId: String,
  isCorrect: Boolean,
  status: String,
  submittedAt: Date,
  resultSummary: String
}
```

The attempt must reference a valid suspect in the corresponding mystery.

The private culprit ID must not be copied into an attempt response before the submission is accepted.

## 8.3 Evidence media storage

Store media metadata and URLs in MongoDB.

Do not store large binary image or video files directly in mystery documents.

For the MVP, generated media can be served from a configured local development directory or a supported object-storage provider.

Local filesystem media storage is suitable for development but should not be treated as durable production storage on ephemeral hosting.

Only serve trusted, generated media references.

## 8.4 Database indexes

Create appropriate indexes for:

- Mystery owner and creation date.
- Attempt mystery ID and submission date.
- Any unique identifiers required by the implementation.

Add indexes based on actual query patterns.

## 8.5 Data lifecycle

Document a retention policy for anonymous-session data.

Expired or abandoned mysteries should not accumulate indefinitely in production.

Do not expose other users' mysteries through unscoped database queries.

---

# 9. BACKEND API CONTRACT

Base path: `/api`

All responses must use consistent JSON formatting.

Successful response:

```
{
  "success": true,
  "data": {}
}
```

Error response:

```
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The supplied data is invalid."
  }
}
```

Never include stack traces, provider secrets, private solutions, or database internals in public errors.

## 9.1 Health check

`GET /api/health`

Purpose: Verify that the server is running.

Example response:

```
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

Do not expose credentials or sensitive infrastructure information.

## 9.2 Create mystery

`POST /api/mysteries`

Request:

```
{
  "premise": "A valuable necklace disappears during a private dinner.",
  "genre": "THEFT",
  "difficulty": "MEDIUM",
  "evidencePreferences": [
    "CHAT_MESSAGES",
    "PHOTOGRAPHS",
    "WITNESS_STATEMENTS"
  ]
}
```

The example premise is illustrative. Production validation should enforce the documented character limits.

Server behavior:

1. Validate the request.
2. Resolve or create the anonymous session.
3. Apply rate limits.
4. Generate the mystery.
5. Validate the structured output.
6. Save the mystery.
7. Return only public mystery data.

Success status: `201 Created`.

Response:

```
{
  "success": true,
  "data": {
    "mystery": {
      "id": "example-id",
      "title": "The Missing Necklace",
      "genre": "THEFT",
      "difficulty": "MEDIUM",
      "status": "READY"
    }
  }
}
```

The actual response must contain a valid identifier and must not disclose the private solution.

If generation fails, return an appropriate error and do not create a playable invalid record.

## 9.3 List mysteries

`GET /api/mysteries`

Return only mysteries authorized for the current anonymous session.

Support pagination.

Example query:

`GET /api/mysteries?page=1&limit=10`

Never return all users' mysteries.

## 9.4 Get mystery

`GET /api/mysteries/:id`

Return:

- Public case details.
- Public suspects.
- Public timeline.
- Public evidence.
- Current attempt or gameplay status, if applicable.

Never return `privateSolution` before the answer-submission workflow permits it.

Return `404` for nonexistent or inaccessible mysteries where appropriate.

## 9.5 Submit accusation

`POST /api/mysteries/:id/accusations`

Request:

```
{
  "suspectId": "suspect-03"
}
```

Server behavior:

1. Verify session ownership.
2. Verify that the mystery is ready and playable.
3. Verify that the suspect exists.
4. Check whether the current attempt has already been submitted.
5. Compare the selected suspect against the private culprit ID.
6. Persist the completed attempt.
7. Return the outcome and authorized solution details.

Example response:

```
{
  "success": true,
  "data": {
    "attempt": {
      "isCorrect": false,
      "selectedSuspectId": "suspect-03"
    },
    "solution": {
      "culpritSuspectId": "suspect-02",
      "narrative": "The evidence reveals how the incident occurred.",
      "decisiveEvidenceIds": ["evidence-01", "evidence-04"]
    }
  }
}
```

This is an illustrative response only. Real IDs and explanations must come from the stored mystery.

The correct answer may be included only after a valid final accusation.

## 9.6 Get result

`GET /api/mysteries/:id/result`

Return the completed attempt and solution only if the current session has an authorized completed attempt.

Do not let a user bypass accusation submission simply by requesting the result URL.

## 9.7 Error codes

Implement consistent handling for:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `NOT_FOUND`
- `RATE_LIMITED`
- `GENERATION_FAILED`
- `INVALID_AI_OUTPUT`
- `MYSTERY_NOT_READY`
- `ATTEMPT_ALREADY_SUBMITTED`
- `INVALID_SUSPECT`
- `INTERNAL_SERVER_ERROR`

Use appropriate HTTP status codes.

---

# 10. SECURITY AND PRIVACY

Security is a P0 requirement.

## 10.1 API key protection

- Store Gemini credentials on the backend.
- Never prefix backend secrets with `VITE_`.
- Never return credentials in API responses.
- Never commit `.env` files.
- Provide `.env.example` with empty placeholders.
- Redact secrets from logs.

## 10.2 Input validation

Validate all client inputs on the server.

Enforce:

- Story premise length.
- Valid genre values.
- Valid difficulty values.
- Allowed evidence preferences.
- Valid MongoDB IDs.
- Valid suspect IDs.
- Maximum request size.
- Expected content types.

Do not rely solely on browser validation.

## 10.3 Session security

Use an unpredictable anonymous session identifier.

Configure cookies appropriately for the deployment environment, including:

- `HttpOnly`.
- `SameSite`.
- `Secure` in production.
- An appropriate expiration period.

If a session cookie is used for authenticated state-changing requests, evaluate CSRF protections and enforce a strict CORS policy.

Do not trust a user-supplied owner ID.

## 10.4 Rate limiting

Apply rate limits to:

- Mystery generation.
- Accusation submission.
- Other resource-intensive endpoints.

The generation limit should be configurable.

The sample limit in `.env.example` is a starting point, not a guarantee of production suitability.

## 10.5 AI-generated content

- Clearly identify fictional cases.
- Do not present generated chats or images as authentic evidence from real people.
- Do not impersonate real individuals in a deceptive way.
- Do not use real personal information in generated case materials.
- Do not use protected traits as a shortcut for identifying a culprit.
- Avoid graphic or sensational descriptions.
- Use generic fictional names and invented locations where practical.
- Treat user-supplied story premises as untrusted input.

---

# 11. FRONTEND STATE AND DATA FLOW

## 11.1 API service layer

All network calls should live in reusable service modules, for example:

- `client/src/services/api.js`
- `client/src/services/mysteryService.js`

Components should not independently implement inconsistent fetch logic.

The service layer should handle:

- JSON parsing.
- Credentials required for session cookies.
- Error normalization.
- Request cancellation when appropriate.
- Consistent API response handling.

## 11.2 State management

Use React state and context where needed.

The MVP should not require a global state-management library.

Store only the state necessary for the active investigation.

The backend is authoritative for:

- Mystery content.
- Mystery ownership.
- Investigation status.
- Final accusations.
- Correct answers.
- Result data.

The frontend must never determine whether an accusation is correct.

## 11.3 Routing

Required routes:

- `/` — landing page.
- `/create` — create a mystery.
- `/mystery/:id` — investigation workspace.
- `/mystery/:id/result` — completed result.

Use a dashboard or history page only if needed to expose the mystery history requirement.

Handle invalid routes with a not-found page.

Protect result content using backend authorization, not just conditional frontend rendering.

---

# 12. ACCESSIBILITY AND RESPONSIVENESS

The application must:

- Work on current desktop and mobile browsers.
- Use semantic HTML.
- Associate form labels with inputs.
- Support keyboard navigation.
- Show visible focus indicators.
- Maintain readable contrast.
- Avoid conveying information through color alone.
- Provide alternative text for meaningful images.
- Provide a text fallback for unavailable media.
- Respect reduced-motion preferences.
- Avoid layouts that require horizontal scrolling on mobile.

Target common screen widths around 360px, 768px, 1024px, and 1440px.

Use these as test viewports rather than hard layout boundaries.

---

# 13. PERFORMANCE AND RELIABILITY

- Keep API response payloads reasonably small.
- Avoid repeated Gemini calls during ordinary navigation.
- Persist validated mysteries so users can reopen them without regenerating content.
- Limit generation retries.
- Use timeouts for external provider requests.
- Avoid blocking the investigation because optional media is unavailable.
- Lazy-load large media where practical.
- Use loading indicators for long-running requests.
- Avoid duplicate mystery creation from repeated button clicks.
- Handle database connection failures cleanly.
- Log failures with enough context for debugging without leaking secrets.

If generation becomes too slow for a single synchronous HTTP request, introduce a generation-status workflow and polling in a later implementation phase. Do not add a job queue unless the synchronous approach proves inadequate.

---

# 14. TESTING REQUIREMENTS

Use a suitable test framework such as Vitest for frontend tests and a compatible Node.js test framework for backend tests.

Use API integration tests with an isolated test database or a suitable test database strategy.

Do not use production data in automated tests.

## 14.1 Unit tests

Test:

- Story premise validation.
- Genre and difficulty validation.
- Structured AI response validation.
- Suspect ID uniqueness.
- Culprit existence.
- Evidence reference integrity.
- Timeline consistency rules.
- Solution reference integrity.
- Correct and incorrect accusation evaluation.
- Duplicate accusation rejection.
- Public response sanitization.

## 14.2 API tests

Test:

- Health endpoint.
- Successful mystery creation.
- Invalid premise rejection.
- Gemini failure handling.
- Invalid AI output handling.
- Mystery retrieval.
- Cross-session access denial.
- Accusation submission.
- Invalid suspect submission.
- Duplicate final accusation rejection.
- Result authorization.
- Rate limiting.

Mock Gemini responses in automated tests. Do not require a live Gemini API call for every test.

Include at least one end-to-end happy path using a known-valid fictional mystery fixture.

## 14.3 Frontend tests

Test:

- Landing-page navigation.
- Required premise validation.
- Loading and error states.
- Evidence display.
- Suspect selection.
- Confirmation before accusation.
- Correct result rendering.
- Incorrect result rendering.
- Mobile navigation behavior.

## 14.4 Manual acceptance testing

Verify that a user can:

1. Open the landing page.
2. Create a mystery.
3. View suspects and evidence.
4. Review the timeline.
5. Select and submit an accusation.
6. Receive a correct or incorrect result.
7. Read the solution explanation.
8. Reopen the mystery without regenerating it.
9. Receive a useful error if generation fails.

---

# 15. ACCEPTANCE CRITERIA

The MVP is complete only when every P0 criterion below passes.

### Product functionality

- [ ] A user can create a mystery from a text premise.
- [ ] Genre and difficulty affect the generated investigation.
- [ ] The system creates three to six suspects.
- [ ] Every playable mystery has exactly one culprit.
- [ ] At least six evidence items are available.
- [ ] At least three meaningful clues support the solution.
- [ ] The timeline and evidence agree with the canonical facts.
- [ ] The user can inspect evidence before submitting an accusation.
- [ ] The user can select a suspect and submit one final accusation.
- [ ] The server determines whether the accusation is correct.
- [ ] The solution is revealed only after a valid submission.
- [ ] The solution explains the evidence that supports it.
- [ ] A failed optional media generation does not prevent gameplay.

### Technical requirements

- [ ] React frontend runs successfully.
- [ ] Express backend runs successfully.
- [ ] MongoDB stores validated mysteries.
- [ ] Gemini is called exclusively from the backend.
- [ ] API responses follow the documented contract.
- [ ] Invalid AI output is rejected or repaired safely.
- [ ] Unauthorized users cannot retrieve another user's mysteries.
- [ ] Correct answers are not exposed through pre-accusation responses.
- [ ] Tests cover the main generation, authorization, and accusation flows.
- [ ] Setup instructions work on a clean development environment.
- [ ] No API keys or other secrets are committed.

### UI requirements

- [ ] Landing page is responsive.
- [ ] Mystery creation form has validation and a loading state.
- [ ] Investigation workspace presents suspects, evidence, and timeline.
- [ ] Result page explains the outcome.
- [ ] Error states are understandable.
- [ ] Keyboard navigation and readable contrast are supported.

---

# 16. IMPLEMENTATION PHASES FOR CODEX

Codex must implement the application in the following order.

## Phase 1 — Project foundation

- Create the client and server applications.
- Configure package scripts.
- Set up environment-variable handling.
- Configure Express and MongoDB.
- Add the health endpoint.
- Add a basic React application.
- Create shared error-handling conventions.
- Write setup documentation.

**Exit criteria:** Both applications run, MongoDB connectivity is verified, and the health endpoint works.

## Phase 2 — Frontend shell

- Implement global styles and responsive layout.
- Build the landing page.
- Build the mystery creation form.
- Set up React Router.
- Add loading, error, and empty-state components.

**Exit criteria:** Users can navigate the interface and submit a validated creation form.

## Phase 3 — Gemini generation

- Implement the Gemini provider service.
- Create the structured generation schema.
- Implement mystery generation.
- Implement deterministic validation.
- Add bounded retry handling.
- Create MongoDB models.
- Add the mystery creation endpoint.

**Exit criteria:** A valid fictional mystery is generated, validated, and saved.

## Phase 4 — Investigation workspace

- Build suspect cards.
- Build the evidence gallery.
- Build evidence detail views.
- Build the timeline.
- Connect the workspace to the backend.
- Ensure private solution fields are never exposed.

**Exit criteria:** A user can investigate a saved mystery using public evidence.

## Phase 5 — Accusation and results

- Implement the accusation endpoint.
- Implement the attempt model.
- Enforce final-submission rules.
- Build the accusation interface.
- Build the result page.
- Implement solution explanations.

**Exit criteria:** Correct and incorrect accusations produce the appropriate server-authoritative results.

## Phase 6 — Media integration

- Add the media-provider abstraction.
- Implement image generation if a suitable provider is configured.
- Add generated-media status handling.
- Add appropriate placeholders and text fallbacks.
- Ensure media failure does not block gameplay.

**Exit criteria:** Optional media works where supported and gracefully degrades otherwise.

## Phase 7 — Testing and hardening

- Run unit tests.
- Run integration tests.
- Verify session ownership.
- Verify private-answer isolation.
- Verify rate limiting.
- Test mobile layouts.
- Test API failures.
- Review dependencies and configuration.
- Complete README documentation.

**Exit criteria:** All P0 acceptance criteria pass.

Do not move to the next phase until the current phase's exit criteria are satisfied.

---

# 17. CODEX OPERATING INSTRUCTIONS

When working on this repository:

1. Read `SPEC.md` before making changes.
2. Inspect the existing codebase before creating or replacing files.
3. Identify the current implementation phase.
4. Implement only the next incomplete phase unless explicitly instructed otherwise.
5. Preserve working functionality.
6. Do not replace existing project files wholesale without a clear technical reason.
7. Use the documented API and data contracts.
8. Add tests for new business logic.
9. Run relevant tests and build commands.
10. Fix regressions introduced by your changes.
11. Update documentation when actual behavior or configuration changes.
12. Do not claim that a feature works unless you have implemented and verified it.
13. If a test cannot run because a service or credential is unavailable, report that limitation clearly.
14. If a required decision cannot be resolved from this specification, explain the issue and propose the smallest reasonable change.
15. Do not add unrequested product features during implementation.

## Required completion report

After each phase, report:

- Phase completed.
- Files created or modified.
- Functionality implemented.
- Tests executed.
- Test results.
- Environment variables or external services required.
- Known issues or remaining work.
- Next phase.

---

# 18. MVP DEFINITION OF DONE

AI Mystery Room is considered ready for an initial MVP release when:

1. A user can create a fictional investigation from a story premise.
2. Gemini generates structured mystery content.
3. The backend validates and persists the investigation.
4. The user can inspect suspects, clues, evidence, and the timeline.
5. The user can make a final accusation.
6. The server evaluates the accusation.
7. The application reveals and explains the solution.
8. The interface works on mobile and desktop.
9. Failures are handled without exposing secrets.
10. Automated tests cover the critical user journey.
11. Setup and configuration are documented.
12. Every P0 acceptance criterion passes.

The primary objective is a coherent, secure, and playable AI mystery experience—not merely a visually attractive interface.

**End of specification.**
