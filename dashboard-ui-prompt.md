# UI Build Prompt: SaaS Analytics Dashboard ("Kravio" style)

Build a pixel-polished SaaS dashboard UI using **Next.js + TypeScript + Tailwind CSS**. Match the design system, layout structure, and every card type described below exactly. This is a customer-support/CRM analytics dashboard — clean, minimal, data-dense but not cluttered, in the style of Linear, Notion, and modern B2B SaaS products.

---

## 1. Overall Layout

Three-zone layout:
1. **Left sidebar** — fixed width (~240px), full height, white background
2. **Top header bar** — spans the content area, breadcrumb + page title + actions
3. **Main content area** — light gray background (`#F5F5F4` / neutral-100), padded, contains stacked/grid cards

Background of the whole app (outside the white panels): soft warm gray (`bg-neutral-100`). Sidebar and cards are white with subtle borders (`border-neutral-200`) and soft shadows (`shadow-sm`), rounded corners (`rounded-xl` / `rounded-2xl`).

---

## 2. Sidebar (left nav)

- **Top**: logo mark (rounded square icon, dark background, white letter) + product name ("Kravio") in bold, plus a collapse/expand icon on the far right
- **Search bar**: pill-shaped input, placeholder "Search anything", with a `⌘K` keyboard shortcut badge right-aligned inside the input
- **Section label**: small uppercase gray label "MAIN NAVIGATION" (letter-spaced, `text-xs text-neutral-400 font-medium tracking-wide`)
- **Nav items** (icon + label), each in a row with generous vertical padding (~py-2.5), rounded-lg hover state (`hover:bg-neutral-100`):
  - Overview (active state: dark/black pill background, white text, icon)
  - Tickets (has a chevron to expand a submenu, shown expanded with indented children: "All / My Queue", "SLA Breach Risk", "Escalations")
  - Clients
  - Agents & Teams (expandable, chevron)
  - Knowledge Base (expandable, chevron)
  - Integrations
- **Second section label**: "ANALYTICS & INSIGHTS"
  - SLA Compliance
  - CSAT & NPS
  - Workload Analytics
  - Reports
- **Bottom section** (pushed to bottom via flex, separated by a divider):
  - Small "SUPPORT" label
  - Feedback, Help & Support, Settings nav items
  - **User profile card** at the very bottom: circular avatar with initials on colored background, name ("Samantha Walker"), email below in smaller gray text, small green online-status dot on the avatar, and a `⋯` menu icon on the right

Active nav item styling: solid dark pill (`bg-neutral-900 text-white rounded-lg`), icon and text both white. Inactive items: gray icon + gray-700 text.

---

## 3. Top Header Bar

- Left: breadcrumb text — "Overview / **Dashboard**" (last segment bold/dark, others muted gray, separated by `/`)
- Below breadcrumb (next line, larger): greeting headline — "Hello, [Name] 👋" in bold, larger font (`text-2xl font-semibold`)
- Below that: muted subtext line, smaller gray text describing the page
- Right side of header: a date-range dropdown pill ("Last week" with a calendar icon and chevron), a notification bell icon (in a rounded square button), a settings/gear icon, and a `⋮` overflow menu icon — all as small square icon-buttons with subtle borders

---

## 4. Dashboard Cards — build each of these as a reusable component

### 4a. Stat Card (small KPI card) — 3 of these in a row
Reusable `<StatCard />` with props: `title`, `value`, `changePercent`, `changeDirection`, `sparklineData`.

Layout:
- Top row: small gray label text + small icon button (info/expand icon) top-right
- Large bold number (`text-3xl font-bold`) as the headline metric
- Below number: small colored badge showing % change (green pill for positive like "+71% vs last week", red for negative like "-1.3% vs last week") next to muted "vs last week" text
- Bottom-right corner: a small inline **sparkline mini-chart** (line or bar), colored to match the trend (green for up, red for down), no axes/labels — just the raw shape, sitting inside a soft-tinted rounded background (light green/light red wash)

Three instances:
1. "Current Tickets" — 3,484 — +71% (green sparkline)
2. "Daily Avg. Resolution" — 486 — +2% (green sparkline)
3. "SLA Compliance Rate" — 92% — -1.3% (red sparkline)

