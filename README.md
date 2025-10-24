🧾 ScanToOrder — Real-time Ordering Web App
(No Dashboard ><>)

Tech Stack: React (TypeScript) + Node.js (Fastify) + WebSocket + Prisma + PostgreSQL

A real-time web application for managing and placing orders seamlessly between clients and servers.
Built with a modern full-stack architecture designed for performance and scalability.

📦 Installation Guide (English)
1. Install Client Dependencies
cd client
npm install --force

2. Install Server Dependencies
cd server
npm install --force

3. Setup Environment Variables

Create a .env file inside the server directory and add the following lines:

DATABASE_URL="postgresql://root:rootpassword@localhost:15432/ScanToOrder"
JWT_SECRET=anything

4. Initialize Prisma

After setting up .env, run:

npx prisma generate
npx prisma migrate dev

5. Run Development Server
npm run dev


After running the development server, a test database named ScanToOrder.sql will be available.
You can import it to your PostgreSQL instance for testing.

🇹🇭 คู่มือการติดตั้ง (ภาษาไทย)
1. ติดตั้ง Client
cd client
npm install --force

2. ติดตั้ง Server
cd server
npm install --force

3. สร้างไฟล์ Environment (.env)

สร้างไฟล์ชื่อ .env ภายในโฟลเดอร์ server แล้วใส่ค่าดังนี้:

DATABASE_URL="postgresql://root:rootpassword@localhost:15432/ScanToOrder"
JWT_SECRET=anything

4. รัน Prisma

หลังจากสร้าง .env แล้ว ให้รันคำสั่ง:

npx prisma generate
npx prisma migrate dev

5. รันเซิร์ฟเวอร์สำหรับพัฒนา
npm run dev


เมื่อรันเซิร์ฟเวอร์แล้ว จะมีฐานข้อมูลทดสอบชื่อ ScanToOrder.sql
สามารถนำไฟล์นี้ไป import เข้าฐานข้อมูล PostgreSQL เพื่อทดลองใช้งานได้

💡 Features

🕒 Real-time order updates using WebSocket

⚡ Fast backend with Fastify

💾 Database management via Prisma ORM

🧠 Type-safe frontend with React + TypeScript

🔐 JWT-based authentication

📁 Project Structure
ScanToOrder/
│
├── client/         # React + TypeScript frontend
├── server/         # Node.js Fastify backend
│   ├── prisma/     # Prisma schema and migrations
│   └── .env        # Environment configuration
└── ScanToOrder.sql # Sample database for testing

🧑‍💻 Developer Notes

Make sure your PostgreSQL server is running and accessible at the specified DATABASE_URL before running migrations or importing the test database.

[Photo]

![1](./1.png)
![2](./2.png)
![3](./3.png)
![4](./4.png)
![5](./5.png)