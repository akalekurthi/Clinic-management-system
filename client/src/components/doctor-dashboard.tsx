import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, FlaskConical, CheckCircle, History, Plus, Eye } from "lucide-react";

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [prescription, setPrescription] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  const { data: appointments = [] } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: labTests = [] } = useQuery({
    queryKey: ["/api/lab-tests"],
  });

  const { data: stats = {} } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toDateString();
    return new Date(apt.appointmentDate).toDateString() === today;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-sm text-slate-500">Today's Patients</span>
            <p className="font-medium text-2xl">{stats.todayAppointments || 0}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Today's Appointments</p>
                <p className="text-2xl font-bold text-slate-800">{stats.todayAppointments || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Pending Lab Requests</p>
                <p className="text-2xl font-bold text-slate-800">{stats.pendingLabs || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-slate-800">{stats.completed || 0}</p>
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
                <p className="text-slate-500 text-sm">Next Patient</p>
                <p className="text-lg font-bold text-slate-800">
                  {todayAppointments[0] ? new Date(todayAppointments[0].appointmentDate).toLocaleTimeString() : 'None'}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today's Appointments</CardTitle>
          <Button className="bg-secondary hover:bg-cyan-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Lab Test
          </Button>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Token</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {todayAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        {new Date(appointment.appointmentDate).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{appointment.patientName}</p>
                            <p className="text-xs text-slate-500">ID: #{appointment.patientId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className="bg-secondary text-white">
                          {appointment.tokenNumber || 'N/A'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <History className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <FlaskConical className="h-4 w-4" />
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Prescription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient from today's appointments" />
                </SelectTrigger>
                <SelectContent>
                  {todayAppointments.map((apt) => (
                    <SelectItem key={apt.id} value={apt.id.toString()}>
                      {apt.patientName} - Token {apt.tokenNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
              <Input
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prescription</label>
              <Textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Enter prescription details..."
                className="h-20"
              />
            </div>
            <Button className="w-full">
              Save Prescription
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Lab Results</CardTitle>
          </CardHeader>
          <CardContent>
            {labTests.filter(test => test.status === 'completed').length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent lab results</p>
              </div>
            ) : (
              <div className="space-y-4">
                {labTests.filter(test => test.status === 'completed').slice(0, 3).map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">{test.testType} - {test.patientName}</p>
                      <p className="text-sm text-slate-500">
                        Completed: {new Date(test.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
