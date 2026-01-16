# NailPro Inventory Management Platform

A comprehensive SaaS inventory management solution designed specifically for beauty nail salon owners in New Jersey and New York. Built with React, TypeScript, Supabase, and Tailwind CSS.

## Features

### Core Functionality
- **Multi-tenant Architecture**: Secure organization-based data isolation
- **Authentication System**: Email/password signup and login with Supabase Auth
- **Role-based Access Control**: Owner, Manager, and Staff roles with granular permissions
- **Multi-location Support**: Manage inventory across multiple salon locations

### Inventory Management
- Product catalog with nail salon-specific categorization
- SKU and barcode tracking
- Real-time stock level monitoring per location
- Low stock and out-of-stock alerts
- Stock movement audit trail
- Reorder point automation

### Purchase Orders
- Create and track purchase orders
- Order status workflow (draft → pending → approved → ordered → shipped → received)
- Supplier management with ratings and contact information
- Order history and reporting

### Supplier Discovery
- Local supplier database with contact details
- Google Maps integration ready for location-based discovery
- Supplier rating and review system
- Price comparison across suppliers

### Analytics & Reporting
- Dashboard with key metrics and KPIs
- Inventory turnover analysis
- Spending trends and cost analysis
- Top-selling products tracking
- Weekly analytics reports (coming soon)

### Team Management
- Invite and manage team members
- Role-based permissions (Owner, Manager, Staff)
- User activity tracking
- Team member profiles

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom component library with shadcn/ui inspiration
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v7
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card, Badge)
│   └── layout/         # Layout components (AppLayout, Header, Sidebar)
├── features/           # Feature-based modules
│   ├── auth/           # Authentication (Login, Signup)
│   ├── dashboard/      # Main dashboard
│   ├── inventory/      # Product and stock management
│   ├── orders/         # Purchase order management
│   ├── suppliers/      # Supplier management
│   ├── alerts/         # Inventory alerts
│   ├── analytics/      # Reports and analytics
│   ├── team/           # Team member management
│   └── settings/       # User and business settings
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── supabase/       # Supabase client configuration
│   └── utils/          # Helper functions
└── types/              # TypeScript type definitions
```

## Database Schema

### Core Tables
- **organizations**: Business entities
- **locations**: Physical salon locations
- **user_profiles**: User information and roles

### Inventory Tables
- **categories**: Product categories (hierarchical)
- **products**: Product catalog with nail salon specifics
- **stock_levels**: Current stock per product per location
- **stock_movements**: Audit trail of all inventory changes

### Supplier & Order Tables
- **suppliers**: Supplier information and contacts
- **purchase_orders**: Order headers with status workflow
- **purchase_order_items**: Order line items
- **inventory_alerts**: System-generated alerts

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (database is already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### Database Migrations

All database migrations are in `supabase/migrations/`:
- `create_organizations_and_users.sql` - Core user and organization tables
- `create_inventory_tables.sql` - Product and inventory management
- `create_suppliers_and_orders.sql` - Supplier and purchase order system
- `optimize_indexes_and_rls_policies.sql` - Performance and security optimizations

## Security

- **Row Level Security (RLS)**: All tables have RLS enabled with optimized policies
- **Multi-tenant Isolation**: Organizations cannot access each other's data
- **Role-based Permissions**: Fine-grained access control per user role
- **Optimized Auth Queries**: All RLS policies use `(select auth.uid())` for performance
- **Foreign Key Indexes**: All foreign keys are properly indexed

## Features Roadmap

### Phase 1: MVP (Current)
- ✅ Core inventory tracking and order management
- ✅ Authentication and user management
- ✅ Multi-location support
- ✅ Basic analytics dashboard

### Phase 2: Enhanced Features
- [ ] Google Maps API integration for supplier discovery
- [ ] Receipt OCR processing with image upload
- [ ] Bulk CSV/Excel import
- [ ] Barcode scanning (mobile)
- [ ] Email notifications for alerts
- [ ] Weekly analytics reports

### Phase 3: Advanced Features
- [ ] Stripe subscription billing
- [ ] Anonymous data aggregation platform
- [ ] Price intelligence network
- [ ] AI-powered demand forecasting
- [ ] Mobile app (iOS/Android)
- [ ] API for third-party integrations

## Contributing

This is a private SaaS project. For inquiries, please contact the development team.

## License

Proprietary - All rights reserved
