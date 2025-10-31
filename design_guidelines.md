# Badminton Court Registration System - Design Guidelines

## Design Approach

**Selected Approach**: Design System (Material Design)

**Design System**: Material Design 3 with sports platform adaptation

**Design Principles**:
- Bold, vibrant color palette that energizes and motivates
- Pronounced elevation and shadow hierarchy for depth
- Dynamic motion and responsive animations throughout
- Clear visual layers with strong material surfaces
- Touch-optimized interactions for mobile athletes on-the-go

---

## Color System

**Primary Palette**:
- **Electric Blue**: Primary actions, navigation, key interactive elements
- **Vibrant Orange**: Secondary actions, highlights, energy accents
- **Active Green**: Success states, availability indicators, positive feedback

**Surface & Depth**:
- White backgrounds for primary content surfaces
- Light gray (50-100) for secondary surfaces
- Subtle blue tint for elevated surfaces
- Deep shadows for floating elements

**Text Hierarchy**:
- High emphasis: 87% opacity black
- Medium emphasis: 60% opacity black
- Disabled: 38% opacity black

**Status Colors**:
- Available/Success: Active Green variations
- Warning/Pending: Vibrant Orange variations
- Error/Unavailable: Red accents
- Info: Electric Blue variations

---

## Typography

**Font Family**: **Roboto** (Material Design standard)
- Display: Roboto Bold (700) for headlines
- Body: Roboto Regular (400) and Medium (500)
- Numbers/Stats: Roboto Bold (700) with tabular figures

**Type Scale**:
- Display Large: text-5xl (48px), font-bold, line-tight
- Headline: text-4xl (36px), font-bold
- Title: text-2xl (24px), font-semibold
- Subheading: text-xl (20px), font-medium
- Body: text-base (16px), font-normal
- Caption: text-sm (14px), font-medium
- Button: text-base (16px), font-medium, uppercase tracking-wide

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16**
- Micro: p-2 (8px) - tight element spacing
- Standard: p-4, gap-4 (16px) - default component padding
- Comfortable: p-6, gap-6 (24px) - card interiors
- Section: py-8, py-12 (32-48px) - vertical rhythm
- Hero: py-16 (64px) - major sections

**Grid System**:
- Desktop: 12-column grid, court cards in grid-cols-4, features in grid-cols-3
- Tablet: grid-cols-2 for most content
- Mobile: grid-cols-1 with full-width cards

**Container Strategy**:
- Main content: max-w-7xl with px-4 (mobile), px-8 (desktop)
- Full-bleed sections for hero and major callouts

---

## Elevation & Shadow System

**Shadow Levels** (Material Design elevation):
- **Level 0**: No shadow - flat backgrounds
- **Level 1**: Subtle shadow - resting cards, default state
- **Level 2**: Raised shadow - hover states, input fields
- **Level 3**: Floating shadow - floating action buttons, active dropdowns
- **Level 4**: Dialog shadow - modals, overlays
- **Level 5**: Maximum shadow - prominent floating elements

**Implementation**:
- Default cards: shadow-md (Level 1)
- Hover cards: shadow-lg (Level 2)
- FABs: shadow-xl (Level 3)
- Modals: shadow-2xl (Level 4)

---

## Component Library

### Navigation
**Top App Bar**:
- Height: h-16
- Prominent shadow (shadow-md)
- Electric blue background
- White text and icons
- Search icon, notifications, user avatar right-aligned
- Mobile: Menu icon left, logo center

### Hero Section
**Full-Width Sports Hero**:
- Height: min-h-[600px] desktop, min-h-[500px] mobile
- Large badminton action photography background
- Dark gradient overlay (bottom to top) for text contrast
- Centered content: Display headline + body text + CTAs
- Dual CTAs: Primary (orange button with backdrop-blur-md) + Secondary (outlined white)
- Quick stats chips below CTAs showing live data

### Cards

**Event Card**:
- Elevated surface: shadow-md resting, shadow-lg hover
- Rounded corners: rounded-2xl
- Padding: p-6
- Structure: Full-width event image (aspect-16/9), title (text-2xl, font-bold), date/time row with icons, stats chips (registered/capacity), primary action button
- Color accent strip on left edge

**Team Card**:
- Horizontal layout: Avatar cluster left, team info center, actions right
- Shadow: shadow-md
- Padding: p-6
- Rounded: rounded-xl
- Member avatars: Overlapping circles with white borders
- Team name: text-xl, font-semibold
- Stats row: Member count, win rate badges

**Court Status Card**:
- Large cards in grid: grid-cols-4 desktop
- Status indicator: Color-coded top border (green/orange/red)
- Court number: text-4xl, font-bold, centered
- Current status: text-lg with icon
- Shadow: shadow-lg for prominence
- Available courts: Green accent, subtle pulse animation

### Forms

