import { Sql } from "postgres";

export const getAllIncidentsQuery = `-- name: GetAllIncidents :many
select id, incident_name, victim_name, gps_coordinates, incident_time, incident_end_time, status from incidents`;

export interface GetAllIncidentsRow {
    id: string;
    incidentName: string;
    victimName: string;
    gpsCoordinates: string;
    incidentTime: Date;
    incidentEndTime: Date | null;
    status: string;
}

export async function getAllIncidents(sql: Sql): Promise<GetAllIncidentsRow[]> {
    return (await sql.unsafe(getAllIncidentsQuery, []).values()).map(row => ({
        id: row[0],
        incidentName: row[1],
        victimName: row[2],
        gpsCoordinates: row[3],
        incidentTime: row[4],
        incidentEndTime: row[5],
        status: row[6]
    }));
}

export const getTotalIncidentsCountQuery = `-- name: GetTotalIncidentsCount :one
select count(*) from incidents`;

export interface GetTotalIncidentsCountRow {
    count: string;
}

export async function getTotalIncidentsCount(sql: Sql): Promise<GetTotalIncidentsCountRow | null> {
    const rows = await sql.unsafe(getTotalIncidentsCountQuery, []).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        count: row[0]
    };
}

export const getResolvedIncidentsCountQuery = `-- name: GetResolvedIncidentsCount :one
select count(*) from incidents where status = 'resolved'`;

export interface GetResolvedIncidentsCountRow {
    count: string;
}

export async function getResolvedIncidentsCount(sql: Sql): Promise<GetResolvedIncidentsCountRow | null> {
    const rows = await sql.unsafe(getResolvedIncidentsCountQuery, []).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        count: row[0]
    };
}

export const getOngoingIncidentsCountQuery = `-- name: GetOngoingIncidentsCount :one
select count(*) from incidents where status = 'ongoing'`;

export interface GetOngoingIncidentsCountRow {
    count: string;
}

export async function getOngoingIncidentsCount(sql: Sql): Promise<GetOngoingIncidentsCountRow | null> {
    const rows = await sql.unsafe(getOngoingIncidentsCountQuery, []).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        count: row[0]
    };
}

export const getPendingIncidentsCountQuery = `-- name: GetPendingIncidentsCount :one
select count(*) from incidents where status = 'pending'`;

export interface GetPendingIncidentsCountRow {
    count: string;
}

export async function getPendingIncidentsCount(sql: Sql): Promise<GetPendingIncidentsCountRow | null> {
    const rows = await sql.unsafe(getPendingIncidentsCountQuery, []).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        count: row[0]
    };
}

export const getAllIncidentByIdQuery = `-- name: GetAllIncidentById :one
select id, incident_name, victim_name, gps_coordinates, incident_time, incident_end_time, status from incidents where id = $1`;

export interface GetAllIncidentByIdArgs {
    id: string;
}

export interface GetAllIncidentByIdRow {
    id: string;
    incidentName: string;
    victimName: string;
    gpsCoordinates: string;
    incidentTime: Date;
    incidentEndTime: Date | null;
    status: string;
}

export async function getAllIncidentById(sql: Sql, args: GetAllIncidentByIdArgs): Promise<GetAllIncidentByIdRow | null> {
    const rows = await sql.unsafe(getAllIncidentByIdQuery, [args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        incidentName: row[1],
        victimName: row[2],
        gpsCoordinates: row[3],
        incidentTime: row[4],
        incidentEndTime: row[5],
        status: row[6]
    };
}

export const createIncidentQuery = `-- name: CreateIncident :one
insert into incidents (incident_name, victim_name, gps_coordinates, incident_time, status) values ($1, $2, $3, $4, $5) returning id, incident_name, victim_name, gps_coordinates, incident_time, incident_end_time, status`;

export interface CreateIncidentArgs {
    incidentName: string;
    victimName: string;
    gpsCoordinates: string;
    incidentTime: Date;
    status: string;
}

export interface CreateIncidentRow {
    id: string;
    incidentName: string;
    victimName: string;
    gpsCoordinates: string;
    incidentTime: Date;
    incidentEndTime: Date | null;
    status: string;
}

export async function createIncident(sql: Sql, args: CreateIncidentArgs): Promise<CreateIncidentRow | null> {
    const rows = await sql.unsafe(createIncidentQuery, [args.incidentName, args.victimName, args.gpsCoordinates, args.incidentTime, args.status]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        incidentName: row[1],
        victimName: row[2],
        gpsCoordinates: row[3],
        incidentTime: row[4],
        incidentEndTime: row[5],
        status: row[6]
    };
}

export const resolveIncidentQuery = `-- name: ResolveIncident :one
update incidents set status = 'resolved', incident_end_time = $1 where id = $2 returning id, incident_name, victim_name, gps_coordinates, incident_time, incident_end_time, status`;

export interface ResolveIncidentArgs {
    incidentEndTime: Date | null;
    id: string;
}

export interface ResolveIncidentRow {
    id: string;
    incidentName: string;
    victimName: string;
    gpsCoordinates: string;
    incidentTime: Date;
    incidentEndTime: Date | null;
    status: string;
}

export async function resolveIncident(sql: Sql, args: ResolveIncidentArgs): Promise<ResolveIncidentRow | null> {
    const rows = await sql.unsafe(resolveIncidentQuery, [args.incidentEndTime, args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        incidentName: row[1],
        victimName: row[2],
        gpsCoordinates: row[3],
        incidentTime: row[4],
        incidentEndTime: row[5],
        status: row[6]
    };
}

export const getNewIncidentsQuery = `-- name: GetNewIncidents :one
select id, incident_name, victim_name, gps_coordinates, incident_time, incident_end_time, status from incidents where incident_time > $1`;

export interface GetNewIncidentsArgs {
    incidentTime: Date;
}

export interface GetNewIncidentsRow {
    id: string;
    incidentName: string;
    victimName: string;
    gpsCoordinates: string;
    incidentTime: Date;
    incidentEndTime: Date | null;
    status: string;
}

export async function getNewIncidents(sql: Sql, args: GetNewIncidentsArgs): Promise<GetNewIncidentsRow | null> {
    const rows = await sql.unsafe(getNewIncidentsQuery, [args.incidentTime]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        incidentName: row[1],
        victimName: row[2],
        gpsCoordinates: row[3],
        incidentTime: row[4],
        incidentEndTime: row[5],
        status: row[6]
    };
}

export const getAllUnresolvedIncidentsQuery = `-- name: GetAllUnresolvedIncidents :many
select id, incident_name, victim_name, gps_coordinates, incident_time, incident_end_time, status from incidents where status != 'resolved'`;

export interface GetAllUnresolvedIncidentsRow {
    id: string;
    incidentName: string;
    victimName: string;
    gpsCoordinates: string;
    incidentTime: Date;
    incidentEndTime: Date | null;
    status: string;
}

export async function getAllUnresolvedIncidents(sql: Sql): Promise<GetAllUnresolvedIncidentsRow[]> {
    return (await sql.unsafe(getAllUnresolvedIncidentsQuery, []).values()).map(row => ({
        id: row[0],
        incidentName: row[1],
        victimName: row[2],
        gpsCoordinates: row[3],
        incidentTime: row[4],
        incidentEndTime: row[5],
        status: row[6]
    }));
}