### 4b. Latest Updates / Activity Feed Card (tall card, right column)
- Header: icon + "Latest Updates" title
- Tab switcher: three pill tabs — "Today" (active, dark filled), "Yesterday", "This week" (inactive, outlined/ghost)
- Search input below tabs: "Search activities" with search icon
- Small muted label: "8 new activities today"
- Scrollable list of activity rows, each with:
  - Icon or small avatar (varies by activity type — ticket icon, person icon, chat icon, warning triangle, book icon, star icon — each in a colored circular badge matching the activity type)
  - Bold title line (e.g., "Ticket Updated")
  - Muted timestamp top-right of each row (e.g., "11:20 AM")
  - Gray description line below title (e.g., "Ticket #2319 SLA updated")

### 4c. Main Trend Chart Card (large, full width of left column)
- Header row: icon + "Ticket Volume Trend" title on the left, date-range dropdown pill ("Last week") on the right
- Big bold number headline ("4,790") with a small green "+8% vs last week" badge next to it
- **Bar chart** below:
  - Light gray bars for all days, one bar highlighted dark/black (the currently-hovered or peak day)
  - A dashed horizontal reference line crossing the chart at a specific value
  - A dark tooltip pill floating above the highlighted bar showing "Tue : 584"
  - Y-axis gridlines with labels (0, 200, 400, 600, 800), X-axis labels are day abbreviations (Sun–Sat)
  - Keep the chart minimal: no chart border/box, just axis labels and bars sitting directly on the card's white background

### 4d. Data Table Card ("SLA Monitoring") — full width, bottom of page
- Header row: icon + "SLA Monitoring" title on the left; on the right — a search input ("Ticket" placeholder with search icon), a "Filter" button (funnel icon + label, outlined), and a `⋮` overflow icon button
- Table with sortable columns (each header has a small up/down sort icon): checkbox column, Ticket ID, Subject, Priority, Assigned To, Status, Created Date, SLA Due, and a trailing `⋮` actions column
- Row details:
  - Checkbox per row (one row shown pre-checked/selected with a highlighted row background)
  - Ticket ID as plain text (e.g., "#2319")
  - Priority shown as a colored dot/flag icon + label ("High" = red/orange, "Medium" = yellow, "Low" = gray)
  - Assigned To: small circular avatar + name
  - Status: colored icon + label as a soft pill (e.g., "In Review" = blue/purple icon, "Delivered" = green check, "In Progress" = orange clock)
  - SLA Due: countdown text, color-coded by urgency (e.g., "2h left" in red/orange, "1d left" in neutral gray)

---

## 5. Design Tokens

- **Font**: Inter or similar geometric sans-serif
- **Border radius**: generous — `rounded-xl` (12px) for cards, `rounded-full` for pills/badges/avatars, `rounded-lg` for buttons/inputs
- **Shadows**: very subtle, `shadow-sm`, almost flat — depth comes from borders + background contrast, not heavy shadows
- **Borders**: `1px solid` neutral-200, used generously between sidebar/content and around every card
- **Spacing**: generous padding inside cards (`p-5`/`p-6`), consistent `gap-4`/`gap-6` between grid items
- **Color palette**:
  - Background: neutral-100 (`#F5F5F4`)
  - Card surface: white
  - Primary text: neutral-900
  - Muted text: neutral-500
  - Accent/active: near-black (`#18181B`) for active nav + primary buttons — this is a **monochrome-first** UI, not a colorful one
  - Success green: for positive trends, "Delivered" status
  - Warning amber/orange: for medium priority, "In Progress"
  - Danger red: for high priority, SLA breach risk, negative trends
  - Info blue/purple: for "In Review" status
- **Icons**: outline-style icon set (Lucide React) throughout — sidebar nav, card headers, table cells, buttons

---

## 6. Component/File Structure to Generate

```
/components/dashboard/
  Sidebar.tsx
  Header.tsx
  StatCard.tsx
  ActivityFeedCard.tsx
  TrendChartCard.tsx
  DataTableCard.tsx
  StatusBadge.tsx
  PriorityBadge.tsx
  Avatar.tsx
/app/dashboard/page.tsx      → composes all the above into the grid layout described in Section 1
```

