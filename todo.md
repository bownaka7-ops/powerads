# Social Ads SaaS Platform - TODO

## Database & Backend
- [x] Update drizzle/schema.ts with full schema (credits, campaigns, ads, media_files, social_connections, notifications, billing)
- [x] Generate and apply migration SQL
- [x] Add db.ts query helpers for all tables
- [x] Add tRPC procedures in routers.ts (credits, campaigns, analytics, media, settings, notifications)

## Frontend Pages
- [x] Global dark theme setup in index.css + App.tsx
- [x] Landing Page (Home.tsx) - luxury dark design with Manus OAuth login/register
- [x] DashboardLayout with sidebar navigation (collapsible, resizable)
- [x] Dashboard page - overview stats, credits, campaigns, AreaChart
- [x] Campaigns List page
- [x] Campaign Details page
- [x] Create Campaign page
- [x] Credit Top-up page
- [x] Billing History page
- [x] Analytics page with charts (Area, Bar, Pie, Line)
- [x] Performance Reports page
- [x] Media Gallery page with drag-drop upload
- [x] Settings page (Social Media connections: Meta, TikTok, YouTube)
- [x] Notifications page (mark read, mark all read, type icons)

## App.tsx Routes
- [x] Wire all routes in App.tsx

## Notification System
- [x] Owner notifications via notifyOwner() on key events
- [x] User notifications: topup_success, campaign_started, system
- [x] Unread badge in sidebar bell icon

## Testing
- [x] Write vitest tests for key procedures (11 tests passing)
- [x] Test responsive design (mobile top bar)
- [x] Test all navigation flows

## Checkpoint
- [x] Save final checkpoint
