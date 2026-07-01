import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

const documents = [
  { name: "Driver's License", status: "verified", expiry: "Dec 2027" },
  { name: "Vehicle Insurance", status: "verified", expiry: "Mar 2027" },
  { name: "Vehicle Registration", status: "pending", expiry: "Jun 2027" },
  { name: "Background Check", status: "verified", expiry: "N/A" },
];

export default function DriverDocumentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-display font-bold text-text">Documents</h1>
      <p className="text-sm text-muted">
        Upload and manage your driver documents for verification.
      </p>

      <div className="space-y-3">
        {documents.map((doc) => (
          <Card key={doc.name}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    doc.status === "verified"
                      ? "bg-success/10"
                      : "bg-yellow-400/10"
                  }`}
                >
                  {doc.status === "verified" ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{doc.name}</p>
                  <p className="text-xs text-muted">Expires: {doc.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={doc.status === "verified" ? "success" : "warning"}
                  dot
                >
                  {doc.status}
                </Badge>
                <Button size="sm" variant="secondary" icon={Upload}>
                  Update
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
