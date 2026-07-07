import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import clinicRoutes from "./modules/clinic/clinic.routes";
import doctorRoutes from "./modules/doctor/doctor.routes";
import appointmentRoutes from "./modules/appointment/appointment.routes";

const app = express();

// CORS — allow frontend dev server
app.use((req, res, next) => {
  const allowed = process.env.CORS_ORIGIN || "http://localhost:3000";
  res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/clinics", clinicRoutes);
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);

export default app;