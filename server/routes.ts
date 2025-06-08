import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertAppointmentSchema, insertDoctorSchema, insertPrescriptionSchema, insertLabTestSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'));
    }
  }
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Appointments API
  app.get("/api/appointments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const appointments = await storage.getAppointmentsByUser(req.user!.id, req.user!.role);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        patientId: req.user!.id
      });
      
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Failed to create appointment" });
    }
  });

  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const appointmentId = parseInt(req.params.id);
      const { status, tokenNumber } = req.body;
      
      const appointment = await storage.updateAppointment(appointmentId, { status, tokenNumber });
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Failed to update appointment" });
    }
  });

  // Doctors API
  app.get("/api/doctors", async (req, res) => {
    try {
      const doctors = await storage.getAllDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  app.post("/api/doctors", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user!.role !== 'admin') {
        return res.sendStatus(403);
      }
      
      const doctorData = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(doctorData);
      res.status(201).json(doctor);
    } catch (error) {
      res.status(400).json({ message: "Failed to create doctor" });
    }
  });

  // Prescriptions API
  app.get("/api/prescriptions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const prescriptions = await storage.getPrescriptionsByUser(req.user!.id, req.user!.role);
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prescriptions" });
    }
  });

  app.post("/api/prescriptions", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user!.role !== 'doctor') {
        return res.sendStatus(403);
      }
      
      const prescriptionData = insertPrescriptionSchema.parse({
        ...req.body,
        doctorId: req.user!.id
      });
      
      const prescription = await storage.createPrescription(prescriptionData);
      res.status(201).json(prescription);
    } catch (error) {
      res.status(400).json({ message: "Failed to create prescription" });
    }
  });

  // Lab Tests API
  app.get("/api/lab-tests", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const labTests = await storage.getLabTestsByUser(req.user!.id, req.user!.role);
      res.json(labTests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lab tests" });
    }
  });

  app.post("/api/lab-tests", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user!.role !== 'doctor') {
        return res.sendStatus(403);
      }
      
      const labTestData = insertLabTestSchema.parse({
        ...req.body,
        doctorId: req.user!.id,
        status: 'requested'
      });
      
      const labTest = await storage.createLabTest(labTestData);
      res.status(201).json(labTest);
    } catch (error) {
      res.status(400).json({ message: "Failed to create lab test request" });
    }
  });

  app.patch("/api/lab-tests/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user!.role !== 'lab') {
        return res.sendStatus(403);
      }
      
      const testId = parseInt(req.params.id);
      const { status, remarks } = req.body;
      
      const labTest = await storage.updateLabTest(testId, { 
        status, 
        remarks,
        completedAt: status === 'completed' ? new Date() : undefined,
        labAssistantId: req.user!.id
      });
      
      res.json(labTest);
    } catch (error) {
      res.status(400).json({ message: "Failed to update lab test" });
    }
  });

  // File upload for lab reports
  app.post("/api/lab-tests/:id/upload", upload.single('report'), async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user!.role !== 'lab') {
        return res.sendStatus(403);
      }
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const testId = parseInt(req.params.id);
      const reportUrl = `/uploads/${req.file.filename}`;
      
      const labTest = await storage.updateLabTest(testId, { 
        reportUrl,
        status: 'completed',
        completedAt: new Date(),
        labAssistantId: req.user!.id
      });
      
      res.json(labTest);
    } catch (error) {
      res.status(400).json({ message: "Failed to upload report" });
    }
  });

  // Token Queue API
  app.get("/api/token-queue", async (req, res) => {
    try {
      const tokens = await storage.getTodayTokenQueue();
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch token queue" });
    }
  });

  app.post("/api/token-queue/assign", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user!.role !== 'admin') {
        return res.sendStatus(403);
      }
      
      const { appointmentId } = req.body;
      const token = await storage.assignToken(appointmentId);
      res.json(token);
    } catch (error) {
      res.status(400).json({ message: "Failed to assign token" });
    }
  });

  // Dashboard Stats API
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const stats = await storage.getDashboardStats(req.user!.role);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  const httpServer = createServer(app);
  return httpServer;
}
