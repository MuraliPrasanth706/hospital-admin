-- ============================================================
-- Hospital Queue System — Seed Data (development only)
-- Run AFTER schema.sql
-- ============================================================

-- 1. Admin user (password: admin123 — bcrypt hash)
INSERT INTO users (id, name, phone, email, password, role)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Hospital Admin',
  '9000000001',
  'admin@apollo.com',
  '$2b$10$3RSkmgAoFeYxMAN68ZGuo.fZFBLFr52QiNqy23ks5lV88Gj2.asRe', -- admin123
  'admin'
)
ON CONFLICT DO NOTHING;

-- 2. Clinic owned by that admin
INSERT INTO clinics (id, name, address, admin_user_id)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'Apollo Clinic - Bandra',
  '12 Linking Road, Bandra, Mumbai',
  'a0000000-0000-0000-0000-000000000001'
)
ON CONFLICT DO NOTHING;

-- 3. Doctor user (password: doctor123 — bcrypt hash)
INSERT INTO users (id, name, phone, password, role)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Dr. Priya Sharma',
  '9000000002',
  '$2b$10$31vd8LG0qp9lUxeKlC797e7aIJV55Gx24t5ZYFRL.62AFu71mEy8q', -- doctor123
  'doctor'
)
ON CONFLICT DO NOTHING;

-- 4. Doctor record linked to clinic + user
INSERT INTO doctors (id, name, specialization, clinic_id, user_id)
VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'Dr. Priya Sharma',
  'General Physician',
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002'
)
ON CONFLICT DO NOTHING;

-- 5. Patient user (password: patient123 — bcrypt hash)
INSERT INTO users (id, name, phone, password, role)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Rahul Mehta',
  '9000000003',
  '$2b$10$M5SjmBsn4.QhMB2mwpIqfeYUZDIOcaU/CK4Guvg65Iue.O0M4/.Em', -- patient123
  'patient'
)
ON CONFLICT DO NOTHING;
