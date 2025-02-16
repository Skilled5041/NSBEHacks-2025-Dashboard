"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { GetAllIncidentByIdRow, GetIncidentLocationsRow } from "@/lib/sqlc/incidents_sql";
import { useEffect, useState } from "react";

export function IncidentMap(props: {
    lat: any,
    lng: any,
    incident: GetAllIncidentByIdRow,
    locations: GetIncidentLocationsRow[]
}) {

    const [polyline, setPolyline] = useState(props.locations.map(location => {
        const [lat, lng] = location.gpsCoordinates.split(" ").map(parseFloat);
        return [lat, lng];
    }));
    // Get current date utc
    const [lastPollTime, setLastPollTime] = useState(props?.locations[props?.locations.length - 1]?.locationTime ?? new Date());

    useEffect(() => {
        setInterval(async () => {
            const response = await fetch(`/api/get-new-incident-locations?lastPollTime=${lastPollTime}`);
            const locations = await response.json();
            setPolyline(polyline.concat(locations.map((location: any) => {
                const [lat, lng] = location.gpsCoordinates.split(" ").map(parseFloat);
                return [lat, lng];
            })));
            setLastPollTime(locations[locations.length - 1]?.locationTime ?? lastPollTime);
            console.log(lastPollTime);
        }, 2500);
    }, []);

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
                {polyline.length > 0 &&
                    <Marker position={polyline[polyline.length - 1]}>
                      <Popup>
                        Last position
                      </Popup>
                    </Marker>
                }
                <Polyline pathOptions={{ color: "red" }} positions={polyline}/>
            </MapContainer>
        </CardContent>
    </Card>;
}