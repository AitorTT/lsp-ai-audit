export const configuration = () => ({
  port: parseInt(process.env.PORT as string, 10) || 4000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "change-me-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  cors: {
    origin: (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:4200").split(",").map((o) => o.trim()),
  },
});
