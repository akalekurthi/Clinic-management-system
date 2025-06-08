import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Calendar, DollarSign, Clock, UserPlus, Edit, Trash2, Eye } from "lucide-react";

export default function AdminDashboard() {
  const { data: doctors = [] } = useQuery({
    queryKey: ["/api/doctors"],
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: stats = {} } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const pendingAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toDateString();
    return new Date(apt.appointmentDate).toDateString() === today;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Button className="bg-primary hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total Doctors</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalDoctors || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-green-600">↑ Available today: {doctors.filter(d => d.isActive).length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Today's Appointments</p>
                <p className="text-2xl font-bold text-slate-800">{stats.todayAppointments || 0}</p>
              </div>
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-green-600">↑ 15% vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Revenue (Today)</p>
                <p className="text-2xl font-bold text-slate-800">${stats.revenue || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-green-600">↑ 8% vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Pending Approvals</p>
                <p className="text-2xl font-bold text-slate-800">{stats.pendingApprovals || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-orange-600">Needs attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Appointments Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">Chart visualization would go here</p>
                <p className="text-sm text-slate-400">Integration with Chart.js or Recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAppointments.slice(0, 3).map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">{approval.patientName}</p>
                      <p className="text-sm text-slate-500">Dr. {approval.doctorName} - {approval.specialty}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(approval.appointmentDate).toLocaleDateString()} - {new Date(approval.appointmentDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Token Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Token Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Current Token</span>
                <span className="text-2xl font-bold text-primary">{todayAppointments.length}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Last assigned: {new Date().toLocaleTimeString()}</span>
                <span>Queue: {pendingAppointments.length} waiting</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm">Next Patient:</span>
                <span className="font-medium">{pendingAppointments[0]?.patientName || 'None'}</span>
              </div>
              <Button className="w-full" disabled={pendingAppointments.length === 0}>
                Assign Token #{todayAppointments.length + 1}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Doctor Management</CardTitle>
          <Button className="bg-primary hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Doctor
          </Button>
        </CardHeader>
        <CardContent>
          {doctors.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No doctors registered</p>
              <Button className="mt-4">
                Add First Doctor
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Specialty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Today's Patients</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback className="bg-slate-200 text-slate-600">
                              Dr
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-slate-800">Dr. {doctor.firstName} {doctor.lastName}</p>
                            <p className="text-xs text-slate-500">{doctor.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{doctor.specialty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        {todayAppointments.filter(apt => apt.doctorId === doctor.id).length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={doctor.isActive ? 'default' : 'secondary'}>
                          {doctor.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
