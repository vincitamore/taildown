# Text-Based Illustrations {huge-bold center primary}

## Professional Components for Project Structures and Flow Diagrams {xl muted center}

Modern, mobile-optimized text illustration components. {large center relaxed-lines}

---

# File Tree Component {huge-bold}

## Basic File Tree {large-bold}

Perfect for documenting project structures with professional styling.

:::file-tree
project/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── utils/
│   │   ├── helpers.ts
│   │   └── validators.ts
│   └── index.ts
├── tests/
│   └── app.test.ts
├── package.json
└── README.md
:::

## Glassmorphism Variant {large-bold}

:::file-tree {light-glass}
backend/
├── api/
│   ├── routes/
│   │   ├── users.ts
│   │   └── posts.ts
│   └── controllers/
│       ├── UserController.ts
│       └── PostController.ts
├── database/
│   └── models/
│       ├── User.ts
│       └── Post.ts
└── server.ts
:::

---

# Flow Diagram Component {huge-bold}

## Vertical Flow {large-bold}

Visualize processes and workflows with ASCII-style diagrams.

:::flow
           START
             |
             v
    ┌─────────────────┐
    │ Initialize App  │
    └─────────────────┘
             |
             v
    ┌─────────────────┐
    │  Load Config    │
    └─────────────────┘
             |
             v
        ┌────────┐
        │ Valid? │
        └────────┘
         /      \
        /        \
       v          v
   [YES]        [NO]
     |            |
     v            v
┌─────────┐  ┌─────────┐
│  Start  │  │  Error  │
│ Server  │  │ Message │
└─────────┘  └─────────┘
     |            |
     v            v
   RUNNING       EXIT
:::

## Horizontal Flow {large-bold}

:::flow {horizontal glass}
┌───────┐     ┌──────────┐     ┌──────────┐     ┌─────┐
│ Input │ --> │ Validate │ --> │ Process  │ --> │ End │
└───────┘     └──────────┘     └──────────┘     └─────┘
                   |                  |
                   v                  v
              ┌─────────┐       ┌─────────┐
              │  Error  │       │ Success │
              └─────────┘       └─────────┘
:::

---

# ASCII Art Component {huge-bold}

## Modern ASCII Logo {large-bold}

:::ascii-art {modern}
    ╔═══════════════════════════════════╗
    ║                                   ║
    ║   :icon[zap]{warning} TAILDOWN :icon[zap]{warning}   ║
    ║                                   ║
    ║   Modern Markup Language          ║
    ║                                   ║
    ╚═══════════════════════════════════╝
:::

## Boxed ASCII {large-bold}

:::ascii-art {boxed}
┌─────────────────────────────────────┐
│                                     │
│   ██████╗ ██╗   ██╗██╗██╗     ██╗  │
│   ██╔══██╗██║   ██║██║██║     ██║  │
│   ██████╔╝██║   ██║██║██║     ██║  │
│   ██╔══██╗██║   ██║██║██║     ██║  │
│   ██████╔╝╚██████╔╝██║███████╗██║  │
│   ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═╝  │
│                                     │
│   Fast. Beautiful. Professional.   │
│                                     │
└─────────────────────────────────────┘
:::

---

# Real-World Example {xl-bold}

## System Architecture {large-bold}

:::flow {detailed}
                    ┌─────────────┐
                    │  Frontend   │
                    │   (React)   │
                    └─────────────┘
                           |
                           | HTTPS
                           v
                    ┌─────────────┐
                    │  API Gateway│
                    └─────────────┘
                           |
              ┌────────────┼────────────┐
              |            |            |
              v            v            v
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Auth    │ │   API    │ │  Admin   │
        │ Service  │ │ Service  │ │ Service  │
        └──────────┘ └──────────┘ └──────────┘
              |            |            |
              └────────────┼────────────┘
                           |
                           v
                    ┌─────────────┐
                    │  Database   │
                    │ (PostgreSQL)│
                    └─────────────┘
:::

---

# Features {xl-bold}

:::grid
:::card {elevated}
### :icon[smartphone]{primary} Mobile First

Horizontal scroll on mobile with smooth touch scrolling.
:::

:::card {elevated}
### :icon[type]{info} Monospace

Perfect alignment using professional monospace fonts.
:::

:::card {elevated}
### :icon[palette]{success} Styled

Subtle shadows, gradients, and glassmorphism effects.
:::
:::

---

:::container
# Professional Design {massive center primary}

All components follow strict UI/UX standards. {large center muted}

[View More Examples](#){button primary}

{center}

:icon[check]{success xs} Zero Config • :icon[check]{success xs} Mobile Optimized • :icon[check]{success xs} Production Ready {small muted center}
:::
