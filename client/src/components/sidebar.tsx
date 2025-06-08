import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  if (!user) return null;

  const getNavigationItems = () => {
    switch (user.role) {
      case 'patient':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', active: true },
          { icon: Calendar, label: 'Appointments' },
          { icon: FlaskConical, label: 'Lab Reports' },
          { icon: FileText, label: 'Prescriptions' },
          { icon: Upload, label: 'Upload Reports' },
          { icon: User, label: 'Profile' }
        ];
      case 'doctor':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', active: true },
          { icon: Calendar, label: 'Appointments' },
          { icon: Users, label: 'Patient History' },
          { icon: FileText, label: 'Prescriptions' },
          { icon: FlaskConical, label: 'Lab Requests' },
          { icon: User, label: 'Profile' }
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', active: true },
          { icon: Stethoscope, label: 'Manage Doctors' },
          { icon: Calendar, label: 'Appointments' },
          { icon: Ticket, label: 'Tokens' },
          { icon: BarChart3, label: 'Reports' },
          { icon: User, label: 'Profile' }
        ];
      case 'lab':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', active: true },
          { icon: FlaskConical, label: 'Test Requests' },
          { icon: Upload, label: 'Upload Reports' },
          { icon: ClipboardList, label: 'Test History' },
          { icon: User, label: 'Profile' }
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
            return (
              <li key={index}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-blue-100 hover:bg-blue-600 hover:text-white ${
                    item.active ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
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
