import { users, doctors, appointments, prescriptions, labTests, tokenQueue, type User, type InsertUser, type Doctor, type InsertDoctor, type Appointment, type InsertAppointment, type Prescription, type InsertPrescription, type LabTest, type InsertLabTest, type TokenQueue } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Doctor management
  getAllDoctors(): Promise<Doctor[]>;
  getDoctorByUserId(userId: number): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  
  // Appointment management
  getAppointmentsByUser(userId: number, role: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment>;
  
  // Prescription management
  getPrescriptionsByUser(userId: number, role: string): Promise<Prescription[]>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  
  // Lab test management
  getLabTestsByUser(userId: number, role: string): Promise<LabTest[]>;
  createLabTest(labTest: InsertLabTest): Promise<LabTest>;
  updateLabTest(id: number, updates: Partial<LabTest>): Promise<LabTest>;
  
  // Token queue management
  getTodayTokenQueue(): Promise<TokenQueue[]>;
  assignToken(appointmentId: number): Promise<TokenQueue>;
  
  // Dashboard stats
  getDashboardStats(role: string): Promise<any>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private doctors: Map<number, Doctor>;
  private appointments: Map<number, Appointment>;
  private prescriptions: Map<number, Prescription>;
  private labTests: Map<number, LabTest>;
  private tokenQueue: Map<number, TokenQueue>;
  private currentId: number;
  public sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.doctors = new Map();
    this.appointments = new Map();
    this.prescriptions = new Map();
    this.labTests = new Map();
    this.tokenQueue = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample users with different roles
    const sampleUsers = [
      { username: "patient1", password: "password", email: "patient@example.com", role: "patient", firstName: "John", lastName: "Doe", phone: "123-456-7890" },
      { username: "doctor1", password: "password", email: "doctor@example.com", role: "doctor", firstName: "Dr. Sarah", lastName: "Wilson", phone: "123-456-7891" },
      { username: "admin1", password: "password", email: "admin@example.com", role: "admin", firstName: "Admin", lastName: "User", phone: "123-456-7892" },
      { username: "lab1", password: "password", email: "lab@example.com", role: "lab", firstName: "Lab", lastName: "Assistant", phone: "123-456-7893" }
    ];
    
    for (const userData of sampleUsers) {
      const user = await this.createUser(userData);
      if (user.role === 'doctor') {
        await this.createDoctor({
          userId: user.id,
          specialty: "Cardiology",
          department: "Cardiology",
          licenseNumber: "DOC123",
          experience: 5
        });
      }
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values()).filter(doctor => doctor.isActive);
  }

  async getDoctorByUserId(userId: number): Promise<Doctor | undefined> {
    return Array.from(this.doctors.values()).find(doctor => doctor.userId === userId);
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = this.currentId++;
    const doctor: Doctor = { 
      ...insertDoctor, 
      id,
      isActive: true
    };
    this.doctors.set(id, doctor);
    return doctor;
  }

  async getAppointmentsByUser(userId: number, role: string): Promise<Appointment[]> {
    const appointments = Array.from(this.appointments.values());
    
    switch (role) {
      case 'patient':
        return appointments.filter(apt => apt.patientId === userId);
      case 'doctor':
        const doctor = await this.getDoctorByUserId(userId);
        return doctor ? appointments.filter(apt => apt.doctorId === doctor.id) : [];
      case 'admin':
      case 'lab':
        return appointments;
      default:
        return [];
    }
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentId++;
    const appointment: Appointment = { 
      ...insertAppointment, 
      id,
      status: 'scheduled',
      tokenNumber: null,
      createdAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.appointments.get(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    const updatedAppointment = { ...appointment, ...updates };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async getPrescriptionsByUser(userId: number, role: string): Promise<Prescription[]> {
    const prescriptions = Array.from(this.prescriptions.values());
    
    switch (role) {
      case 'patient':
        return prescriptions.filter(rx => rx.patientId === userId);
      case 'doctor':
        const doctor = await this.getDoctorByUserId(userId);
        return doctor ? prescriptions.filter(rx => rx.doctorId === doctor.id) : [];
      case 'admin':
        return prescriptions;
      default:
        return [];
    }
  }

  async createPrescription(insertPrescription: InsertPrescription): Promise<Prescription> {
    const id = this.currentId++;
    const prescription: Prescription = { 
      ...insertPrescription, 
      id,
      createdAt: new Date()
    };
    this.prescriptions.set(id, prescription);
    return prescription;
  }

  async getLabTestsByUser(userId: number, role: string): Promise<LabTest[]> {
    const labTests = Array.from(this.labTests.values());
    
    switch (role) {
      case 'patient':
        return labTests.filter(test => test.patientId === userId);
      case 'doctor':
        const doctor = await this.getDoctorByUserId(userId);
        return doctor ? labTests.filter(test => test.doctorId === doctor.id) : [];
      case 'lab':
        return labTests;
      case 'admin':
        return labTests;
      default:
        return [];
    }
  }

  async createLabTest(insertLabTest: InsertLabTest): Promise<LabTest> {
    const id = this.currentId++;
    const labTest: LabTest = { 
      ...insertLabTest, 
      id,
      status: 'requested',
      requestedAt: new Date(),
      completedAt: null,
      labAssistantId: null,
      reportUrl: null,
      remarks: null
    };
    this.labTests.set(id, labTest);
    return labTest;
  }

  async updateLabTest(id: number, updates: Partial<LabTest>): Promise<LabTest> {
    const labTest = this.labTests.get(id);
    if (!labTest) {
      throw new Error('Lab test not found');
    }
    
    const updatedLabTest = { ...labTest, ...updates };
    this.labTests.set(id, updatedLabTest);
    return updatedLabTest;
  }

  async getTodayTokenQueue(): Promise<TokenQueue[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return Array.from(this.tokenQueue.values()).filter(token => {
      const tokenDate = new Date(token.queueDate);
      return tokenDate >= today && tokenDate < tomorrow;
    });
  }

  async assignToken(appointmentId: number): Promise<TokenQueue> {
    const id = this.currentId++;
    const todayTokens = await this.getTodayTokenQueue();
    const nextTokenNumber = todayTokens.length + 1;
    
    const token: TokenQueue = {
      id,
      appointmentId,
      tokenNumber: nextTokenNumber,
      queueDate: new Date(),
      status: 'waiting',
      estimatedTime: nextTokenNumber * 15 // 15 minutes per patient
    };
    
    this.tokenQueue.set(id, token);
    
    // Update appointment with token number
    await this.updateAppointment(appointmentId, { 
      tokenNumber: nextTokenNumber,
      status: 'confirmed'
    });
    
    return token;
  }

  async getDashboardStats(role: string): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = Array.from(this.appointments.values()).filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= today && aptDate < tomorrow;
    });
    
    const todayLabTests = Array.from(this.labTests.values()).filter(test => {
      const testDate = new Date(test.requestedAt);
      return testDate >= today && testDate < tomorrow;
    });
    
    switch (role) {
      case 'patient':
        return {
          upcomingAppointments: todayAppointments.length,
          pendingReports: todayLabTests.filter(test => test.status === 'completed' && test.reportUrl).length,
          prescriptions: this.prescriptions.size
        };
        
      case 'doctor':
        return {
          todayAppointments: todayAppointments.length,
          pendingLabs: todayLabTests.filter(test => test.status === 'requested').length,
          completed: todayAppointments.filter(apt => apt.status === 'completed').length
        };
        
      case 'admin':
        return {
          totalDoctors: this.doctors.size,
          todayAppointments: todayAppointments.length,
          revenue: todayAppointments.length * 50, // $50 per appointment
          pendingApprovals: todayAppointments.filter(apt => apt.status === 'scheduled').length
        };
        
      case 'lab':
        return {
          pendingTests: todayLabTests.filter(test => test.status === 'requested').length,
          completedToday: todayLabTests.filter(test => test.status === 'completed').length,
          weeklyTotal: this.labTests.size,
          averageTat: "2.4h"
        };
        
      default:
        return {};
    }
  }
}

export const storage = new MemStorage();
