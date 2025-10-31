# Badminton Court Registration System - Design Guidelines

## Design Approach

**Selected Approach**: Reference-Based (Sports Platform Design)

**Primary References**: Nike Training Club, ESPN app, ACTIVE.com, modern sports booking platforms

**Design Principles**:
- High-energy, action-oriented aesthetic that motivates users
- Bold typography with strong hierarchy for quick scanning
- Dynamic card-based layouts with sharp, athletic lines
- Clean data presentation for schedules and statistics
- Mobile-first responsive design for on-the-go access

---

## Typography

**Font Families**:
- Primary (Headings): **Inter** - Bold (700-800 weight), clean, modern, sports-tech feel
- Secondary (Body): **Inter** - Regular to Medium (400-500 weight)
- Accent (Numbers/Stats): **Inter** - SemiBold to Bold (600-700 weight), tabular numbers

**Type Scale**:
- Hero Headlines: text-5xl to text-6xl (48-60px), font-bold, tight tracking
- Section Headers: text-3xl to text-4xl (30-36px), font-bold
- Card Titles: text-xl to text-2xl (20-24px), font-semibold
- Body Text: text-base to text-lg (16-18px), font-normal
- Captions/Meta: text-sm (14px), font-medium
- Stats/Numbers: text-2xl to text-4xl, font-bold, tabular-nums

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16**
- Micro spacing: gap-2, p-2 (8px)
- Standard spacing: gap-4, p-4, m-4 (16px)
- Component spacing: gap-6, p-6 (24px)
- Section spacing: gap-8, p-8, py-12 (32px, 48px)
- Large separations: py-16, my-16 (64px)

**Grid System**:
- Desktop: grid-cols-3 for feature cards, grid-cols-4 for court displays
- Tablet: grid-cols-2 for most content
- Mobile: grid-cols-1 with full-width cards

**Container Strategy**:
- Max width: max-w-7xl for main content areas
- Full-width hero sections with inner container
- Consistent horizontal padding: px-4 (mobile), px-8 (desktop)

---

## Component Library

### Navigation
**Top Navigation Bar**:
- Fixed position with backdrop blur
- Height: h-16 to h-20
- Logo left, main nav center, user actions right
- Mobile: Hamburger menu with slide-out drawer
- Active state: Bold font with underline indicator

### Hero Section
**Event Showcase Hero**:
- Full-width background with sports action imagery
- Overlay gradient for text readability
- Height: min-h-[500px] on desktop, min-h-[400px] on mobile
- CTA buttons with blurred background (backdrop-blur-md)
- Quick stats bar below hero (registrations count, available courts)

### Cards

**Event Card**:
- Sharp corners with subtle border
- Padding: p-6
- Hover: Slight lift effect (subtle shadow increase)
- Structure: Event image/icon top, title, date/time, registration button, participant count badge
- Badge positioning: Absolute top-right for status indicators

**Team Card**:
- Horizontal layout on desktop (image left, info right)
- Avatar cluster for team members
- Team stats: Member count, win rate (if applicable)
- Action buttons: Edit, View Details

**Court Card**:
- Status indicator (Available/In Use) with distinct visual treatment
- Court name prominent
- Current match info or "Available" state
- Grid layout: 2-4 columns depending on viewport

### Forms

**Registration Form**:
- Two-step or tabbed interface (Individual vs Team selection)
- Large radio buttons or toggle for selection type
- Input fields: p-4, rounded corners, focus ring
- Primary action button: Full-width on mobile, auto on desktop
- Real-time validation feedback

**Team Creation Form**:
- Member addition interface with + button
- Member list with remove functionality
- Captain designation toggle
- Visual hierarchy: Form fields p-4, submit button prominent

### Data Display

**Match Schedule Table**:
- Responsive table that converts to cards on mobile
- Time slots on left, courts across top
- Cell padding: p-4
- Color-coded by match type or status
- Hover state for interactive cells

**Registration List**:
- Alternating row styles or card-based list
- Avatar + name + team/individual indicator
- Timestamp display
- Admin actions (if applicable)

### Admin Components

**Admin Dashboard**:
- Stat cards in grid layout: grid-cols-1 md:grid-cols-3
- Large numbers (text-4xl) with labels
- Action cards for primary tasks: "Create Event", "Allocate Matches"
- Recent activity feed

**Event Creation Panel**:
- Multi-step form with progress indicator
- Date/time pickers with clear visual design
- Court selection with visual checkboxes
- Preview panel showing event details

**Match Allocation Display**:
- Visual court grid showing assignments
- Drag-and-drop capability (visual affordance even if not functional yet)
- Export/print functionality button
- Filter by court/time controls

### Buttons

**Primary Actions**:
- Padding: px-6 py-3 (desktop), px-4 py-3 (mobile)
- Font: font-semibold, text-base
- Rounded: rounded-lg
- States handled by component

**Secondary Actions**:
- Similar sizing, different visual treatment
- Icon + text combination where appropriate

### Status Indicators

**Badges**:
- Padding: px-3 py-1
- Font: text-xs to text-sm, font-bold, uppercase tracking-wide
- Rounded: rounded-full
- Positioned absolute in cards for status display

**Progress Indicators**:
- Registration capacity: Linear progress bar with percentage
- Match completion: Ring progress or linear bar

---

## Images

**Hero Section**: 
- Large hero image featuring badminton action shots (players mid-smash, dynamic court view)
- Image treatment: Slight desaturation with overlay gradient
- Placement: Full-width background, centered composition

**Event Cards**:
- Thumbnail images (aspect-16/9) showing court views or generic badminton imagery
- Size: Full card width, height varies by card size

**Team Management**:
- User avatars: Circular, size-10 to size-12
- Team logos: Square or circular, size-16 to size-20
- Default placeholders for missing images

**Empty States**:
- Illustration or icon for "No events yet", "No teams", etc.
- Centered, size-24 to size-32 icons

---

## Animations

Use sparingly for functional feedback only:
- Card hover: Subtle transform (scale-[1.02]) and shadow transition
- Button loading states: Simple spinner
- Page transitions: Fade effect (200ms duration)
- List item entry: Stagger fade-in for initial load (avoid on interactions)