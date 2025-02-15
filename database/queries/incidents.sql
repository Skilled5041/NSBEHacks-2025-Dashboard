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