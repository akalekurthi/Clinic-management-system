import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";

interface LabTest {
  id: number;
  testType: string;
  doctorName: string;
  status: string;
  requestedAt: string;
  completedAt?: string;
  reportUrl?: string;
}

export default function PatientLabReports() {
  const { data: labTests = [], isLoading } = useQuery<LabTest[]>({
    queryKey: ["/api/lab-tests"],
  });

  const completedTests = labTests.filter((test: LabTest) => test.status === 'completed');
  const pendingTests = labTests.filter((test: LabTest) => test.status !== 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Lab Reports</h2>
      </div>

      {/* Completed Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : completedTests.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed reports available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedTests.map((test: LabTest) => (
                <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{test.testType}</p>
                      <p className="text-sm text-slate-500">
                        Requested by Dr. {test.doctorName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-800">
                      {new Date(test.completedAt!).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      Completed
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={test.reportUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : pendingTests.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending reports</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTests.map((test: LabTest) => (
                <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{test.testType}</p>
                      <p className="text-sm text-slate-500">
                        Requested by Dr. {test.doctorName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-800">
                      {new Date(test.requestedAt).toLocaleDateString()}
                    </p>
                    <Badge variant="secondary">{test.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 