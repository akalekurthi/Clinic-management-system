import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import PatientDashboard from "@/components/patient-dashboard";
import DoctorDashboard from "@/components/doctor-dashboard";
import AdminDashboard from "@/components/admin-dashboard";
import LabDashboard from "@/components/lab-dashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const renderDashboard = () => {
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
        {renderDashboard()}
      </main>
    </div>
  );
}
