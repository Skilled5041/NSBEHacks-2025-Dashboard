import { NextResponse } from 'next/server'
import { db } from "@/lib/database"

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

    // Get all audio files for the incident using sqlc, ordered by timestamp
    const audioFiles = await db.unsafe(
      'select * from audio where incident_id = $1 order by audio_timestamp asc',
      [incidentId]
    ).values()

    // Generate signed URLs for each audio file, maintaining order
    const audioFilesWithUrls = await Promise.all(
      audioFiles.map(async (audio) => {
        const signedUrlResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/audio-files/${audio[2]}?expiresIn=3600`,
          {
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!,
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE}`,
            },
          }
        )

        if (!signedUrlResponse.ok) throw new Error('Failed to generate signed URL')
        const { signedURL } = await signedUrlResponse.json()

        return {
          id: audio[0],
          incidentId: audio[1],
          url: signedURL,
          createdAt: audio[3]
        }
      })
    )

    return NextResponse.json(audioFilesWithUrls)
  } catch (error) {
    console.error('Error getting incident audio files:', error)
    return NextResponse.json(
      { error: 'Failed to get incident audio files' },
      { status: 500 }
    )
  }
}
