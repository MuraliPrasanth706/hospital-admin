-- ============================================================
-- Hospital Queue System — Full Database Schema
-- Run once to initialize all tables
-- ============================================================

-- ============================================================
-- 1. USERS
--    Shared login table for admin, doctor, patient
-- ============================================================
  CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255)        NOT NULL,
    phone       VARCHAR(20)         NOT NULL UNIQUE,
    password    TEXT                NOT NULL,
    role        VARCHAR(20)         NOT NULL CHECK (role IN ('admin', 'doctor', 'patient')),
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
  );

CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users (role);


-- ============================================================
-- 2. CLINICS (hospitals)
--    Owned by one admin user
-- ============================================================
CREATE TABLE IF NOT EXISTS clinics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255)  NOT NULL,
  address       TEXT          NOT NULL,
  admin_user_id UUID          NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clinics_admin ON clinics (admin_user_id);


-- ============================================================
-- 3. DOCTORS
--    Belongs to a clinic; linked to a users row (for login)
-- ============================================================
CREATE TABLE IF NOT EXISTS doctors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255)  NOT NULL,
  specialization  VARCHAR(255)  NOT NULL,
  clinic_id       UUID          NOT NULL REFERENCES clinics (id) ON DELETE CASCADE,
  user_id         UUID          UNIQUE REFERENCES users (id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_clinic  ON doctors (clinic_id);
CREATE INDEX IF NOT EXISTS idx_doctors_user    ON doctors (user_id);


-- ============================================================
-- 4. APPOINTMENTS
--    A patient books a slot with a doctor
--    token = unique tracking string given to patient
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  doctor_id         UUID          NOT NULL REFERENCES doctors (id) ON DELETE CASCADE,
  appointment_date  DATE          NOT NULL,
  token             UUID          NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status            VARCHAR(20)   NOT NULL DEFAULT 'scheduled'
                      CHECK (status IN ('scheduled', 'checked_in', 'in_progress', 'completed', 'cancelled', 'skipped')),
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appt_patient   ON appointments (patient_id);
CREATE INDEX IF NOT EXISTS idx_appt_doctor    ON appointments (doctor_id);
CREATE INDEX IF NOT EXISTS idx_appt_token     ON appointments (token);
CREATE INDEX IF NOT EXISTS idx_appt_date      ON appointments (appointment_date);

-- ============================================================
-- 5. MIGRATIONS — safe to run on every startup
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS experience_years INT NOT NULL DEFAULT 0;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS avg_consult_minutes INT NOT NULL DEFAULT 10;
