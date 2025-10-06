# Text-Based Illustrations {huge-bold center primary}

Modern professional components for directory trees and flow diagrams. {large muted center}

---

## Project Structure Examples {large-bold}

### Basic Directory Tree

:::tree
- taildown/
  - packages/
    - compiler/
      - src/
        - parser/
        - renderer/
        - components/
      - dist/
    - cli/
      - src/
      - dist/
    - shared/
  - examples/
    - 01-basic-markdown.td
    - 10-complete-page.td
  - docs/
  - package.json
  - README.md
:::

### Minimal Tree Style

:::tree {minimal}
- project/
  - src/
    - index.ts
    - utils.ts
    - types.ts
  - tests/
    - unit/
    - integration/
  - package.json
:::

### Colored Depth Visualization

:::tree {colored lg}
- app/
  - frontend/
    - components/
      - Button.tsx
      - Card.tsx
      - Modal.tsx
    - pages/
      - Home.tsx
      - About.tsx
  - backend/
    - controllers/
      - UserController.ts
      - AuthController.ts
    - models/
      - User.ts
    - routes/
  - shared/
    - types/
    - utils/
:::

### Glass Effect Tree

:::tree {glass}
- website/
  - public/
    - images/
    - fonts/
  - src/
    - components/
    - styles/
    - pages/
  - config/
  - package.json
:::

---

## Flow Diagram Examples {large-bold}

### Simple Vertical Flow

:::flow
- Initialize Application
- Load Configuration
- Connect to Database
- Start Server
- Listen for Requests
:::

### Horizontal Process Flow

:::flow {horizontal lg}
- Input Data
- Validate
- Transform
- Store
- Output Result
:::

### Stepped Process

:::flow {stepped}
- Create Account
- Verify Email
- Set Up Profile
- Choose Subscription
- Complete Onboarding
:::

### Branching Decision Flow

:::flow {branching}
- Request Received
  - Authentication Check
    - Valid Token
      - Process Request
    - Invalid Token
      - Return 401 Error
  - Rate Limit Check
    - Within Limits
      - Continue
    - Exceeded
      - Return 429 Error
:::

### Timeline Style

:::flow {timeline}
- Project Kickoff
- Requirements Gathering
- Design Phase
- Development Sprint 1
- Development Sprint 2
- Testing and QA
- Deployment
- Monitoring and Maintenance
:::

### Minimal Clean Flow

:::flow {minimal}
- Start
- Process
- Validate
- Save
- Notify
- Complete
:::

---

## Real-World Use Cases {large-bold}

### API Request Flow

:::flow {stepped lg}
- Client sends HTTP request
- API Gateway receives request
- Middleware validates JWT token
- Route handler processes request
- Service layer executes business logic
- Database query executes
- Response formatted and returned
- Client receives JSON response
:::

### File Structure for Component Library

:::tree {colored}
- component-library/
  - src/
    - components/
      - buttons/
        - Button.tsx
        - IconButton.tsx
        - ToggleButton.tsx
      - forms/
        - Input.tsx
        - Select.tsx
        - Checkbox.tsx
      - layout/
        - Container.tsx
        - Grid.tsx
        - Stack.tsx
      - feedback/
        - Alert.tsx
        - Toast.tsx
        - Modal.tsx
    - hooks/
      - useTheme.ts
      - useMediaQuery.ts
    - utils/
      - classNames.ts
      - validators.ts
    - types/
      - index.ts
  - tests/
  - docs/
  - package.json
  - tsconfig.json
:::

### CI/CD Pipeline Flow

:::flow {branching lg}
- Code Commit
  - Run Linter
    - Pass
      - Run Tests
        - Pass
          - Build Application
            - Success
              - Deploy to Staging
            - Failure
              - Notify Team
        - Fail
          - Block Deployment
    - Fail
      - Reject Commit
:::

---

## Nested Complex Examples {large-bold}

### Monorepo Structure

:::tree {rounded lg}
- monorepo/
  - apps/
    - web/
      - src/
        - app/
        - components/
        - lib/
      - public/
      - package.json
    - mobile/
      - src/
        - screens/
        - components/
      - package.json
    - docs/
      - src/
      - static/
  - packages/
    - ui/
      - src/
        - components/
      - package.json
    - utils/
      - src/
      - package.json
    - types/
      - src/
      - package.json
  - tools/
    - build/
    - deploy/
  - pnpm-workspace.yaml
  - turbo.json
:::

### Data Processing Pipeline

:::flow {stepped}
- Raw Data Ingestion
  - CSV Files
  - JSON APIs
  - Database Exports
- Data Cleaning
  - Remove Duplicates
  - Handle Missing Values
  - Normalize Formats
- Data Transformation
  - Apply Business Rules
  - Calculate Derived Fields
  - Join Related Data
- Data Validation
  - Schema Validation
  - Business Rule Checks
  - Quality Metrics
- Data Storage
  - Write to Data Warehouse
  - Update Indexes
  - Create Backups
- Reporting
  - Generate Analytics
  - Send Notifications
  - Update Dashboards
:::

---

## Glass and Dark Variants {large-bold}

### Modern Glass Tree

:::tree {glass lg}
- design-system/
  - tokens/
    - colors.json
    - typography.json
    - spacing.json
  - components/
    - primitives/
    - patterns/
  - documentation/
  - examples/
:::

### Dark Theme Flow

:::flow {dark horizontal}
- Authentication
- Authorization
- Processing
- Response
:::

---

Built with Taildown - Modern Text Illustrations {center muted}
