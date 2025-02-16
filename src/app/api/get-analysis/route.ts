import { db } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const incidentId = searchParams.get('incidentId')

        if (!incidentId) {
            return NextResponse.json(
                { error: 'Incident ID is required' },
                { status: 400 }
            )
        }

        const analysis = await db.unsafe(
            'select * from analysis where incident_id = $1 order by analysis_timestamp desc',
            [incidentId]
        ).values()

        return NextResponse.json(analysis.map(row => ({
            id: row[0],
            incidentId: row[1],
            sentiment: row[2],
            threatLevel: row[3],
            situationSummary: row[4],
            actionRecommendations: row[5],
            detectedSounds: row[6],
            analysisTimestamp: row[7]
        })))
    } catch (error) {
        console.error('Error getting incident analysis:', error)
        return NextResponse.json(
            { error: 'Failed to get incident analysis' },
            { status: 500 }
        )
    }
}