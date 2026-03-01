-- ============================================================================
-- TravelHub – Initial Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================================

-- 1. Profiles (auto-created on sign-up via trigger)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  share_with_family boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. User Roles
create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  unique (user_id)
);

alter table user_roles enable row level security;

create policy "Users can view own role"
  on user_roles for select using (auth.uid() = user_id);

-- 3. Trips
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  destination_city text,
  destination_country text,
  country_code text,
  color text,
  status text not null default 'upcoming' check (status in ('upcoming', 'ongoing', 'completed')),
  notes text,
  source text,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table trips enable row level security;

create policy "Users can view own trips"
  on trips for select using (auth.uid() = user_id);

create policy "Users can insert own trips"
  on trips for insert with check (auth.uid() = user_id);

create policy "Users can update own trips"
  on trips for update using (auth.uid() = user_id);

create policy "Users can delete own trips"
  on trips for delete using (auth.uid() = user_id);

-- 4. Flights
create table if not exists flights (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips on delete cascade not null,
  flight_number text not null,
  airline text,
  operating_airline text,
  departure_airport text not null,
  arrival_airport text not null,
  departure_time timestamptz not null,
  arrival_time timestamptz not null,
  actual_departure_time timestamptz,
  actual_arrival_time timestamptz,
  aircraft_type text,
  duration_minutes integer,
  distance_km integer,
  gate text,
  terminal text,
  booking_reference text,
  codeshare_partners text[],
  display_order integer,
  source text,
  notes text,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz not null default now()
);

alter table flights enable row level security;

create policy "Users can view own flights"
  on flights for select using (auth.uid() = user_id);

create policy "Users can insert own flights"
  on flights for insert with check (auth.uid() = user_id);

create policy "Users can update own flights"
  on flights for update using (auth.uid() = user_id);

create policy "Users can delete own flights"
  on flights for delete using (auth.uid() = user_id);

-- 5. Hotels
create table if not exists hotels (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips on delete cascade not null,
  name text not null,
  address text,
  city text,
  country text,
  check_in date not null,
  check_out date not null,
  booking_reference text,
  rating integer,
  review_notes text,
  display_order integer,
  source text,
  notes text,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz not null default now()
);

alter table hotels enable row level security;

create policy "Users can view own hotels"
  on hotels for select using (auth.uid() = user_id);

create policy "Users can insert own hotels"
  on hotels for insert with check (auth.uid() = user_id);

create policy "Users can update own hotels"
  on hotels for update using (auth.uid() = user_id);

create policy "Users can delete own hotels"
  on hotels for delete using (auth.uid() = user_id);

-- 6. Restaurants
create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips on delete cascade not null,
  name text not null,
  address text,
  city text,
  country text,
  reservation_date date,
  reservation_time time,
  party_size integer,
  booking_reference text,
  rating integer,
  review_notes text,
  display_order integer,
  source text,
  notes text,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz not null default now()
);

alter table restaurants enable row level security;

create policy "Users can view own restaurants"
  on restaurants for select using (auth.uid() = user_id);

create policy "Users can insert own restaurants"
  on restaurants for insert with check (auth.uid() = user_id);

create policy "Users can update own restaurants"
  on restaurants for update using (auth.uid() = user_id);

create policy "Users can delete own restaurants"
  on restaurants for delete using (auth.uid() = user_id);

-- 7. Transports
create table if not exists transports (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips on delete cascade not null,
  name text not null,
  pickup_time timestamptz,
  pickup_location text,
  dropoff_location text,
  driver_name text,
  driver_phone text,
  booking_reference text,
  display_order integer,
  source text,
  notes text,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz not null default now()
);

alter table transports enable row level security;

create policy "Users can view own transports"
  on transports for select using (auth.uid() = user_id);

create policy "Users can insert own transports"
  on transports for insert with check (auth.uid() = user_id);

create policy "Users can update own transports"
  on transports for update using (auth.uid() = user_id);

create policy "Users can delete own transports"
  on transports for delete using (auth.uid() = user_id);

-- 8. Loyalty Programs
create table if not exists loyalty_programs (
  id uuid primary key default gen_random_uuid(),
  program_name text not null,
  program_type text not null default 'other' check (program_type in ('airline', 'hotel', 'other')),
  membership_number text,
  tier_status text,
  notes text,
  user_id uuid references auth.users on delete cascade not null,
  guest_traveler_id uuid,
  created_at timestamptz not null default now()
);

alter table loyalty_programs enable row level security;

create policy "Users can view own loyalty programs"
  on loyalty_programs for select using (auth.uid() = user_id);

create policy "Users can insert own loyalty programs"
  on loyalty_programs for insert with check (auth.uid() = user_id);

create policy "Users can update own loyalty programs"
  on loyalty_programs for update using (auth.uid() = user_id);

create policy "Users can delete own loyalty programs"
  on loyalty_programs for delete using (auth.uid() = user_id);

-- 9. Visited Countries
create table if not exists visited_countries (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  country_name text not null,
  first_visited date,
  visit_count integer not null default 1,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz not null default now()
);

alter table visited_countries enable row level security;

create policy "Users can view own visited countries"
  on visited_countries for select using (auth.uid() = user_id);

create policy "Users can insert own visited countries"
  on visited_countries for insert with check (auth.uid() = user_id);

create policy "Users can update own visited countries"
  on visited_countries for update using (auth.uid() = user_id);

-- 10. Guest Travelers
create table if not exists guest_travelers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  avatar_url text,
  created_by uuid references auth.users on delete cascade not null,
  created_at timestamptz not null default now()
);

alter table guest_travelers enable row level security;

create policy "Users can view own guest travelers"
  on guest_travelers for select using (auth.uid() = created_by);

create policy "Users can insert own guest travelers"
  on guest_travelers for insert with check (auth.uid() = created_by);

-- 11. Shared Trips
create table if not exists shared_trips (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips on delete cascade not null,
  token text not null unique,
  created_by uuid references auth.users on delete cascade not null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table shared_trips enable row level security;

create policy "Users can view own shared trips"
  on shared_trips for select using (auth.uid() = created_by);

create policy "Users can insert own shared trips"
  on shared_trips for insert with check (auth.uid() = created_by);

-- 12. Family Invitations
create table if not exists family_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  invited_by uuid references auth.users on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);

alter table family_invitations enable row level security;

create policy "Users can view own invitations"
  on family_invitations for select using (auth.uid() = invited_by);

create policy "Users can insert own invitations"
  on family_invitations for insert with check (auth.uid() = invited_by);

-- 13. Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  type text not null,
  title text not null,
  body text,
  data jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table notifications enable row level security;

create policy "Users can view own notifications"
  on notifications for select using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update using (auth.uid() = user_id);
