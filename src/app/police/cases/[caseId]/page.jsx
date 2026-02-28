"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Download, Calendar, MapPin, Hash, Clock, FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};

export default function CaseDetailPage({ params }) {
    const router = useRouter();

    const [caseId, setCaseId] = useState(null);
    const [caseData, setCaseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // In Next.js 15, params is a Promise. We need to unwrap it eagerly.
        Promise.resolve(params).then((resolvedParams) => {
            setCaseId(resolvedParams.caseId);
        });
    }, [params]);

    useEffect(() => {
        async function fetchCaseDetails() {
            try {
                const response = await fetch(`/api/police/cases/${caseId}`);
                if (!response.ok) {
                    if (response.status === 404) throw new Error("Case not found");
                    if (response.status === 403) throw new Error("You do not have permission to view this case");
                    throw new Error("Failed to fetch case details");
                }
                const data = await response.json();
                setCaseData(data.case);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        if (caseId) {
            fetchCaseDetails();
        }
    }, [caseId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="text-gray-500 font-medium">Loading case details...</p>
            </div>
        );
    }

    if (error || !caseData) {
        return (
            <div className="container mx-auto py-10 px-4 md:px-8 max-w-4xl">
                <button
                    onClick={() => router.push('/police/cases')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Cases
                </button>
                <Card className="border-red-200 bg-red-50/50 shadow-sm">
                    <CardContent className="pt-6 flex flex-col items-center justify-center py-12 text-center">
                        <FileWarning className="h-12 w-12 text-red-400 mb-4" />
                        <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Case</h2>
                        <p className="text-red-600">{error || "Case details could not be found."}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 max-w-5xl">
            {/* Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <button
                        onClick={() => router.push('/police/cases')}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 transition-colors font-medium text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Cases Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        Case Details
                        <Badge
                            variant={caseData.stage === "Closed" ? "secondary" : "default"}
                            className={caseData.stage === "Pre-Trial" ? "bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm px-3 py-1" : "text-sm px-3 py-1"}
                        >
                            {caseData.stage || "Pre-Trial"}
                        </Badge>
                    </h1>
                    <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <Hash className="h-4 w-4" /> Internal System ID: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{caseData._id}</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Metadata */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="shadow-sm border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                                <FileText className="h-5 w-5 text-blue-600" />
                                FIR Information
                            </CardTitle>
                        </div>
                        <CardContent className="p-0">
                            <dl className="divide-y divide-gray-100">
                                <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-gray-50/50 transition-colors">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                        <Hash className="h-4 w-4" /> FIR Number
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-semibold text-lg">
                                        {caseData.firNumber}
                                    </dd>
                                </div>
                                <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-gray-50/50 transition-colors">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Police Station
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        {caseData.policeStation}
                                    </dd>
                                </div>
                                <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-gray-50/50 transition-colors">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Incident/FIR Date
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        {formatDate(caseData.firDate)}
                                    </dd>
                                </div>
                                <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-gray-50/50 transition-colors">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                        <Clock className="h-4 w-4" /> Uploaded On
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        {formatDate(caseData.createdAt, true)}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Documents */}
                <div className="space-y-6">
                    <Card className="shadow-sm border-gray-200">
                        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                                <FolderOpen className="h-5 w-5 text-blue-600" />
                                Documents
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Files attached to this case
                            </CardDescription>
                        </div>
                        <CardContent className="p-4">
                            {caseData.documents && caseData.documents.length > 0 ? (
                                <ul className="space-y-3">
                                    {caseData.documents.map((doc, index) => (
                                        <li key={doc._id || index} className="flex flex-col p-3 rounded-lg border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all group">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="p-2 bg-red-50 text-red-600 rounded-md">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-medium text-gray-900 truncate" title={doc.fileName || "Document"}>
                                                            {doc.fileName || `Document ${index + 1}`}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">PDF Document</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                                                <Link
                                                    href={doc.filePath || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
                                                >
                                                    View PDF
                                                </Link>
                                                <a
                                                    href={doc.filePath || "#"}
                                                    download
                                                    className="inline-flex justify-center items-center p-1.5 text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                                                    title="Download File"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                                    <FileText className="h-8 w-8 text-gray-300 mb-2" />
                                    <p className="text-sm">No documents uploaded yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Ensure lucide icon is available for import above
import { FolderOpen } from "lucide-react";
