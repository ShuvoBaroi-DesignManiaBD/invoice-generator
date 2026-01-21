# Modern Invoice Generator

A professional, responsive, and full-featured invoice generator built with Next.js 16+, Shadcn UI, and Supabase.

## Features

- **Authentication**: Secure login and signup powered by Supabase Auth.
- **Dashboard**: Overview of recent invoices with status indicators.
- **Invoice Management**: Create, edit, and delete invoices.
- **Dynamic Template**: Add/remove line items, calculate taxes and discounts automatically.
- **PDF Generation**: Generate and download professional PDF invoices client-side.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Dark Mode**: Built-in dark/light mode toggle.
- **Form Validation**: Robust form handling with Zod and React Hook Form.

## Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org) (App Router)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Database/Auth**: [Supabase](https://supabase.com)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (available for global state)
- **PDF**: [React-PDF](https://react-pdf.org/)
- **Testing**: [Vitest](https://vitest.dev)

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- Supabase Account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   *Note: If you don't have Supabase credentials yet, the app includes a mock mode for demonstration.*

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema (Supabase)

The application expects the following table structure:

- **invoices**
  - `id` (uuid, primary key)
  - `created_at` (timestamptz)
  - `client_name` (text)
  - `amount` (numeric)
  - `status` (text: 'draft', 'pending', 'paid', 'overdue')
  - `currency` (text)
  - `data` (jsonb) - *Optional: store full invoice JSON here*

## Testing

Run the test suite with:

```bash
npm run test
# or
npx vitest run
```

## License

MIT
