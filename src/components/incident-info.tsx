import { getAllIncidentById, getIncidentLocations, getIncidentAudio, getIncidentAnalysis } from "@/lib/sqlc/incidents_sql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/database";
import { IncidentMap } from "@/components/incident-map";
import { StatusForm } from "@/components/status-form";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

// Add this type for combined audio and analysis data
type AudioSegment = {
  audioUrl: string;
  timestamp: Date;
  analysis?: {
    sentiment: string;
    threatLevel: string;
    situationSummary: string;
    actionRecommendation: string[];
    detectedSounds: string[];
  };
};

export async function IncidentInfo(props: { incidentId: string }) {
    // ISO8601 and time
    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0] + " " + date.toISOString().split("T")[1].split(".")[0];
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "resolved":
                return "bg-green-500";
            case "ongoing":
                return "bg-yellow-500";
            case "investigating":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    const incident = await getAllIncidentById(db, {
        id: props.incidentId
    });

    if (!incident) {
        return <div>Incident not found</div>;
    }

    const [lat, lng] = incident.gpsCoordinates.split(" ").map(parseFloat);

    const locations = await getIncidentLocations(db, {
        incidentId: props.incidentId
    });

    const audioRecordings = await getIncidentAudio(db, {
        incidentId: props.incidentId
    });
    
    const analyses = await getIncidentAnalysis(db, {
        incidentId: props.incidentId
    });

    // Combine audio and analysis data
    const audioSegments: AudioSegment[] = audioRecordings.map(audio => ({
        audioUrl: audio.audioUrl,
        timestamp: audio.audioTimestamp,
        analysis: analyses.find(a => 
            Math.abs(a.analysisTimestamp.getTime() - audio.audioTimestamp.getTime()) < 5000
        )
    }));

    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

    const nextSegment = () => {
        setCurrentSegmentIndex(i => 
            i < audioSegments.length - 1 ? i + 1 : i
        );
    };

    const previousSegment = () => {
        setCurrentSegmentIndex(i => i > 0 ? i - 1 : i);
    };

    return <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>{incident.incidentName}</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                    <div>
                        <dt className="font-semibold">Victim Name</dt>
                        <dd>{incident.victimName}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Time</dt>
                        <dd>{formatDate(incident.incidentTime)}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">GPS Coordinates</dt>
                        <dd>{incident.gpsCoordinates}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Status</dt>
                        <StatusForm statusColor={getStatusColor(incident.status)} incident={incident}/>
                    </div>
                </dl>
                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p>{incident.incidentName}</p>
                </div>
            </CardContent>
        </Card>
        <IncidentMap lat={lat} lng={lng} incident={incident} locations={locations}/>

        {/* Audio Analysis Section */}
        {audioSegments.length > 0 && (
            <div className="md:col-span-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Audio Analysis</CardTitle>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={previousSegment}
                                disabled={currentSegmentIndex === 0}
                                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <span className="text-sm text-gray-500">
                                {currentSegmentIndex + 1} of {audioSegments.length}
                            </span>
                            <button 
                                onClick={nextSegment}
                                disabled={currentSegmentIndex === audioSegments.length - 1}
                                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Audio Player */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <Volume2 className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm text-gray-500">
                                        {formatDate(audioSegments[currentSegmentIndex].timestamp)}
                                    </span>
                                </div>
                                <audio 
                                    controls 
                                    src={audioSegments[currentSegmentIndex].audioUrl}
                                    className="w-full"
                                />
                            </div>

                            {/* Analysis Info */}
                            {audioSegments[currentSegmentIndex].analysis && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500">Sentiment</h3>
                                        <p className="text-lg">{audioSegments[currentSegmentIndex].analysis.sentiment}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500">Threat Level</h3>
                                        <p className="text-lg">{audioSegments[currentSegmentIndex].analysis.threatLevel}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500">Situation Summary</h3>
                                        <p className="text-lg">{audioSegments[currentSegmentIndex].analysis.situationSummary}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500">Detected Sounds</h3>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {audioSegments[currentSegmentIndex].analysis.detectedSounds.map((sound, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                                                    {sound}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500">Recommended Actions</h3>
                                        <ul className="list-disc list-inside mt-1">
                                            {audioSegments[currentSegmentIndex].analysis.actionRecommendation.map((action, i) => (
                                                <li key={i} className="text-lg">{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
    </div>;
}