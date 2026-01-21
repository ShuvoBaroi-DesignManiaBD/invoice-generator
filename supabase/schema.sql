-- Create Invoices Table
create table invoices (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_name text not null,
  amount numeric not null,
  status text check (status in ('draft', 'pending', 'paid', 'overdue')) default 'draft',
  currency text default 'USD',
  data jsonb
);

-- Enable Row Level Security (RLS)
alter table invoices enable row level security;

-- Create Policy: Allow all operations for authenticated users (for simplicity in this demo)
-- In production, you would want to restrict this to the user's own invoices
create policy "Enable all for authenticated users" on invoices
  for all using (auth.role() = 'authenticated');
