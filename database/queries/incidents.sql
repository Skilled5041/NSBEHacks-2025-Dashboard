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
insert into incidents (incident_name, victim_name, gps_coordinates, incident_time, status) values ($1, $2, $3, $4, $5) returning *;

-- name: ResolveIncident :one
update incidents set status = 'resolved', incident_end_time = $1 where id = $2 returning *;

-- name: GetNewIncidents :one
select * from incidents where incident_time > $1;

-- name: GetAllUnresolvedIncidents :many
select * from incidents where status != 'resolved';

-- name: UpdateIncidentStatus :one
update incidents set status = $1 where id = $2 returning *;