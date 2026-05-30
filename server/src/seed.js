import bcrypt from "bcryptjs";
import prisma from "./config/prisma.js";

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (in reverse order of dependencies)
  await prisma.asset.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.subTask.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🗑️ Cleared existing database tables.");

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash("123456", salt);
  const userPassword = await bcrypt.hash("password123", salt);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@mts.com",
      name: "Codewave",
      password: adminPassword,
      role: "ADMIN",
      title: "Administrator",
      isActive: true,
    },
  });

  const john = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      name: "John Doe",
      password: userPassword,
      role: "USER",
      title: "Software Engineer",
      isActive: true,
    },
  });

  const jane = await prisma.user.create({
    data: {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      password: userPassword,
      role: "USER",
      title: "Product Manager",
      isActive: true,
    },
  });

  const alex = await prisma.user.create({
    data: {
      email: "alex.johnson@example.com",
      name: "Alex Johnson",
      password: userPassword,
      role: "USER",
      title: "UX Designer",
      isActive: true,
    },
  });

  console.log("👥 Created users.");

  // 2. Create Tasks
  const task1 = await prisma.task.create({
    data: {
      title: "Setup Cloud Infrastructure",
      priority: "HIGH",
      stage: "IN_PROGRESS",
      date: new Date(),
      team: {
        connect: [{ id: admin.id }, { id: john.id }],
      },
      subTasks: {
        create: [
          { title: "Configure VPC & Subnets", tag: "DevOps" },
          { title: "Setup RDS Postgres DB Instance", tag: "Database" },
        ],
      },
      activities: {
        create: [
          {
            type: "started",
            activity: "Began network configuration for the cloud environment.",
            byUserId: admin.id,
          },
          {
            type: "commented",
            activity: "Database instance is configured. Testing connections now.",
            byUserId: john.id,
          },
        ],
      },
      assets: {
        create: [
          { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500" },
        ],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Design Landing Page Mockup",
      priority: "MEDIUM",
      stage: "TODO",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      team: {
        connect: [{ id: alex.id }, { id: jane.id }],
      },
      subTasks: {
        create: [
          { title: "Wireframing checkout flow", tag: "Design" },
          { title: "Collect feedback on color palette", tag: "UIUX" },
        ],
      },
      activities: {
        create: [
          {
            type: "assigned",
            activity: "Assigned wireframe creations to Alex Johnson.",
            byUserId: admin.id,
          },
        ],
      },
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: "Fix Authentication Vulnerabilities",
      priority: "HIGH",
      stage: "COMPLETED",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday
      team: {
        connect: [{ id: john.id }, { id: admin.id }],
      },
      subTasks: {
        create: [
          { title: "Implement Zod Validation on register inputs", tag: "Security" },
          { title: "Add rate-limiting to auth endpoints", tag: "Backend" },
        ],
      },
      activities: {
        create: [
          {
            type: "completed",
            activity: "Password validation rules successfully hardened and tested.",
            byUserId: john.id,
          },
        ],
      },
    },
  });

  console.log("📝 Created tasks with subtasks and activities.");
  console.log("🌱 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
