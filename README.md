# Distributed Document Search Engine – UI

Frontend web application for interacting with a distributed document search engine.
Supports document upload, indexing status tracking, and search powered by Elasticsearch.

---

## 🚀 Features
- Document upload & processing status
- Real-time document lifecycle (Pending → Processing → Completed)
- Full-text search with filters
- Responsive dashboard layout
- Secure API integration

---

## 🧱 Architecture Overview

Browser (React UI)  
   ↓  
API Gateway (Spring Boot)  
   ↓  
Document Service  
   ↓  
Kafka (events)  
   ↓  
Indexing Service → Elasticsearch

---

## 🛠 Tech Stack
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router
- React Query
- Axios
- Lucide Icons

---

## 📂 Project Structure

src/  
 ├─ components/  
 │   ├─ layout/  
 │   ├─ documents/  
 │   └─ common/  
 ├─ pages/  
 ├─ services/  
 ├─ hooks/  
 ├─ types/  
 └─ utils/  

---

## ⚙️ Local Setup

```bash
npm install
npm run dev