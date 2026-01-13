"use client";

import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UploadFIRPage() {
  const [firNumber, setFirNumber] = useState("");
  const [policeStation, setPoliceStation] = useState("");
  const [firDate, setFirDate] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
  if (!file || !firNumber) return;

  const formData = new FormData();
  formData.append("firNumber", firNumber);
  formData.append("policeStation", policeStation);
  formData.append("firDate", firDate);
  formData.append("file", file);

  try {
    const res = await fetch("/api/police/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Upload failed");
      return;
    }

    console.log("Case created:", data.caseId);

    // Redirect to dashboard or case page
    window.location.href = "/police/dashboard";

  } catch (error) {
    console.error("Upload error:", error);
    alert("Something went wrong");
  }
};


  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB");
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const isSubmitDisabled = !firNumber || !file;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-white">
      {/* A. PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Upload FIR</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload the First Information Report to create a new case
        </p>
      </div>

      {/* FORM CARD */}
      <div className="rounded-lg border border-border bg-background/50 p-6 space-y-6">
        {/* B. FIR METADATA */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>FIR Number *</Label>
              <Input
                placeholder="e.g. FIR/2024/102"
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Police Station</Label>
              <Input
                placeholder="e.g. Andheri Police Station"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1 max-w-sm">
            <Label>Date of FIR</Label>
            <Input
              type="date"
              value={firDate}
              onChange={(e) => setFirDate(e.target.value)}
            />
          </div>
        </div>

        {/* C. PDF UPLOAD */}
        <div className="space-y-2">
          <Label>FIR Document (PDF)</Label>

          {!file ? (
            <label className="flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-muted/40 transition">
              <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload FIR document (PDF only, max 10MB)
              </p>
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* D. SUBMIT */}
        <div className="pt-4 flex justify-end">
          <Button
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            Upload
          </Button>
        </div>

        {/* DISCLAIMER */}
        <p className="text-xs text-muted-foreground pt-2">
          Uploading an FIR creates a new case. AI analysis is for decision support only.
        </p>
      </div>
    </div>
  );
}
