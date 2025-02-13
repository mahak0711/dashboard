const { db } = require("../app/lib/db"); // ✅ Use require
const bcrypt = require("bcryptjs");

async function main() {
  const hashedPassword = await bcrypt.hash("adminpassword", 10);

  await db.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit());
