import { useState, useEffect } from "react";
import { getDocuments } from "../services/api";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { FileText, AlertCircle } from "lucide-react";

export function ExplanationPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await getDocuments();
        setDocuments(response.data);
      } catch (err) {
        setError("Failed to load documents.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">Document Explanations</h1>
        <p className="text-[#475569]">Review documents you have uploaded and their processing status.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {documents.length === 0 && !error ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#D6E4FF] flex items-center justify-center text-primary mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">No documents yet</h2>
          <p className="text-[#475569]">Upload documents in the AI Chat to start analyzing them here.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#D6E4FF] flex items-center justify-center text-primary flex-shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1E293B] truncate">{doc.filename}</p>
                <p className="text-xs text-[#475569]">
                  Uploaded on {new Date(doc.upload_date).toLocaleDateString()} · Type: {doc.file_type}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  doc.status === "ready"
                    ? "bg-[#D1FAE5] text-emerald-700"
                    : doc.status === "error"
                    ? "bg-red-100 text-red-600"
                    : "bg-[#D6E4FF] text-primary"
                }`}
              >
                {doc.status}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
