import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import Sidebar from "@/components/sidebar";
import PatientDashboard from "@/components/patient-dashboard";
import DoctorDashboard from "@/components/doctor-dashboard";
import AdminDashboard from "@/components/admin-dashboard";
import LabDashboard from "@/components/lab-dashboard";
import PatientAppointments from "@/components/patient/appointments";
import PatientLabReports from "@/components/patient/lab-reports";
import PatientPrescriptions from "@/components/patient/prescriptions";
import PatientProfile from "@/components/patient/profile";

export default function Dashboard() {
  const { user } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const renderContent = () => {
    if (location !== '/') {
      switch (location) {
        case '/appointments':
          if (user.role === 'patient') {
            return <PatientAppointments />;
          }
          break;
        case '/lab-reports':
          if (user.role === 'patient') {
            return <PatientLabReports />;
          }
          break;
        case '/prescriptions':
          if (user.role === 'patient') {
            return <PatientPrescriptions />;
          }
          break;
        case '/profile':
          if (user.role === 'patient') {
            return <PatientProfile />;
          }
          break;
        default:
          return (
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-4 text-gray-800">
                {location.replace('/', '').replace('-', ' ').toUpperCase()}
              </h1>
              <p className="text-gray-600">
                This section is under development. Navigation is working correctly.
                {location === '/appointments' && ' Use the main dashboard to book appointments.'}
              </p>
            </div>
          );
      }
    }

    // Main dashboard content
    switch (user.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'lab':
        return <LabDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-6">
        {renderContent()}
      </main>
    </div>
  );
}
