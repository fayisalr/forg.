-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Extended from auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text check (role in ('admin', 'staff', 'accounts')) not null default 'staff',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CLIENTS
create table clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  company text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROJECTS
create table projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  client_id uuid references clients(id) on delete set null,
  status text check (status in ('pending', 'active', 'completed')) default 'pending',
  start_date date,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TASKS
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  assigned_to uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  due_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DAILY UPDATES
create table daily_updates (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references profiles(id) on delete cascade not null,
  date date not null default current_date,
  update_text text not null,
  hours_worked numeric(4,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INCOMES
create table incomes (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete set null,
  amount numeric(10,2) not null,
  date date not null default current_date,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EXPENSES
create table expenses (
  id uuid primary key default uuid_generate_v4(),
  amount numeric(10,2) not null,
  date date not null default current_date,
  description text not null,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVOICES
create table invoices (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  invoice_number serial,
  status text check (status in ('draft', 'sent', 'paid')) default 'draft',
  issue_date date not null default current_date,
  due_date date,
  total_amount numeric(10,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVOICE ITEMS
create table invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references invoices(id) on delete cascade not null,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(10,2) not null,
  total numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PORTFOLIO (Public Website)
create table portfolio (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type text check (type in ('photo', 'video')) not null,
  url text not null,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SERVICES (Public Website)
create table services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS setup (Example policies)
alter table profiles enable row level security;
alter table clients enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table daily_updates enable row level security;
alter table incomes enable row level security;
alter table expenses enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table portfolio enable row level security;
alter table services enable row level security;

-- Basic allow all for authenticated users temporarily (for prototyping)
create policy "Allow all for authenticated users" on profiles for all to authenticated using (true);
create policy "Allow all for authenticated users" on clients for all to authenticated using (true);
create policy "Allow all for authenticated users" on projects for all to authenticated using (true);
create policy "Allow all for authenticated users" on tasks for all to authenticated using (true);
create policy "Allow all for authenticated users" on daily_updates for all to authenticated using (true);
create policy "Allow all for authenticated users" on incomes for all to authenticated using (true);
create policy "Allow all for authenticated users" on expenses for all to authenticated using (true);
create policy "Allow all for authenticated users" on invoices for all to authenticated using (true);
create policy "Allow all for authenticated users" on invoice_items for all to authenticated using (true);
create policy "Allow all for authenticated users on portfolio" on portfolio for all to authenticated using (true);
create policy "Allow all for authenticated users on services" on services for all to authenticated using (true);

create policy "Allow public read" on portfolio for select to anon using (is_public = true);
create policy "Allow public read" on services for select to anon using (is_active = true);
