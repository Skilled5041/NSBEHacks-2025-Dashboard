create table if not exists public.incidents (
    id uuid primary key default uuid_generate_v4(),
    incident_name text not null,
    victim_name text not null,
    gps_coordinates text not null,
    incident_time timestamptz not null,
    incident_end_time timestamptz,
    status text not null check (status in ('resolved', 'ongoing', 'pending'))
);

create table if not exists public.incident_locations (
    id uuid primary key default uuid_generate_v4(),
    incident_id uuid references incidents(id) on delete cascade,
    gps_coordinates text not null,
    location_time timestamptz not null default now()
);

create table if not exists public.emergency_contacts (
    id uuid primary key default uuid_generate_v4(),
    incident_id uuid references incidents(id) on delete cascade,
    contact_name text,
    contact_number text,
    contact_email text
);