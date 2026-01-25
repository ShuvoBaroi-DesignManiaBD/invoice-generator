-- Create Invoices Table
create table invoices (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_name text not null,
  amount numeric not null,
  status text check (status in ('draft', 'pending', 'paid', 'overdue')) default 'draft',
  currency text default 'USD',
  data jsonb,
  user_id uuid references auth.users not null,
  client_id uuid references clients(id)
);

-- Index for client_id
create index invoices_client_id_idx on invoices(client_id);

-- Enable Row Level Security (RLS)
alter table invoices enable row level security;

-- Create Policy: Allow users to select only their own invoices
create policy "Select own invoices" on invoices
  for select using (auth.uid() = user_id);

-- Create Policy: Allow users to insert their own invoices
create policy "Insert own invoices" on invoices
  for insert with check (auth.uid() = user_id);

-- Create Policy: Allow users to update their own invoices
create policy "Update own invoices" on invoices
  for update using (auth.uid() = user_id);

-- Create Policy: Allow users to delete their own invoices
create policy "Delete own invoices" on invoices
  for delete using (auth.uid() = user_id);

-- Create Clients Table
create table clients (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text,
  address text,
  phone text,
  vat_number text,
  reg_number text,
  user_id uuid references auth.users not null
);

-- Enable RLS for clients
alter table clients enable row level security;

-- Create Policies for clients
create policy "Select own clients" on clients
  for select using (auth.uid() = user_id);

create policy "Insert own clients" on clients
  for insert with check (auth.uid() = user_id);

create policy "Update own clients" on clients
  for update using (auth.uid() = user_id);

create policy "Delete own clients" on clients
  for delete using (auth.uid() = user_id);