Use a CSS grid on the main content area: stat cards + activity feed form the top section (stat cards in a 3-column sub-grid on the left spanning 2/3 width, activity feed card spanning the remaining 1/3 on the right, full height of that row), trend chart card full-width below, data table card full-width at the bottom.

Use **Recharts** for the sparklines and bar chart, restyled to match this minimal aesthetic (no default chart-library look — remove borders, use custom tooltip, thin/rounded bars).

---

## 7. Interactions to Implement
- Sidebar nav items expand/collapse submenus on click (chevron rotates)
- Tab switcher (Today/Yesterday/This week) changes active state and filters the activity list
- Table columns sortable on header click
- Table rows selectable via checkbox, with a "select all" checkbox in the header
- Hovering a bar in the trend chart shows the tooltip pill with that day's value
- All buttons/inputs have visible hover and focus states

---

## 8. Remaining Dashboard Pages

Every page below shares the same shell: same sidebar (with the matching nav item shown active), same header pattern (breadcrumb + greeting-style or plain title + subtext + action icons on the right), same white-card-on-gray-background surface, same design tokens from Section 5. Only the content inside the main area changes. Reuse `StatCard`, `DataTableCard`, `StatusBadge`, `PriorityBadge`, `Avatar` wherever the content fits those shapes — don't invent new visual language per page.

### 8a. Tickets → `/dashboard/tickets` (and `/all`, `/sla-breach-risk`, `/escalations`)
- Header: breadcrumb "Overview / Tickets", title "All Tickets", subtext "Manage and track every customer ticket in one place"
- Row of 3 StatCards: "Open Tickets", "Avg. First Response", "Breached SLA" (reuse Section 4a component exactly)
- Filter bar above the table: search input, "Priority" dropdown, "Status" dropdown, "Assigned To" dropdown, "Filter" button — all pill-shaped, outlined, same style as the Filter button in Section 4d
- Full-width DataTableCard reusing the exact same table structure/columns as Section 4d ("SLA Monitoring"), just titled "All Tickets" with the full unfiltered list
- Sub-pages (`SLA Breach Risk`, `Escalations`) are the same table component pre-filtered, with the title and an extra "Risk Level" or "Escalated By" column swapped in

### 8b. Clients → `/dashboard/clients`
- Header: "Overview / Clients", title "Clients", subtext "All companies and contacts you support"
- Row of 3 StatCards: "Total Clients", "Active This Month", "Avg. CSAT per Client"
- Content switches to a **card-grid layout** instead of a table: each client is a white rounded card with company logo/initial avatar (square, rounded-lg, colored background), company name bold, small muted "X open tickets · Y agents assigned" line, and a small CSAT score badge top-right (colored pill: green ≥90, amber 70–89, red <70)
- Grid: 3–4 columns on desktop, cards same padding/border/shadow language as everything else
- A view-toggle icon pair (grid/list) top-right of this section, matching the icon-button style from Section 3

### 8c. Agents & Teams → `/dashboard/agents`
- Header: "Overview / Agents & Teams", title "Agents & Teams"
- Row of 3 StatCards: "Total Agents", "Avg. Resolution Time", "Team Utilization %"
- DataTableCard titled "Agent Performance" with columns: Agent (avatar + name), Team, Open Tickets, Resolved This Week, Avg. CSAT, Status (Online/Away/Offline as a colored dot + label, reusing StatusBadge pattern)

### 8d. Knowledge Base → `/dashboard/knowledge-base`
- Header: "Overview / Knowledge Base", title "Knowledge Base", subtext "Manage help center articles"
- Search bar front and center below the header, large pill input with search icon (bigger than the sidebar search, this is the primary action on the page)
- Card-grid of articles (same white-card language): each card shows a category tag pill top-left, article title bold, muted 1-line excerpt, and a footer row with "Last updated" date + small view-count icon+number
- Small category filter pills row above the grid (e.g., "All", "Billing", "Login Issues", "Integrations") — active pill dark-filled, inactive outlined, same pill treatment as the Today/Yesterday tabs in Section 4b

### 8e. Integrations → `/dashboard/integrations`
- Header: "Overview / Integrations", title "Integrations", subtext "Connect the tools your team already uses"
- Grid of integration cards: square logo tile (rounded-xl, white bg, border, centered logo), integration name bold, one-line description, and a right-aligned action — either a "Connect" outlined button or a "Connected" state (green dot + label + small settings gear icon) matching StatusBadge coloring
- Optional category tabs above the grid: "All", "Communication", "CRM", "Automation"

