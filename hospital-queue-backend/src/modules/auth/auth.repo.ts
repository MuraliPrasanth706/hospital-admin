import { query } from "../../config/db";
import { pool } from "../../config/db";

export const createUser = async (data: any) => {
  const insertQuery = `INSERT INTO users(name,phone,password,role) VALUES($1, $2, $3, $4) RETURNING *`;

  const { rows } = await query(insertQuery, [
    data.name,
    data.phone,
    data.password,
    data.role,
  ]);
  return rows[0];
};

export const createDoctorUser = async (data: {
  name: string;
  phone: string;
  password: string;
  specialization: string;
  clinic_id: string;
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const userResult = await client.query(
      `INSERT INTO users(name, phone, password, role) VALUES($1, $2, $3, 'doctor') RETURNING *`,
      [data.name, data.phone, data.password, ],
    );
    const user = userResult.rows[0];
    const doctorResult = await client.query(
      `INSERT INTO doctors(name, specialization, clinic_id, user_id) VALUES($1, $2, $3, $4) RETURNING *`,
      [data.name, data.specialization, data.clinic_id, user.id],
    );
    await client.query("COMMIT");
    return { user, doctor: doctorResult.rows[0] };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const findUserByPhone = async (phone: string) => {
  const selectQuery = `
        SELECT u.*, c.id as clinic_id, d.id as doctor_id
        FROM users u 
        LEFT JOIN clinics c ON c.admin_user_id = u.id 
        LEFT JOIN doctors d ON d.user_id = u.id
        WHERE u.phone = $1`;
  const { rows } = await query(selectQuery, [phone]);
  return rows[0];
};

export const findUserByEmail = async (email: string) => {
  const selectQuery = `
        SELECT u.*, c.id as clinic_id, d.id as doctor_id
        FROM users u
        LEFT JOIN clinics c ON c.admin_user_id = u.id
        LEFT JOIN doctors d ON d.user_id = u.id
        WHERE u.email = $1`;
  const { rows } = await query(selectQuery, [email]);
  return rows[0];
};
