# Client Project Tracker — Starter Project

โปรเจกต์นี้เป็น Starter Code สำหรับแบบทดสอบเทคนิค ตำแหน่ง Fullstack Developer (Junior) ของ Degito
รายละเอียดโจทย์ (บั๊กที่ต้องแก้ และฟีเจอร์ที่ต้องเพิ่ม) อยู่ในเอกสารแยกที่ส่งให้พร้อมกันนี้

## Stack

- Frontend: React (Vite)
- Backend: Node.js + Express (REST API)
- Database: PostgreSQL

## วิธีติดตั้งและรัน

### 1) เตรียมฐานข้อมูล

**ตัวเลือก A — ใช้ Docker (แนะนำ ถ้าเครื่องมี Docker):**

```bash
docker compose up -d
```

จะได้ PostgreSQL รันที่ `localhost:5432` พร้อมข้อมูลตั้งต้นจาก `db/init.sql` โดยอัตโนมัติ

**ตัวเลือก B — ใช้ PostgreSQL ที่ติดตั้งในเครื่องอยู่แล้ว:**

```bash
createdb degito_test
psql -d degito_test -f db/init.sql
```

### 2) รัน Backend

```bash
cd backend
cp .env.example .env   # แก้ DATABASE_URL ถ้าจำเป็น
npm install
npm run dev
```

Backend จะรันที่ `http://localhost:4000`

### 3) รัน Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend จะรันที่ `http://localhost:5173`

## โครงสร้างโปรเจกต์

```
db/init.sql          — schema และข้อมูลตั้งต้น
backend/
  server.js          — entry point ของ Express
  db.js              — การเชื่อมต่อฐานข้อมูล
  routes/projects.js — endpoints ของ projects
  routes/clients.js  — endpoints ของ clients
frontend/
  src/App.jsx        — หน้าหลักของแอป
  src/api.js         — ฟังก์ชันเรียก API
```

## หมายเหตุ

- ข้อมูลตั้งต้นจำลองลูกค้าและโปรเจกต์ของ Degito ไว้ให้พร้อมทดสอบ ไม่ต้องสร้างข้อมูลเพิ่มเองก่อนเริ่ม
- ให้ทำงานตามรายละเอียดในเอกสารโจทย์ที่แนบมา แล้วส่งกลับตามที่ระบุไว้ในเอกสารนั้น

## Assignment Summary

ในการทำ Assignment นี้ ผมพบและแก้ไขปัญหาหลัก 4 จุด พร้อมทั้งเพิ่มฟีเจอร์ค้นหาโปรเจกต์ตามชื่อลูกค้า

**Bug 1 – การ Change Status ไม่ update บนหน้าเว็บ**  
สาเหตุเกิดจากการแก้ไข object ภายใน state โดยตรง และใช้ array เดิมในการเรียก `setProjects()` ทำให้ React ตรวจจับการเปลี่ยนแปลงได้ไม่ถูกต้อง ผมแก้ไขโดยใช้ `map()` เพื่อสร้าง array ใหม่ และอัปเดตเฉพาะ project ที่ต้องการ ทำให้ React สามารถ re-render ได้อย่างถูกต้อง

**Bug 2 – API สำหรับ Create Project ไม่มี Validation**  
API สามารถรับข้อมูลว่างหรือ `client_id` ที่ไม่ถูกต้องได้ ซึ่งอาจทำให้เกิด database error ผมได้ทำการเพิ่ม validation สำหรับตรวจสอบ `project name` และ `client_id` ก่อนทำการ INSERT และส่ง HTTP 400 กลับไปเมื่อข้อมูลไม่ถูกต้อง

**Bug 3 – Project แสดงข้อมูลซ้ำซ้อน**  
สาเหตุเกิดจากการ `JOIN` กับ `project_notes` ซึ่งเป็นความสัมพันธ์แบบหนึ่งต่อหลาย ทำให้ project ที่มีหลาย note ถูกแสดงหลายครั้ง ผมจึงนำ JOIN ที่ไม่จำเป็นออก และดึงเฉพาะข้อมูล project และ client

**Bug 4 – API Error ไม่แสดงให้ user เห็น**  
Frontend ไม่ได้ตรวจสอบ response status และไม่มีการจัดการ error ทำให้เกิด fail silently ผมแก้โดยตรวจสอบ `response.ok` และ throw error เมื่อ API ทำงานไม่สำเร็จ จากนั้นแสดงข้อความผ่าน `alert` ให้ user ทราบ

**ฟีเจอร์ใหม่ – ค้นหา Project ตามชื่อลูกค้า**  
ผมเพิ่มการค้นหาตั้งแต่ Database, API และ UI โดยใช้ query parameter และ PostgreSQL `ILIKE` เพื่อรองรับการค้นหาแบบไม่สนใจตัวพิมพ์เล็ก-ใหญ่ ข้อแลกเปลี่ยนคือการค้นหาแบบ server-side ทำให้มี API request เพิ่มขึ้น แต่เหมาะกับการรองรับข้อมูลจำนวนมากในอนาคตมากกว่าการดึงข้อมูลทั้งหมดมา filter ที่ Frontend
