"use client";

import { useEffect, useState } from "react";
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString));
};
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function CasesDashboard() {
    const [cases, setCases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCases() {
            try {
                const response = await fetch("/api/police/cases");
                if (!response.ok) {
                    throw new Error("Failed to fetch cases");
                }
                const data = await response.json();
                setCases(data.cases || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCases();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <p className="text-red-600 font-medium">Error loading cases: {error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Cases Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    {cases.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No cases found. You have not uploaded any FIRs yet.
                        </div>
                    ) : (
                        <div className="rounded-md border border-gray-100 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="font-semibold text-gray-900">FIR Number</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Police Station</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Date</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Stage</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Added On</TableHead>
                                        <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cases.map((c) => (
                                        <TableRow key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="font-medium">{c.firNumber}</TableCell>
                                            <TableCell>{c.policeStation}</TableCell>
                                            <TableCell>
                                                {formatDate(c.firDate)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={c.stage === "Closed" ? "secondary" : "default"}
                                                    className={c.stage === "Pre-Trial" ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent font-medium" : ""}
                                                >
                                                    {c.stage || "Pre-Trial"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {formatDate(c.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link
                                                    href={`/police/cases/${c._id}`}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-gray-100 px-3 py-1.5 border border-gray-200"
                                                >
                                                    View Details
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
