/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://InterVerseDB_owner:fHsqAavPx4J5@ep-round-snow-a1qdlo2m.ap-southeast-1.aws.neon.tech/InterVerseDB?sslmode=require",
  }
};
