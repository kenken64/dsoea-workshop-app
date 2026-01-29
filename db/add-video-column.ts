import { createClient } from "@libsql/client";

async function addColumn() {
  const client = createClient({
    url: "file:workshop.db",
  });

  try {
    await client.execute("ALTER TABLE pages ADD COLUMN video_url TEXT");
    console.log("Column video_url added successfully");
  } catch (e: any) {
    if (e.message.includes("duplicate column")) {
      console.log("Column video_url already exists");
    } else {
      console.error("Error:", e.message);
    }
  }
}

addColumn();
