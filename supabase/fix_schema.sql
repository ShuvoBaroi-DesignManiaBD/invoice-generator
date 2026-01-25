-- Add client_id to invoices if it doesn't exist
do $$ 
begin 
    if not exists (select 1 from information_schema.columns where table_name = 'invoices' and column_name = 'client_id') then
        alter table invoices add column client_id uuid references clients(id);
        create index invoices_client_id_idx on invoices(client_id);
    end if;
end $$;

-- Ensure RLS is enabled on clients
alter table clients enable row level security;

-- Drop existing policies to avoid conflicts and recreate them
drop policy if exists "Select own clients" on clients;
drop policy if exists "Insert own clients" on clients;
drop policy if exists "Update own clients" on clients;
drop policy if exists "Delete own clients" on clients;

-- Create Policies for clients
create policy "Select own clients" on clients
  for select using (auth.uid() = user_id);

create policy "Insert own clients" on clients
  for insert with check (auth.uid() = user_id);

create policy "Update own clients" on clients
  for update using (auth.uid() = user_id);

create policy "Delete own clients" on clients
  for delete using (auth.uid() = user_id);
