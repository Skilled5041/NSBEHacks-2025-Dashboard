"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { GetAllIncidentByIdRow } from "@/lib/sqlc/incidents_sql";

export function IncidentMap(props: { lat: any, lng: any, incident: GetAllIncidentByIdRow }) {
    return <Card>
        <CardHeader>
            <CardTitle>Incident Location</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
            <MapContainer center={[props.lat, props.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[props.lat, props.lng]}>
                    <Popup>
                        {props.incident.incidentName}
                        <br/>
                        {props.incident.gpsCoordinates}
                    </Popup>
                </Marker>
            </MapContainer>
        </CardContent>
    </Card>;
}