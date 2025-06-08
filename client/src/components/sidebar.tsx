import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation, Link } from "wouter";
import { 
  Hospital, 
  LayoutDashboard, 
  Calendar, 
  FlaskConical, 
  FileText, 
  Upload, 
  User, 
  LogOut,
  Users,
  Stethoscope,
  ClipboardList,
  BarChart3,
  UserCog,
  Ticket
} from "lucide-react";

export default function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const getNavigationItems = () => {
    switch (user.role) {
      case 'patient':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          { icon: FlaskConical, label: 'Lab Reports', path: '/lab-reports' },
          { icon: FileText, label: 'Prescriptions', path: '/prescriptions' },
          { icon: Upload, label: 'Upload Reports', path: '/upload' },
          { icon: User, label: 'Profile', path: '/profile' }
        ];
      case 'doctor':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          { icon: Users, label: 'Patient History', path: '/patients' },
          { icon: FileText, label: 'Prescriptions', path: '/prescriptions' },
          { icon: FlaskConical, label: 'Lab Requests', path: '/lab-requests' },
          { icon: User, label: 'Profile', path: '/profile' }
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
          { icon: Stethoscope, label: 'Manage Doctors', path: '/doctors' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          { icon: Ticket, label: 'Tokens', path: '/tokens' },
          { icon: BarChart3, label: 'Reports', path: '/reports' },
          { icon: User, label: 'Profile', path: '/profile' }
        ];
      case 'lab':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
          { icon: FlaskConical, label: 'Test Requests', path: '/test-requests' },
          { icon: Upload, label: 'Upload Reports', path: '/upload' },
          { icon: ClipboardList, label: 'Test History', path: '/history' },
          { icon: User, label: 'Profile', path: '/profile' }
        ];
      default:
        return [];
    }
  };

  const getRoleDisplayName = () => {
    switch (user.role) {
      case 'patient':
        return 'Patient Dashboard';
      case 'doctor':
        return 'Doctor Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      case 'lab':
        return 'Lab Assistant Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="w-64 bg-primary text-white fixed left-0 top-0 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-blue-600">
        <div className="flex items-center gap-3">
          <Hospital className="h-8 w-8" />
          <div>
            <h1 className="text-lg font-bold">HealthCare CMS</h1>
            <p className="text-blue-200 text-sm">{getRoleDisplayName()}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {getNavigationItems().map((item, index) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <li key={index}>
                <Link href={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-blue-100 hover:bg-blue-600 hover:text-white ${
                      isActive ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-blue-600">
        <div className="bg-blue-600 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-500 text-white">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
              <p className="text-blue-200 text-xs">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-blue-200 hover:text-white hover:bg-blue-500"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );
}
