"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetIncidentAnalysisRow } from "@/lib/sqlc/incidents_sql";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { useState } from "react";
// Add this type for comb
//
// ined audio and analysis data
export type AudioSegment = {
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

// ISO8601 and time
const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0] + " " + date.toISOString().split("T")[1].split(".")[0];
};
export function Segments(props: { analyses: GetIncidentAnalysisRow[] }) {
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

    const analyses = props.analyses;

    const nextSegment = () => {
        setCurrentSegmentIndex(i =>
            i < analyses.length - 1 ? i + 1 : i
        );
    };

    const previousSegment = () => {
        setCurrentSegmentIndex(i => i > 0 ? i - 1 : i);
    };
    return <>
        {/* Audio Analysis Section */}
        {analyses.length > 0 && (
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
                                <ChevronLeft className="w-6 h-6"/>
                            </button>
                            <span className="text-sm text-gray-500">
                                {currentSegmentIndex + 1} of {analyses.length}
                            </span>
                            <button
                                onClick={nextSegment}
                                disabled={currentSegmentIndex === analyses.length - 1}
                                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                            >
                                <ChevronRight className="w-6 h-6"/>
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Audio Player */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <Volume2 className="w-5 h-5 text-gray-500"/>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(analyses[currentSegmentIndex].analysisTimestamp)}
                                    </span>
                                </div>
                                <audio
                                    controls
                                    src={'N/A'}
                                    className="w-full"
                                />
                            </div>

                            {/* Analysis Info */}
                            {analyses[currentSegmentIndex] && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500">Sentiment</h3>
                                        <p className="text-lg">{analyses[currentSegmentIndex].sentiment}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500">Threat Level</h3>
                                        <p className="text-lg">{analyses[currentSegmentIndex].threatLevel}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500">Situation Summary</h3>
                                        <p className="text-lg">{analyses[currentSegmentIndex].situationSummary}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500">Detected Sounds</h3>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {analyses[currentSegmentIndex].detectedSounds?.map((sound, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                                                    {sound}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500">Recommended Actions</h3>
                                        <ul className="list-disc list-inside mt-1">
                                            {analyses[currentSegmentIndex].actionRecommendation?.map((action, i) => (
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
        )}</>;
}