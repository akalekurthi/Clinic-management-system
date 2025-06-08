import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, CheckCircle, FlaskConical, Timer, Upload, Download, Eye } from "lucide-react";
import UploadModal from "./upload-modal";

export default function LabDashboard() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [tokenNumber, setTokenNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  const { data: labTests = [] } = useQuery({
    queryKey: ["/api/lab-tests"],
  });

  const { data: stats = {} } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const pendingTests = labTests.filter(test => test.status === 'requested');
  const completedTests = labTests.filter(test => test.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Lab Assistant Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Button 
            className="bg-secondary hover:bg-cyan-600"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Report
          </Button>
        </div>
      </div>

      {/* Lab Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Pending Tests</p>
                <p className="text-2xl font-bold text-slate-800">{stats.pendingTests || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Completed Today</p>
                <p className="text-2xl font-bold text-slate-800">{stats.completedToday || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total This Week</p>
                <p className="text-2xl font-bold text-slate-800">{stats.weeklyTotal || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Average TAT</p>
                <p className="text-2xl font-bold text-slate-800">{stats.averageTat || 'N/A'}</p>
              </div>
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Timer className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Test Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Test Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTests.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending test requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Test Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Requested By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pendingTests.map((test) => (
                    <tr key={test.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                            <FlaskConical className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{test.patientName}</p>
                            <p className="text-xs text-slate-500">ID: #P{test.patientId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{test.testType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">Dr. {test.doctorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        {new Date(test.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={test.priority === 'urgent' ? 'destructive' : 'secondary'}>
                          {test.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-secondary hover:bg-cyan-600">
                            Start Test
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload and Recent Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Report Form */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Test Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Patient</label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose from pending tests" />
                </SelectTrigger>
                <SelectContent>
                  {pendingTests.map((test) => (
                    <SelectItem key={test.id} value={test.id.toString()}>
                      {test.patientName} - {test.testType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Token Number</label>
              <Input
                value={tokenNumber}
                onChange={(e) => setTokenNumber(e.target.value)}
                placeholder="Enter token number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload Report</label>
              <div 
                className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">Drop files here or click to upload</p>
                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any remarks or summary..."
                className="h-20"
              />
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete & Upload
            </Button>
          </CardContent>
        </Card>

        {/* Recent Completed Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Completed</CardTitle>
          </CardHeader>
          <CardContent>
            {completedTests.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No completed tests yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedTests.slice(0, 5).map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">{test.patientName}</p>
                      <p className="text-sm text-slate-500">{test.testType}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(test.completedAt).toLocaleDateString()} - {new Date(test.completedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 mb-2">Completed</Badge>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
}
