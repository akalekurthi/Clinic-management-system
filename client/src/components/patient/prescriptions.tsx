import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

interface Prescription {
  id: number;
  doctorName: string;
  medications: string;
  instructions: string;
  createdAt: string;
}

export default function PatientPrescriptions() {
  const { data: prescriptions = [], isLoading } = useQuery<Prescription[]>({
    queryKey: ["/api/prescriptions"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">My Prescriptions</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No prescriptions available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Dr. {prescription.doctorName}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 mx-8">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Medications:</span> {prescription.medications}
                    </p>
                    {prescription.instructions && (
                      <p className="text-sm text-slate-500 mt-1">
                        <span className="font-medium">Instructions:</span> {prescription.instructions}
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 