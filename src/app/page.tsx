import { Search } from "lucide-react";
import IncidentsTable from "@/components/incidents-table";
import { Input } from "@/components/ui/input";
import {
    getOngoingIncidentsCount,
    getPendingIncidentsCount,
    getResolvedIncidentsCount,
    getTotalIncidentsCount
} from "@/lib/sqlc/incidents_sql";
import { db } from "@/lib/database";

export default async function Home() {
    const totalIncidentsCount = await getTotalIncidentsCount(db);
    const resolvedIncidentsCount = await getResolvedIncidentsCount(db);
    const ongoingIncidentsCount = await getOngoingIncidentsCount(db);
    const pendingIncidentsCount = await getPendingIncidentsCount(db);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="pt-24 pb-12">
                <h1 className="text-center text-4xl font-bold">Attack Incidents Dashboard</h1>
            </header>
            <main className="flex-grow py-6 px-12 bg-background">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
                        <h3 className="font-semibold text-sm">Total Incidents</h3>
                        <p className="text-2xl font-bold">{totalIncidentsCount?.count ?? 0}</p>
                    </div>
                    <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
                        <h3 className="font-semibold text-sm">Resolved</h3>
                        <p className="text-2xl font-bold text-green-600">{resolvedIncidentsCount?.count ?? 0}</p>
                    </div>
                    <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
                        <h3 className="font-semibold text-sm">Ongoing Investigation</h3>
                        <p className="text-2xl font-bold text-yellow-600">{ongoingIncidentsCount?.count ?? 0}</p>
                    </div>
                    <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
                        <h3 className="font-semibold text-sm">Pending Investigation</h3>
                        <p className="text-2xl font-bold text-blue-600">{pendingIncidentsCount?.count ?? 0}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Recent Incidents</h2>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input placeholder="Search incidents..." className="pl-8 w-[300px]"/>
                        </div>
                    </div>
                    <IncidentsTable/>
                </div>
            </main>
        </div>
    );
}

