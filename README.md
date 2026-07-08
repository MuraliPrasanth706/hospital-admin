# Hospital Queue System

A full-stack hospital queue management system for clinics and hospitals. The project includes an admin web dashboard, a backend API, and a patient-facing mobile app for appointment booking and live queue tracking.

## Project Overview

The system is designed to reduce waiting-room confusion by giving hospital staff a clear operational dashboard and giving patients a simple mobile experience to book appointments, view doctors, and track queue status.

This repository contains three applications:

| App | Path | Purpose |
| --- | --- | --- |
| Admin Dashboard | `hospital-admin/` | Web dashboard for hospital staff to manage doctors, appointments, queues, and settings. |
| Backend API | `hospital-queue-backend/` | Node.js/TypeScript API layer for authentication, clinics, doctors, appointments, and queue data. |
| Mobile App | `hospital-queue-mobile/` | React Native/Expo patient app for login, hospital browsing, doctor selection, booking, and live queue updates. |

## System Design

The project follows a three-part client-server architecture:

```text
Patient Mobile App          Admin Web Dashboard
       |                            |
       |                            |
       +------------ API -----------+
                    |
              Backend Service
                    |
                Database
```

### Admin Dashboard

The admin dashboard is a Next.js application focused on hospital operations. It includes:

- Secure login flow with authentication guard.
- Dashboard overview for appointment and queue activity.
- Doctor management screens.
- Queue management views with current patient and upcoming patient panels.
- Appointment table for reviewing and tracking patient appointments.
- Reusable UI components for buttons, inputs, modals, status badges, avatars, and stat cards.

The interface is built for repeated operational use: clear navigation, compact information display, and quick access to common hospital staff actions.

### Backend API

The backend is a TypeScript Node.js service organized by domain modules:

- `auth`: authentication and login-related operations.
- `clinic`: clinic management.
- `doctor`: doctor records and availability-related data.
- `appointment`: appointment booking and queue-related flows.

The backend structure separates routes, controllers, services, and repositories so request handling, business logic, and database access stay maintainable.

### Mobile App

The mobile app is built for patients. It includes:

- Login and OTP screens.
- Hospital list screen.
- Doctor list screen.
- Appointment booking screen.
- Live queue tracking screen.
- Shared UI components and theme constants for consistent spacing, color, and typography.

## Repository Structure

```text
Hospital-Queue-System/
├── hospital-admin/
│   ├── app/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── hospital-queue-backend/
│   ├── db/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── hospital-queue-mobile/
│   ├── assets/
│   ├── src/
│   ├── App.tsx
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Tech Stack

### Frontend Admin

- Next.js
- React
- TypeScript
- Zustand for state management
- CSS-based component styling

### Backend

- Node.js
- Express
- TypeScript
- Modular controller/service/repository architecture
- SQL schema and seed files under `hospital-queue-backend/db/`

### Mobile

- React Native
- Expo
- TypeScript
- Zustand for app state

## Getting Started

Install dependencies separately for each app.

### Admin Dashboard

```bash
cd hospital-admin
npm install
npm run dev
```

The admin dashboard should run on the local Next.js development server, commonly:

```text
http://localhost:3000
```

### Backend API

```bash
cd hospital-queue-backend
npm install
npm run dev
```

Create a local `.env` file before running the backend. Do not commit `.env` files to Git.

Example values depend on your local database and authentication setup.

### Mobile App

```bash
cd hospital-queue-mobile
npm install
npm start
```

Then open the app using Expo Go, an iOS simulator, or an Android emulator.

## Environment Files

Environment files are intentionally ignored by Git:

```text
.env
.env.*
```

Keep secrets such as database URLs, JWT secrets, API keys, and local service URLs in environment files only.

## Git Ignore Policy

The repository ignores generated and local-only files, including:

```text
node_modules/
.env
.env.*
.next/
.expo/
dist/
build/
.DS_Store
```

This keeps the repository focused on source code and reproducible configuration.

## Key Workflows

### Appointment Flow

1. Patient opens the mobile app.
2. Patient selects a hospital or clinic.
3. Patient selects a doctor.
4. Patient books an appointment.
5. Backend stores appointment and queue data.
6. Admin dashboard displays appointments and queue status.
7. Patient tracks live queue updates from the mobile app.

### Admin Queue Flow

1. Admin logs into the dashboard.
2. Admin views doctors and appointment queues.
3. Admin monitors the current patient.
4. Admin checks upcoming patients.
5. Queue state is updated through backend APIs.

## Design Direction

The product is designed around speed, clarity, and operational confidence.

For hospital staff:

- Dense but readable dashboard layouts.
- Clear status indicators.
- Fast access to queue and doctor information.
- Minimal visual noise during high-pressure clinic operations.

For patients:

- Simple step-by-step booking.
- Clear doctor and hospital selection.
- Live queue visibility.
- Mobile-first navigation and readable appointment status.

## Current Status

This is an active proof-of-concept project with three coordinated applications. The core structure for admin, backend, and mobile experiences is present, with room to extend real-time queue updates, production authentication, deployment configuration, and database migrations.

## Future Improvements

- Add real-time queue updates using WebSockets or server-sent events.
- Add role-based access control for hospital admins and staff.
- Add appointment cancellation and rescheduling.
- Add doctor availability management.
- Add patient notifications.
- Add production deployment guides for admin, backend, and mobile builds.
- Add automated tests for backend services and frontend flows.
