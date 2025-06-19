# Library System

A modern, full-stack web-based library management system built with **Next.js**, **Drizzle ORM**, **SQLite**.  
Designed for schools and small institutions, it provides a seamless experience for managing books, students, and lending operations, with a beautiful dashboard and robust statistics.

---

## 🚀 Features

- **Books Management**

  - Add, edit, delete, and view books with details (title, author, ISBN, category, quantity, status).
  - Unique ISBN enforcement and automatic status updates (available/unavailable).
  - Book detail pages with lending history.

- **Student Management**

  - Register, edit, delete, and view students (name, grade, student ID, status).
  - Student detail pages with lending history.
  - Prevent deletion if student has active or past loans.

- **Lending & Circulation**

  - Lend books to students with borrow/due dates.
  - Return books and automatically update inventory/status.
  - Prevent lending if book is out of stock or student already has a borrowed book.
  - Mark overdue books and handle overdue status automatically.

- **Dashboard & Statistics**

  - At-a-glance stats: total books, available, on loan, overdue.
  - Popular books and categories.
  - Recent activity feed (borrowing/returning).
  - Overdue books list.
  - Quick actions for common tasks.

- **API & Data Layer**

  - RESTful API endpoints for all resources (`/api/books`, `/api/students`, `/api/lending`, `/api/statistics`).
  - SWR-powered client hooks for fetching, caching, and revalidation.

- **Modern UI/UX**

  - Responsive, accessible design.
  - Form validation and helpful placeholders.
  - Optimistic UI updates and error handling.
  - Loading skeletons and feedback.

---

## 🏁 Getting Started

### 1. Install Dependencies

```bash
bun install
# or
npm install
```

### 2. Set Up Environment

Create a `.env` file:

```env
DB_FILE_NAME=file:./drizzle/local.db
```

- For Drzzle and LibSql.

### 3. Run the Development Server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🖥️ Usage

- **Books:**  
  Go to `/books` to view, add, edit, or delete books. Click a book for details and lending history.

- **Students:**  
  Go to `/students` to manage students. Click a student for their profile and borrowing history.

- **Circulation:**  
  Go to `/circulation` to lend or return books. See all current and past lending records.

- **Dashboard:**  
  The homepage shows stats, recent activity, popular/overdue books, and quick actions.

---

## 🌟 Cool Features

- **Live statistics** with SWR caching and instant UI updates.
- **Smart lending logic:** prevents double-lending, handles stock, and auto-marks overdue.
- **Rich detail pages** for both books and students.
- **Quick actions** for common library tasks.
- **Type-safe, modern codebase** using Drizzle ORM and TypeScript.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, SWR, shadcn/ui
- **Backend:** Next.js API routes (for web) and Server Actions
- **Database:** SQLite (Drizzle ORM)
- **Other:** TypeScript, Zod, modern form handling

---

## 📈 Features To Come

- User authentication and roles (admin/librarian).
- Email notifications for overdue books.
- Bulk import/export for books and students.
- Advanced search and filtering.
- Customizable lending policies.
- Mobile app (React Native or Tauri mobile).
- More analytics and reporting.

---

## 🤝 Contributing

Pull requests and feedback are welcome!  
Please open an issue for bugs, ideas, or questions.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [SWR](https://swr.vercel.app/)

---
# skinny-library
# skinny-library
# skinny-library
