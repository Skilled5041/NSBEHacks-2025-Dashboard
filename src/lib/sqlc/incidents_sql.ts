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
insert into incidents (incident_name, victim_name, gps_coordinates, incident_time, status)
values ($1, $2, $3, $4, $5)
returning id, incident_name, victim_name, gps_coordinates, incident_time, incident_end_time, status`;

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
update incidents
set status = 'resolved', incident_end_time = $1
where id = $2
returning id, incident_name, victim_name, gps_coordinates, incident_time, incident_end_time, status`;

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

export const updateIncidentStatusQuery = `-- name: UpdateIncidentStatus :one
update incidents set status = $1 where id = $2 returning id, incident_name, victim_name, gps_coordinates, incident_time, incident_end_time, status`;

export interface UpdateIncidentStatusArgs {
    status: string;
    id: string;
}

export interface UpdateIncidentStatusRow {
    id: string;
    incidentName: string;
    victimName: string;
    gpsCoordinates: string;
    incidentTime: Date;
    incidentEndTime: Date | null;
    status: string;
}

export async function updateIncidentStatus(sql: Sql, args: UpdateIncidentStatusArgs): Promise<UpdateIncidentStatusRow | null> {
    const rows = await sql.unsafe(updateIncidentStatusQuery, [args.status, args.id]).values();
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

export const addIncidentLocationQuery = `-- name: AddIncidentLocation :one
insert into incident_locations (incident_id, gps_coordinates, location_time)
values ($1, $2, $3)
returning id, incident_id, gps_coordinates, location_time`;

export interface AddIncidentLocationArgs {
    incidentId: string | null;
    gpsCoordinates: string;
    locationTime: Date;
}

export interface AddIncidentLocationRow {
    id: string;
    incidentId: string | null;
    gpsCoordinates: string;
    locationTime: Date;
}

export async function addIncidentLocation(sql: Sql, args: AddIncidentLocationArgs): Promise<AddIncidentLocationRow | null> {
    const rows = await sql.unsafe(addIncidentLocationQuery, [args.incidentId, args.gpsCoordinates, args.locationTime]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        incidentId: row[1],
        gpsCoordinates: row[2],
        locationTime: row[3]
    };
}

export const getIncidentLocationsQuery = `-- name: GetIncidentLocations :many
select id, incident_id, gps_coordinates, location_time from incident_locations where incident_id = $1`;

export interface GetIncidentLocationsArgs {
    incidentId: string | null;
}

export interface GetIncidentLocationsRow {
    id: string;
    incidentId: string | null;
    gpsCoordinates: string;
    locationTime: Date;
}

export async function getIncidentLocations(sql: Sql, args: GetIncidentLocationsArgs): Promise<GetIncidentLocationsRow[]> {
    return (await sql.unsafe(getIncidentLocationsQuery, [args.incidentId]).values()).map(row => ({
        id: row[0],
        incidentId: row[1],
        gpsCoordinates: row[2],
        locationTime: row[3]
    }));
}

export const getNewIncidentLocationsQuery = `-- name: GetNewIncidentLocations :many
select id, incident_id, gps_coordinates, location_time from incident_locations where location_time > $1`;

export interface GetNewIncidentLocationsArgs {
    locationTime: Date;
}

export interface GetNewIncidentLocationsRow {
    id: string;
    incidentId: string | null;
    gpsCoordinates: string;
    locationTime: Date;
}

export async function getNewIncidentLocations(sql: Sql, args: GetNewIncidentLocationsArgs): Promise<GetNewIncidentLocationsRow[]> {
    return (await sql.unsafe(getNewIncidentLocationsQuery, [args.locationTime]).values()).map(row => ({
        id: row[0],
        incidentId: row[1],
        gpsCoordinates: row[2],
        locationTime: row[3]
    }));
}

export const createIncidentContactQuery = `-- name: CreateIncidentContact :one
insert into emergency_contacts (incident_id, contact_name, contact_number, contact_email)
values ($1, $2, $3, $4)
returning id, incident_id, contact_name, contact_number, contact_email`;

export interface CreateIncidentContactArgs {
    incidentId: string | null;
    contactName: string | null;
    contactNumber: string | null;
    contactEmail: string | null;
}

export interface CreateIncidentContactRow {
    id: string;
    incidentId: string | null;
    contactName: string | null;
    contactNumber: string | null;
    contactEmail: string | null;
}

export async function createIncidentContact(sql: Sql, args: CreateIncidentContactArgs): Promise<CreateIncidentContactRow | null> {
    const rows = await sql.unsafe(createIncidentContactQuery, [args.incidentId, args.contactName, args.contactNumber, args.contactEmail]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        incidentId: row[1],
        contactName: row[2],
        contactNumber: row[3],
        contactEmail: row[4]
    };
}

export const addIncidentAudioQuery = `-- name: AddIncidentAudio :one
insert into audio (incident_id, audio_url, audio_timestamp)
values ($1, $2, $3)
returning id, incident_id, audio_url, audio_timestamp`;

export interface AddIncidentAudioArgs {
    incidentId: string | null;
    audioUrl: string;
    audioTimestamp: Date;
}

export interface AddIncidentAudioRow {
    id: string;
    incidentId: string | null;
    audioUrl: string;
    audioTimestamp: Date;
}

export async function addIncidentAudio(sql: Sql, args: AddIncidentAudioArgs): Promise<AddIncidentAudioRow | null> {
    const rows = await sql.unsafe(addIncidentAudioQuery, [args.incidentId, args.audioUrl, args.audioTimestamp]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        incidentId: row[1],
        audioUrl: row[2],
        audioTimestamp: row[3]
    };
}

export const createAnalysisQuery = `-- name: CreateAnalysis :one
insert into analysis (incident_id, sentiment, threat_level, situation_summary, action_recommendation, detected_sounds)
values ($1, $2, $3, $4, $5, $6)
returning id, incident_id, sentiment, threat_level, situation_summary, action_recommendation, detected_sounds, analysis_timestamp`;

export interface CreateAnalysisArgs {
    incidentId: string | null;
    sentiment: string | null;
    threatLevel: string | null;
    situationSummary: string | null;
    actionRecommendation: string[] | null;
    detectedSounds: string[] | null;
}

export interface CreateAnalysisRow {
    id: string;
    incidentId: string | null;
    sentiment: string | null;
    threatLevel: string | null;
    situationSummary: string | null;
    actionRecommendation: string[] | null;
    detectedSounds: string[] | null;
    analysisTimestamp: Date;
}

export async function createAnalysis(sql: Sql, args: CreateAnalysisArgs): Promise<CreateAnalysisRow | null> {
    const rows = await sql.unsafe(createAnalysisQuery, [args.incidentId, args.sentiment, args.threatLevel, args.situationSummary, args.actionRecommendation, args.detectedSounds]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        incidentId: row[1],
        sentiment: row[2],
        threatLevel: row[3],
        situationSummary: row[4],
        actionRecommendation: row[5],
        detectedSounds: row[6],
        analysisTimestamp: row[7]
    };
}

