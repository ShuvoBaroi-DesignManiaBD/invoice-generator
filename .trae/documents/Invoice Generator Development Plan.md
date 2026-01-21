# Modern Invoice Generator Development Plan

## 1. Project Initialization & Configuration
- Initialize Next.js 16+ project with TypeScript, Tailwind CSS, and ESLint.
- Configure `shadcn/ui` for component management.
- Set up environment variables for Supabase (URL, Anon Key).
- Configure `next-themes` for Dark/Light mode support.

## 2. Dependencies Installation
- **UI/Icons**: `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`.
- **State Management**: `zustand` for global app state.
- **Form Handling**: `react-hook-form`, `zod`, `@hookform/resolvers` for schema validation.
- **Backend/Auth**: `@supabase/supabase-js`, `@supabase/ssr` for authentication and database interactions.
- **PDF Generation**: `@react-pdf/renderer` for creating invoice PDFs.
- **Utilities**: `date-fns` for date formatting, `sonner` for toast notifications.
- **Testing**: `vitest`, `@testing-library/react` for unit/integration testing.

## 3. Core Architecture Implementation
- **Authentication**:
  - Implement Supabase Auth (Email/Password).
  - Create Login and Signup pages.
  - Set up `middleware.ts` (or `proxy.ts` in Next.js 16) for protected routes.
- **Database Service**:
  - Create Supabase client utilities for Server and Client components.
  - Define TypeScript interfaces for `Invoice`, `Client`, and `Profile` models.
- **State Store**:
  - Create Zustand store for managing invoice form state (items, calculations).

## 4. UI Component Development
- Install and customize base Shadcn components:
  - `Button`, `Input`, `Textarea`, `Card`, `Table`, `Dialog`
  - `Select`, `DatePicker`, `DropdownMenu`, `Form`
- Develop feature-specific components:
  - `InvoiceForm`: Dynamic form with field arrays for line items.
  - `InvoicePreview`: Real-time visual representation of the invoice.
  - `DashboardTable`: List view of invoices with status filters.
  - `PDFDocument`: React-PDF layout for the downloadable file.

## 5. Feature Implementation
- **Dashboard**:
  - Fetch and display user's invoices.
  - Implement search and filter functionality.
- **Invoice Management**:
  - **Create**: Form to add client details, line items (desc, qty, price), tax, and discount.
  - **Edit**: Load existing invoice data into the form for updates.
  - **Delete**: Confirmation dialog and removal logic.
- **PDF Generation**:
  - Implement client-side PDF generation and download trigger.
  - Ensure PDF layout matches the visual preview.

## 6. Testing & Quality Assurance
- Configure Vitest environment.
- Write unit tests for:
  - Utility functions (tax/total calculations).
  - Form validation logic.
  - Core UI components.
- Perform responsive design checks for mobile/desktop.
- Audit accessibility (WCAG) compliance.

## 7. Final Polish & Documentation
- Optimize SEO metadata.
- Create comprehensive `README.md` with setup and deployment guide.
- Generate Style Guide documentation.
