create table if not exists public.incidents (
    id uuid primary key default uuid_generate_v4(),
    incident_name text not null,
    victim_name text not null,
    gps_coordinates text not null,
    incident_time timestamptz not null,
    status text not null check (status in ('resolved', 'ongoing', 'pending'))
);