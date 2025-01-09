import { Pool } from "pg";

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const pool = new Pool({
	host: process.env.POSTGRES_HOST,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	port: Number(process.env.POSTGRES_PORT),
	idleTimeoutMillis: Number(process.env.POSTGRES_TIMEOUT_MS),
});

export default pool;