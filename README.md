# Task Manager Backend & Full-Stack App

A file-based task management web application built with **Node.js**, **Express.js**, **EJS**, and styled with **Tailwind CSS**. It replicates the exact UI structure and backend behavior shown in the design.

## Features

- **Dynamic File-Based Storage**: Each task created via the frontend form is persisted as a `.txt` file in the `./files` directory using Node's `fs` module.
- **Home Dashboard (`/`)**: Displays the task creation form and dynamically scans `./files` using `fs.readdir` to render interactive cards for all saved tasks.
- **Task Detail View (`/file/:filename`)**: Reads the file contents using `fs.readFile` and displays the task title and body when clicking "read more".
- **Rename Task (`/edit/:filename` & `POST /edit`)**: Allows changing the task's filename via `fs.rename`.
- **Delete Task (`POST /delete/:filename`)**: Removes the task file from the filesystem with `fs.unlink`.
- **RESTful API Endpoints**: Includes optional JSON API endpoints (`/api/tasks`, `/api/tasks/:filename`) for programmatic access.

## Project Structure

```text
task-manager-backend/
├── files/                     # Stores the created task .txt files
│   ├── .txt
│   ├── adsf.txt
│   ├── backendoeftxfhh.txt
│   ├── chacha.md.txt
│   ├── dbfiles.txt
│   ├── helo.js.txt
│   ├── kushal.txt
│   └── nilotpalfrontend.txt
├── views/                     # EJS templates
│   ├── index.ejs              # Main page matching the screenshot
│   ├── show.ejs               # File read/detail page ("read more")
│   └── edit.ejs               # Rename task page
├── public/                    # Static assets
│   ├── stylesheets/
│   └── javascripts/
├── index.js                   # Express server and file handling routes
├── package.json               # Dependencies and npm scripts
└── README.md
```

## Getting Started

### 1. Navigate to the project directory
```bash
cd /Users/rmukeshkumar/.gemini/antigravity/scratch/task-manager-backend
```

### 2. Start the Server
To run with Node:
```bash
npm start
```
Or for development with automatic reloads (via nodemon):
```bash
npm run dev
```

### 3. Open in Browser
Visit [http://localhost:9000](http://localhost:9000) in your web browser.

## Backend Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Reads `./files` and renders the dashboard cards |
| `POST` | `/create` | Form submission route: creates `${title}.txt` in `./files` |
| `GET` | `/file/:filename` | "Read more" route: reads and renders task contents |
| `GET` | `/edit/:filename` | Form to rename an existing task |
| `POST` | `/edit` | Renames the file in the filesystem |
| `POST` | `/delete/:filename` | Deletes the task file |
| `GET` | `/api/tasks` | Returns JSON array of all task files |
| `GET` | `/api/tasks/:filename` | Returns JSON content of a specific task |
