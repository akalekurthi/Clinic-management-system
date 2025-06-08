import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(), // patient, doctor, admin, lab
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  specialty: text("specialty").notNull(),
  department: text("department").notNull(),
  licenseNumber: text("license_number"),
  experience: integer("experience"),
  isActive: boolean("is_active").default(true),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  status: text("status").notNull(), // scheduled, confirmed, completed, cancelled
  reason: text("reason"),
  tokenNumber: integer("token_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  diagnosis: text("diagnosis").notNull(),
  medications: jsonb("medications").notNull(), // array of medication objects
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const labTests = pgTable("lab_tests", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  testType: text("test_type").notNull(),
  priority: text("priority").notNull(), // normal, urgent, emergency
  status: text("status").notNull(), // requested, in_progress, completed
  requestedAt: timestamp("requested_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  labAssistantId: integer("lab_assistant_id").references(() => users.id),
  reportUrl: text("report_url"),
  remarks: text("remarks"),
});

export const tokenQueue = pgTable("token_queue", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id).notNull(),
  tokenNumber: integer("token_number").notNull(),
  queueDate: timestamp("queue_date").defaultNow(),
  status: text("status").notNull(), // waiting, called, completed
  estimatedTime: integer("estimated_time"), // in minutes
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
  firstName: true,
  lastName: true,
  phone: true,
});

export const insertDoctorSchema = createInsertSchema(doctors).pick({
  userId: true,
  specialty: true,
  department: true,
  licenseNumber: true,
  experience: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  patientId: true,
  doctorId: true,
  appointmentDate: true,
  reason: true,
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).pick({
  appointmentId: true,
  doctorId: true,
  patientId: true,
  diagnosis: true,
  medications: true,
  instructions: true,
});

export const insertLabTestSchema = createInsertSchema(labTests).pick({
  appointmentId: true,
  doctorId: true,
  patientId: true,
  testType: true,
  priority: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type Prescription = typeof prescriptions.$inferSelect;
export type InsertLabTest = z.infer<typeof insertLabTestSchema>;
export type LabTest = typeof labTests.$inferSelect;
export type TokenQueue = typeof tokenQueue.$inferSelect;