### 8f. SLA Compliance → `/dashboard/sla-compliance`
- Header: "Overview / SLA Compliance", title "SLA Compliance", subtext "Track how well your team is meeting SLA targets"
- Row of 3 StatCards: "Overall Compliance", "Breaches This Week", "At Risk"
- Full-width TrendChartCard (reuse Section 4c exactly) titled "Compliance Rate Trend" showing a line instead of bars if it better communicates a rate over time — same dashed reference line + tooltip pill pattern
- DataTableCard below: "Tickets at Risk" using the same table shape as 4d, with an extra "Time to Breach" column color-coded like SLA Due

### 8g. CSAT & NPS → `/dashboard/csat-nps`
- Header: "Overview / CSAT & NPS", title "CSAT & NPS", subtext "Customer satisfaction and loyalty scores"
- Row of 3 StatCards: "Avg. CSAT", "NPS Score", "Response Rate"
- Two side-by-side cards below (each half-width): a donut/pie chart card "CSAT Breakdown" (Recharts, restyled per Section 6) and a horizontal bar chart card "NPS Distribution" (Detractors/Passives/Promoters, color-coded red/gray/green)
- Activity-feed-style card at the bottom titled "Recent Feedback" reusing the Section 4b list-row pattern (avatar, name, rating stars instead of icon badge, comment text, timestamp)

### 8h. Workload Analytics → `/dashboard/workload-analytics`
- Header: "Overview / Workload Analytics", title "Workload Analytics", subtext "See how ticket load is distributed across your team"
- Row of 3 StatCards: "Avg. Tickets per Agent", "Overloaded Agents", "Team Capacity"
- Full-width chart card: horizontal bar chart, one bar per agent (avatar next to each bar label), color-coded by load (green under capacity, amber near capacity, red over capacity)

### 8i. Reports → `/dashboard/reports`
- Header: "Overview / Reports", title "Reports", subtext "Generate and export custom reports"
- Row of filter pills / dropdowns: date range, report type, team — same pill style as elsewhere
- List of saved/recent report cards: each a horizontal white card row with a report-type icon in a colored circular badge, report name bold, muted "Generated on [date] · [range]" subtext, and a right-aligned "Download" icon-button + `⋮` overflow menu
- A prominent "+ New Report" button top-right of the header, dark-filled, matching primary button style

### 8j. Settings → `/dashboard/settings`
- Header: "Overview / Settings", title "Settings"
- Left sub-navigation within the page (a slim secondary tab list, not the main sidebar): "Profile", "Notifications", "Team", "Billing", "Integrations", "Security" — vertical list, same active/inactive treatment as main sidebar nav items but smaller
- "Profile" panel (default view): white card with avatar upload (circular, edit-pencil overlay icon on hover), form fields (Name, Email, Role) using the input style from Section 2's search bar, "Save Changes" primary dark button bottom-right of the card
- "Notifications" panel: list of toggle rows (label + description on the left, iOS-style switch on the right)

---

## 9. Auth Pages

Same design tokens (Section 5), but **no sidebar** — auth pages are centered, minimal, single-column. Two layout options described below; use the **split-screen layout** as the primary style since it best matches this product's polish level.

