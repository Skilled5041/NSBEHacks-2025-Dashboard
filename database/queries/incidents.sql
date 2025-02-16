-- name: GetAllIncidents :many
select * from incidents;

-- name: GetTotalIncidentsCount :one
select count(*) from incidents;

-- name: GetResolvedIncidentsCount :one
select count(*) from incidents where status = 'resolved';

-- name: GetOngoingIncidentsCount :one
select count(*) from incidents where status = 'ongoing';

-- name: GetPendingIncidentsCount :one
select count(*) from incidents where status = 'pending';

-- name: GetAllIncidentById :one
select * from incidents where id = $1;

-- name: CreateIncident :one
insert into incidents (incident_name, victim_name, gps_coordinates, incident_time, status)
values ($1, $2, $3, $4, $5)
returning *;

-- name: ResolveIncident :one
update incidents
set status = 'resolved', incident_end_time = $1
where id = $2
returning *;

-- name: GetNewIncidents :one
select * from incidents where incident_time > $1;

-- name: GetAllUnresolvedIncidents :many
select * from incidents where status != 'resolved';

-- name: UpdateIncidentStatus :one
update incidents set status = $1 where id = $2 returning *;

-- name: AddIncidentLocation :one
insert into incident_locations (incident_id, gps_coordinates, location_time)
values ($1, $2, $3)
returning *;

-- name: GetIncidentLocations :many
select * from incident_locations where incident_id = $1;

-- name: GetNewIncidentLocations :many
select * from incident_locations where location_time > $1;

-- name: CreateIncidentContact :one
insert into emergency_contacts (incident_id, contact_name, contact_number, contact_email)
values ($1, $2, $3, $4)
returning *;

-- name: AddIncidentAudio :one
insert into audio (incident_id, audio_url, audio_timestamp)
values ($1, $2, $3)
returning id, incident_id, audio_url, audio_timestamp;

-- name: CreateAnalysis :one
insert into analysis (incident_id, sentiment, threat_level, situation_summary, action_recommendation, detected_sounds)
values ($1, $2, $3, $4, $5, $6)
returning *;