**Registration Form**:
- Material text fields: Outlined style with labels
- Input height: h-14
- Focused state: Electric blue outline, label shrinks
- Radio buttons: Large touch targets (min-w-12 min-h-12)
- Team/Individual toggle: Segmented button group with slide animation
- Helper text below fields: text-sm
- Submit button: Full-width on mobile, shadow-lg

**Team Creation**:
- Member input: Autocomplete text field with chip display
- Add member: FAB mini variant (size-12) with orange background
- Member list: Chips with delete icons, shadow-sm
- Captain badge: Star icon + yellow accent

### Buttons

**Primary (Filled)**:
- Padding: px-8 py-4
- Rounded: rounded-full
- Shadow: shadow-md resting, shadow-lg active
- Font: text-base, font-medium, uppercase

**Floating Action Button (FAB)**:
- Main FAB: size-16, rounded-full, shadow-xl
- Orange background, white icon
- Fixed position: bottom-6 right-6
- Mini FAB: size-12 for secondary actions
- Extended FAB: Rounded-full with icon + text, px-6

**Text Buttons**:
- No background
- Padding: px-4 py-2
- Uppercase, font-medium
- Ripple effect on press

### Data Display

**Schedule Table/Grid**:
- Card-based on mobile, table on desktop
- Time slots: Sticky left column with blue background
- Court columns: Equal width distribution
- Match cells: White cards with shadow-sm, hover shadow-md
- Cell padding: p-4
- Status badges in top-right of cells

**Registration List**:
- List items with dividers
- Item height: min-h-20
- Avatar (size-12) + name + timestamp
- Swipe actions on mobile (delete, edit)
- Admin badge for privileged users

### Admin Dashboard

**Stat Cards**:
- Grid: grid-cols-1 md:grid-cols-3 gap-6
- Each card: p-8, rounded-2xl, shadow-lg
- Color gradient backgrounds (blue, orange, green)
- Large number: text-5xl, font-bold, white text
- Label: text-lg, uppercase, white with 70% opacity
- Icon: Absolute positioned, size-16, 20% opacity

**Action Cards**:
- Prominent CTAs: "Create Event", "Allocate Courts"
- Icon + title + description layout
- Padding: p-6
- Shadow: shadow-md hover to shadow-xl
- Color accent: Left border (4px solid)

**Match Allocation Board**:
- Kanban-style columns for courts
- Draggable match cards with grab cursor affordance
- Drop zones: Dashed borders with blue accent
- Filter chips at top: Multiple selection with color coding

### Status & Feedback

**Badges**:
- Rounded: rounded-full
- Padding: px-3 py-1
- Font: text-xs, font-bold, uppercase
- Positioned: Absolute top-2 right-2 on cards
- Color variations: Green (available), orange (pending), red (full)

**Progress Indicators**:
- Linear: Height h-2, rounded-full, blue fill with orange accent
- Registration capacity: Show percentage + numerical count
- Circular: For loading states, indeterminate spinner

**Snackbars**:
- Bottom center positioning
- Padding: px-6 py-4
- Rounded: rounded-lg
- Shadow: shadow-2xl
- Action button included (text button style)

---

## Animations

**Material Motion Principles**:
- **Duration**: Fast (100-200ms) for micro-interactions, standard (250-300ms) for transitions
- **Easing**: Deceleration curve for entering, acceleration for exiting

**Key Animations**:
- Card entrance: Fade + slide up (stagger 50ms intervals in lists)
- Button press: Ripple effect radiating from touch point
- FAB: Scale bounce on appearance, rotate on state changes
- Page transitions: Shared element transitions where applicable
- Court cards: Pulse animation for available status (subtle, 2s interval)
- Tab switches: Slide + fade between panels
- Success actions: Checkmark scale animation
- Hover states: Smooth shadow elevation change (200ms)

---

## Images

**Hero Section**:
- Full-width background: Dynamic badminton action shot (player mid-smash, racket motion blur)
- Treatment: Slight color boost to emphasize vibrancy, dark gradient overlay (opacity 50-60%)
- Dimensions: Minimum 1920x800px
- Position: Center-focused composition

**Event Cards**:
- Thumbnail images: Court aerial views, tournament banners, player action shots
- Aspect ratio: 16:9
- Placement: Top of card, full-width
- Treatment: Subtle shadow overlay for text legibility

**Team Profiles**:
- User avatars: Circular, size-12 resting, size-16 in detail views
- Team badges: Circular or square logos, size-16
- Default: Colorful gradient backgrounds with initials for missing photos

**Empty States**:
- Centered illustrations: Badminton-themed line art or icons (size-32)
- Supporting text below: Friendly, encouraging copy

**Background Patterns** (subtle):
- Court line patterns as watermarks in sections
- Shuttlecock silhouettes at large scale (10% opacity)