import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { IncidentInfo } from "@/components/incident-info";

type Props = {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function IncidentDetail(params: Props) {
    const searchParams = await params.searchParams;
    const id = searchParams?.id;
    if (!id || Array.isArray(id)) {
        return <div>Incident not found</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <Link href="/" className="inline-flex items-center mb-4">
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard
                </Button>
            </Link>
            <IncidentInfo incidentId={id}/>
        </div>
    );
}

export const dynamic = "force-dynamic";