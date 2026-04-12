"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Download, Calendar, MapPin, Hash, Clock, FileWarning, Sparkles, AlertCircle, Gavel, AlertTriangle, BrainCircuit, Zap, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                        <CardContent className="p-0 bg-[#0a0a0a]">
                            <dl className="divide-y divide-white/10">
                                <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-white/5 transition-colors">
                                    <dt className="text-sm font-medium text-white/60 flex items-center gap-2">
                                        <Hash className="h-4 w-4" /> FIR Number
                                    </dt>
                                    <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0 font-semibold text-lg">
                                        {caseData.firNumber}
                                    </dd>
                                </div>
                                <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-white/5 transition-colors">
                                    <dt className="text-sm font-medium text-white/60 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Police Station
                                    </dt>
                                    <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                                        {caseData.policeStation}
                                    </dd>
                                </div>
                                <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-white/5 transition-colors">
                                    <dt className="text-sm font-medium text-white/60 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Incident/FIR Date
                                    </dt>
                                    <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                                        {formatDate(caseData.firDate)}
                                    </dd>
                                </div>
                                <div className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-white/5 transition-colors">
                                    <dt className="text-sm font-medium text-white/60 flex items-center gap-2">
                                        <Clock className="h-4 w-4" /> Uploaded On
                                    </dt>
                                    <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                                        {formatDate(caseData.createdAt, true)}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    {/* AI SUMMARY COMPONENT */}
                    {caseData.summary ? (
                        <Card className="shadow-md border-blue-100 bg-gradient-to-b from-blue-50/30 to-white overflow-hidden">
                            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2 text-white">
                                    <Sparkles className="h-5 w-5" />
                                    AI-Generated Incident Summary
                                </CardTitle>
                                <Badge className="bg-white/20 text-white border-none text-[10px] uppercase tracking-wider">
                                    Decision Support
                                </Badge>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                {/* Incident Summary */}
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-700 uppercase tracking-tight mb-2">The Incident</h4>
                                    <p className="text-gray-700 leading-relaxed italic border-l-4 border-blue-200 pl-4 py-1">
                                        {caseData.summary.incidentSummary || "Summary not available."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                    {/* Key Allegations */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-tight flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-amber-500" />
                                            Key Allegations
                                        </h4>
                                        <ul className="space-y-2">
                                            {caseData.summary.keyAllegations?.length > 0 ? (
                                                caseData.summary.keyAllegations.map((item, i) => (
                                                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2 bg-gray-50 p-2 rounded border border-gray-100 italic">
                                                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                                                        {item}
                                                    </li>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">None identified.</p>
                                            )}
                                        </ul>
                                    </div>

                                    {/* IPC Sections */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-tight flex items-center gap-2">
                                            <Gavel className="h-4 w-4 text-blue-500" />
                                            Cited IPC Sections
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {caseData.summary.ipcSections?.length > 0 ? (
                                                caseData.summary.ipcSections.map((section, i) => (
                                                    <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-mono py-1 px-3">
                                                        {section}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">No specific sections cited.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Important Disclaimer */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3 items-start opacity-70">
                                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-gray-500 leading-tight">
                                        Disclaimer: This summary is generated by an AI assistant based strictly on the uploaded document. It is intended for decision support only and should not replace manual verification for legal proceedings.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="shadow-sm border-dashed border-gray-200">
                            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                                <BrainCircuit className="h-10 w-10 text-gray-300 mb-4" />
                                <CardTitle className="text-gray-400 font-medium">No AI Summary Yet</CardTitle>
                                <p className="text-sm text-gray-400 mt-2 max-w-xs">
                                    The AI analysis process has not been completed for this case yet.
                                </p>
                                <Button 
                                    variant="outline" 
                                    className="mt-6 border-blue-200 text-blue-600 hover:bg-blue-50"
                                    onClick={async () => {
                                        try {
                                            const res = await fetch("/api/ai/summarize", {
                                                method: "POST",
                                                body: JSON.stringify({ caseId: caseData._id })
                                            });
                                            if (res.ok) window.location.reload();
                                            else alert("Failed to trigger analysis");
                                        } catch (e) { alert("Error: " + e.message); }
                                    }}
                                >
                                    <Zap className="h-4 w-4 mr-2" />
                                    Generate Summary
                                </Button>
                            </CardContent>
                        </Card>
                    )}
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

