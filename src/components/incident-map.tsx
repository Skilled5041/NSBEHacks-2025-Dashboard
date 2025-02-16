"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { GetAllIncidentByIdRow, GetIncidentLocationsRow } from "@/lib/sqlc/incidents_sql";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

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

    // Get most recent coordinates for Google Maps link
    const mostRecentCoords = polyline.length > 0 ? polyline[polyline.length - 1] : [props.lat, props.lng];
    const googleMapsUrl = `https://www.google.com/maps?q=${mostRecentCoords[0]},${mostRecentCoords[1]}`;

    useEffect(() => {
        const intervalId = setInterval(async () => {
            const response = await fetch(`/api/get-new-incident-locations?lastPollTime=${lastPollTime}`);
            const locations = await response.json();
            setPolyline(polyline.concat(locations.map((location: any) => {
                const [lat, lng] = location.gpsCoordinates.split(" ").map(parseFloat);
                return [lat, lng];
            })));
            setLastPollTime(locations[locations.length - 1]?.locationTime ?? lastPollTime);
            console.log(lastPollTime);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    return <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Incident Location</CardTitle>
            <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
                View in Google Maps
                <ExternalLink className="w-4 h-4" />
            </a>
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