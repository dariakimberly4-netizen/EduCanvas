import { MongoClient, ServerApiVersion } from "mongodb";

export class MongoConfigurationError extends Error {
  constructor() {
    super("MONGODB_URI is not configured.");
    this.name = "MongoConfigurationError";
  }
}

declare global {
  var educanvasMongoClientPromise: Promise<MongoClient> | undefined;
}

function createMongoClient() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new MongoConfigurationError();
  }

  return new MongoClient(uri, {
    appName: "EduCanvas",
    maxIdleTimeMS: 60_000,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

export function getMongoClient() {
  if (!globalThis.educanvasMongoClientPromise) {
    globalThis.educanvasMongoClientPromise = createMongoClient()
      .connect()
      .catch((error) => {
        globalThis.educanvasMongoClientPromise = undefined;
        throw error;
      });
  }

  return globalThis.educanvasMongoClientPromise;
}

export async function getMongoDatabase() {
  const client = await getMongoClient();
  const databaseName = process.env.MONGODB_DATABASE?.trim();
  return databaseName ? client.db(databaseName) : client.db();
}
