import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hospital, UserPlus, LogIn, Stethoscope, Users, FlaskConical, Shield } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
    firstName: "",
    lastName: "",
    phone: ""
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  const roleIcons = {
    patient: <Users className="h-5 w-5" />,
    doctor: <Stethoscope className="h-5 w-5" />,
    admin: <Shield className="h-5 w-5" />,
    lab: <FlaskConical className="h-5 w-5" />
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary rounded-full">
                <Hospital className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">MediCare Clinic</h1>
            <p className="text-slate-600 mt-2">Comprehensive Healthcare Management</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        placeholder="Choose a username"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="Create a password"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={registerData.role} 
                        onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient">
                            <div className="flex items-center gap-2">
                              {roleIcons.patient}
                              Patient
                            </div>
                          </SelectItem>
                          <SelectItem value="doctor">
                            <div className="flex items-center gap-2">
                              {roleIcons.doctor}
                              Doctor
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              {roleIcons.admin}
                              Admin/Receptionist
                            </div>
                          </SelectItem>
                          <SelectItem value="lab">
                            <div className="flex items-center gap-2">
                              {roleIcons.lab}
                              Lab Assistant
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="flex-1 bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-8">
        <div className="text-center text-white max-w-lg">
          <Hospital className="h-24 w-24 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-bold mb-6">Modern Healthcare Management</h2>
          <p className="text-xl opacity-90 mb-8">
            Streamline your clinic operations with our comprehensive management system. 
            Manage appointments, prescriptions, lab tests, and more.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Patient Management</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              <span>Doctor Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              <span>Lab Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Admin Controls</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
