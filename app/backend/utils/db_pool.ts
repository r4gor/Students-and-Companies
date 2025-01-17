import { Pool } from "pg";

const pool = new Pool({
	host: <string>process.env.POSTGRES_HOST,
	user: <string>process.env.POSTGRES_USER,
	password: <string>process.env.POSTGRES_PASSWORD,
	database: <string>process.env.POSTGRES_DB,
	port: <number><unknown>process.env.POSTGRES_PORT,
	idleTimeoutMillis: <number><unknown>process.env.POSTGRES_TIMEOUT_MS,
});

export default pool;