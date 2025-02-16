"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { GetAllIncidentByIdRow } from "@/lib/sqlc/incidents_sql";

export function IncidentMap(props: { lat: any, lng: any, incident: GetAllIncidentByIdRow }) {

    const polyline = [
        [props.lat, props.lng],
        [props.lat + 0.001, props.lng + 0.001],
    ];

    return <Card>
        <CardHeader>
            <CardTitle>Incident Location</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
            {/*@ts-ignore*/}
            <MapContainer center={[props.lat, props.lng]} zoom={16} style={{ height: "100%", width: "100%" }}>
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
                <Polyline pathOptions={{ color: "red" }} positions={polyline}/>
            </MapContainer>
        </CardContent>
    </Card>;
}