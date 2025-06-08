import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, FlaskConical, Upload, Download } from "lucide-react";
import AppointmentModal from "./appointment-modal";

export default function PatientDashboard() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: appointments = [] } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: prescriptions = [] } = useQuery({
    queryKey: ["/api/prescriptions"],
  });

  const { data: labTests = [] } = useQuery({
    queryKey: ["/api/lab-tests"],
  });

  const { data: stats = {} } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const nextAppointment = appointments.find(apt => new Date(apt.appointmentDate) > new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Patient Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-sm text-slate-500">Today's Date</span>
            <p className="font-medium">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Book Appointment</h3>
                <p className="text-sm text-slate-500">Schedule with specialists</p>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-secondary hover:bg-cyan-600" 
              onClick={() => setIsBookingModalOpen(true)}
            >
              Book New Appointment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Current Token</h3>
                <p className="text-sm text-slate-500">Queue position</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-3xl font-bold text-secondary">
                {nextAppointment?.tokenNumber || 'N/A'}
              </span>
              <p className="text-sm text-slate-500">Estimated: 30 mins</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Latest Report</h3>
                <p className="text-sm text-slate-500">Recent lab results</p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming appointments</p>
              <Button 
                className="mt-4" 
                onClick={() => setIsBookingModalOpen(true)}
              >
                Book Your First Appointment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Dr. {appointment.doctorName}</p>
                      <p className="text-sm text-slate-500">{appointment.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-800">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(appointment.appointmentDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptions.length === 0 ? (
              <div className="text-center py-4 text-slate-500">
                <p>No prescriptions available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.slice(0, 3).map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Dr. {prescription.doctorName}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Lab Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            {labTests.length === 0 ? (
              <div className="text-center py-4 text-slate-500">
                <p>No lab reports available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {labTests.filter(test => test.status === 'completed').slice(0, 3).map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{test.testType}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(test.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AppointmentModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
}