### Shared auth layout
- **Left half** (~45% width, desktop only, hidden on mobile): a full-height panel in a dark near-black background (matching the sidebar's active-state color), containing the Kravio logo mark top-left, a large bold headline + supporting muted paragraph (light gray/white text) about the product, and either a stylized product screenshot mockup (a scaled-down, slightly rotated preview of the dashboard, in a white rounded card with shadow, floating over the dark panel) or a simple abstract geometric pattern for visual interest
- **Right half**: white/neutral-100 background, centered form column (max-width ~400px), vertically centered
- Form column top: logo mark (small, centered or left-aligned above the form)
- Form heading: bold `text-2xl`, e.g., "Welcome back" / "Create your account"
- Muted subtext line below heading, e.g., "Enter your details to sign in to your account"
- Form inputs: same pill/rounded-lg input style as the sidebar search bar — label above each input (`text-sm font-medium text-neutral-700`), input with `border-neutral-200 rounded-lg px-4 py-2.5`, focus state with a subtle dark ring
- Primary button: full-width, dark-filled (`bg-neutral-900 text-white rounded-lg py-2.5 font-medium`), matches the "+ New Report" / "Save Changes" primary button style used elsewhere
- Divider row: horizontal line with centered muted text "or continue with"
- Secondary/OAuth buttons: full-width, white background, outlined border, icon (Google) + label, same rounded-lg treatment, `hover:bg-neutral-50`
- Footer link below the form: muted text + bold link, e.g., "Don't have an account? **Sign up**"

### 9a. Login → `/login`
- Heading: "Welcome back 👋"
- Fields: Email, Password (with a show/hide eye icon inside the input, right-aligned)
- Row between password field and submit button: "Remember me" checkbox (left) + "Forgot password?" link (right, muted, right-aligned)
- Primary button: "Sign In"
- OAuth: "Continue with Google"
- Footer: "Don't have an account? Sign up"

### 9b. Sign Up → `/signup`
- Heading: "Create your account"
- Fields: Full Name, Email, Password, Confirm Password
- Small password-strength indicator below the Password field: a thin 3-segment bar that fills/colors (red → amber → green) as the user types, plus a muted helper line like "Use 8+ characters with a mix of letters and numbers"
- Checkbox row: "I agree to the Terms of Service and Privacy Policy" (small, muted text with bold inline links)
- Primary button: "Create Account"
- OAuth: "Continue with Google"
- Footer: "Already have an account? Sign in"

### 9c. Forgot Password → `/forgot-password`
- Simpler single-step, no split-screen dark panel needed — center the form column alone on a plain neutral-100 background, still constrained to ~400px width, everything else (logo, spacing, input style, button style) identical
- Heading: "Forgot your password?"
- Subtext: "Enter your email and we'll send you a link to reset your password"
- Field: Email only
- Primary button: "Send Reset Link"
- Footer link: "← Back to Sign In" (with a left-arrow icon, muted, left-aligned under the button)

### 9d. Reset Password → `/reset-password`
- Same minimal single-column layout as Forgot Password
- Heading: "Set a new password"
- Fields: New Password, Confirm Password (both with show/hide eye icons), same password-strength indicator as Sign Up
- Primary button: "Reset Password"

---

## 10. Updated Component/File Structure

```
/components/dashboard/
  Sidebar.tsx
  Header.tsx
  StatCard.tsx
  ActivityFeedCard.tsx
  TrendChartCard.tsx
  DataTableCard.tsx
  StatusBadge.tsx
  PriorityBadge.tsx
  Avatar.tsx
  FilterBar.tsx
  ClientCard.tsx
  ArticleCard.tsx
  IntegrationCard.tsx
  ReportRow.tsx
  SettingsSubNav.tsx
  ToggleRow.tsx
/components/auth/
  AuthLayout.tsx          → the split-screen shell used by login/signup
  AuthFormShell.tsx        → the plain centered shell used by forgot/reset password
  PasswordStrengthBar.tsx
  OAuthButton.tsx
/app/
  /(auth)/login/page.tsx
  /(auth)/signup/page.tsx
  /(auth)/forgot-password/page.tsx
  /(auth)/reset-password/page.tsx
  /dashboard/page.tsx
  /dashboard/tickets/page.tsx
  /dashboard/tickets/sla-breach-risk/page.tsx
  /dashboard/tickets/escalations/page.tsx
  /dashboard/clients/page.tsx
  /dashboard/agents/page.tsx
  /dashboard/knowledge-base/page.tsx
  /dashboard/integrations/page.tsx
  /dashboard/sla-compliance/page.tsx
  /dashboard/csat-nps/page.tsx
  /dashboard/workload-analytics/page.tsx
  /dashboard/reports/page.tsx
  /dashboard/settings/page.tsx
```

**Consistency rule for the agent building this**: before creating any new visual pattern for a page in Section 8, check whether `StatCard`, `DataTableCard`, `StatusBadge`, `PriorityBadge`, or the card-grid pattern from Section 8b already covers it. Every page should feel like it belongs to the same product — same spacing scale, same border/shadow weight, same pill/badge shapes, same icon set — never introduce a new radius, shadow depth, or color outside Section 5's tokens.
