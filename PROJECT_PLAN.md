# AppTrust MVP Project Plan

## Vision

AppTrust helps people understand an app before installing it by explaining:

1. What permissions the app requests.
2. Why those permissions may be needed.
3. Potential privacy and security risks.
4. Whether the developer appears trustworthy.
5. A basic trust score and recommendation.

## MVP Input

- App name or app-store URL
- Google Play URL
- Apple App Store URL

## MVP Output

- App information
- Developer information
- Developer website information
- Domain age and website checks
- Permission explanations
- Permission risk levels
- Trust score
- Plain-language recommendation

## Current Status

- Day 1: Complete and merged into `main`.
- Day 2: Complete on `feature/google-play-app-search`; ready for review/merge.
- Day 3 onward: Planned.

## Technical Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Next.js API routes
- Supabase Postgres when persistence is needed
- Vercel deployment
- Vitest and Testing Library
- GitHub Actions and CodeQL

## Internal AppTrust Engine

The app will include an internal orchestration layer that is not directly visible in the UI. It will coordinate normal application services and return consistent results to the frontend.

```text
Frontend
   |
   v
Next.js API route
   |
   v
AppTrust engine
   |-- URL validation
   |-- Store data fetchers
   |-- Permission analyzer
   |-- Developer analyzer
   |-- Domain checker
   |-- Trust score calculator
   |-- Cache and retry policy
   |-- Error classification and logging
```

The engine should use deterministic code for validation, fetching, scoring, caching, and error handling. AI is optional and should only be introduced later for explanations or privacy-policy summaries.

## Day 1 - Foundation

### Status

Complete.

### Work

- Create the Next.js application.
- Configure TypeScript, Tailwind CSS, and ESLint.
- Create the AppTrust homepage.
- Add responsive visual design.
- Add the initial app URL input.
- Add Vitest and Testing Library.
- Add homepage tests.
- Add GitHub Actions quality checks.
- Add CodeQL scanning.
- Remove duplicate workflow triggers.
- Keep the CI pipeline focused on lint, typecheck, tests, and build.

### Deliverable

A working AppTrust homepage with automated validation.

## Day 2 - Google Play App Lookup

### Status

Complete on `feature/google-play-app-search`.

### Work

- Install and integrate `google-play-scraper`.
- Parse and validate Google Play URLs.
- Add the `/api/apps` route.
- Normalize app metadata into a shared TypeScript type.
- Fetch real app data from Google Play.
- Add the dynamic `/report/[appId]` page.
- Connect the homepage form to the API.
- Add loading, success, and error states.
- Optimize remote app icons with `next/image`.
- Add API input validation and error classification.
- Add parser and homepage tests.

### Deliverable

A user can paste a Google Play URL and receive a real AppTrust app report.

## Day 3 - Apple App Store Lookup

### Goal

Support iPhone and iPad app lookups alongside Google Play.

### Work

- Add Apple App Store URL parsing.
- Integrate an App Store lookup client.
- Normalize Apple and Google data into the same app model.
- Detect the store from the submitted URL.
- Add Apple-specific report details where available.
- Add platform badges and store links.
- Handle unsupported or malformed store URLs.
- Add tests for Apple URLs and unified app responses.

### Deliverable

A single lookup flow supporting Google Play and Apple App Store URLs.

## Day 4 - Permission Knowledge Base

### Goal

Translate technical permissions into useful, plain-language explanations.

### Initial Permissions

- Camera
- Microphone
- Contacts
- SMS
- Location
- Bluetooth
- Storage and photos
- Notifications
- Accessibility

### Work

- Create a typed permission knowledge base.
- Define what each permission allows.
- Explain common legitimate reasons for requesting it.
- Define low, medium, and high risk guidance.
- Add app-category context where useful.
- Map store permission data to known permissions.
- Add permission cards to the report page.
- Add tests for known and unknown permissions.

### Deliverable

Users can understand what an app permission means and why it may be requested.

## Day 5 - Internal AppTrust Engine and Trust Signals

### Goal

Move business logic out of individual route handlers and prepare the app for multiple data sources.

### Work

- Create an internal `apptrust-engine` service layer.
- Add platform detection and shared request validation.
- Add structured error types and error-to-HTTP mapping.
- Add timeout and retry policies for store lookups.
- Add lightweight caching for repeated app requests.
- Add developer website extraction.
- Check website reachability and HTTPS status.
- Detect whether a privacy policy link is available.
- Capture developer contact information.
- Add structured operation logs without exposing internal details in the UI.

### Deliverable

A reliable internal service coordinates lookups and returns consistent report data.

## Day 6 - Domain Intelligence and Trust Score

### Goal

Produce a transparent trust score and recommendation.

### Domain Signals

- Domain age
- Registrar
- HTTPS enabled
- Website reachable
- Privacy policy available
- Developer contact information
- Suspicious or mismatched domain signals

### Scoring Example

Positive signals:

- Domain older than five years: +20
- More than one million downloads: +15
- Privacy policy available: +10
- Verified developer website: +10

Risk signals:

- Excessive permissions: -10
- Missing website: -15
- Suspicious domain: -20

The score must be clamped to a range of 0 to 100 and show the major reasons behind the result.

### Recommendations

- Safe
- Medium Risk
- High Risk

### Deliverable

Each report includes a transparent score, contributing signals, risk level, and recommendation.

## Day 7 - Polish, Security, and Launch

### Goal

Prepare the MVP for a controlled public release.

### Work

- Improve mobile layouts.
- Review keyboard navigation and screen-reader labels.
- Add empty, loading, error, and unavailable-data states.
- Add rate limiting or a production cache.
- Add API route tests and integration tests.
- Review external scraper failure behavior.
- Review logs for sensitive data.
- Upgrade vulnerable dependencies when a compatible Next.js fix is available.
- Add SEO metadata and social preview metadata.
- Configure Vercel environment variables.
- Deploy a production preview.
- Run a small manual acceptance test with real apps.

### Deliverable

A stable public MVP suitable for the first validation users.

## Testing and CI Standards

Every pull request should run:

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Tests should cover:

- URL parsing
- API validation
- Successful app lookup normalization
- Not-found responses
- Upstream service failures
- Permission mapping
- Trust score calculations
- Loading and error UI states

CodeQL remains enabled as the repository security scan. Dependency automation is intentionally disabled for the MVP and can be re-enabled later if maintenance volume increases.

## Explicitly Out of Scope for MVP

Do not build these during the seven-day MVP:

- Authentication
- Payments
- Native mobile applications
- Browser extension
- APK reverse engineering
- Screenshot permission analysis
- Community reviews
- Complex dashboards
- Fully autonomous AI operations

## Phase 2 After Validation

- Screenshot permission analyzer
- APK analyzer
- AI-assisted explanations
- Browser extension
- Permission change alerts
- Privacy score
- Community reviews
- Saved reports

## Success Criteria

- Week 1: MVP deployed.
- Week 2: First 20 users.
- Week 3: Collect user feedback.
- Week 4: Decide whether to continue, narrow the scope, or pivot.

## Operating Principle

Focus on validating this question:

> Can people understand and trust apps better with AppTrust before installing them?
