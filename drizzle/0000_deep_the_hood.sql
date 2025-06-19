CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`quantity` integer DEFAULT 0,
	`isbn` text NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'available',
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `books_isbn_unique` ON `books` (`isbn`);--> statement-breakpoint
CREATE TABLE `lending` (
	`id` text PRIMARY KEY NOT NULL,
	`book_id` text,
	`student_id` text,
	`borrow_date` text NOT NULL,
	`due_date` text NOT NULL,
	`return_date` text,
	`status` text DEFAULT 'borrowed',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`grade` text NOT NULL,
	`student_id` text NOT NULL,
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_student_id_unique` ON `students` (`student_id`);