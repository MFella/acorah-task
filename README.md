# TodoApp - Monorepo Task Manager

TodoApp is a modern, full-stack monorepo Task Manager application designed for extreme responsiveness and clean state management. It features a NestJS REST API backend using SQLite (TypeORM) and a modern Angular frontend utilizing Signals, zoneless change detection, and reactive resources.

---

## 🏗️ Project Structure

The project is structured as a monorepo powered by **pnpm Workspaces**:

```text
acorah-task/
├── apps/
│   ├── todo-app-backend/      # NestJS API backend
│   └── todo-app-frontend/     # Angular SPA frontend
├── package.json               # Monorepo root configuration & scripts
├── pnpm-workspace.yaml        # Workspace configuration
└── pnpm-lock.yaml             # Shared lockfile
```

---

## ✨ Key Features

### Backend (`todo-app-backend`)
*   **Monorepo Backend Framework:** Built using NestJS (with controllers, services, and modules).
*   **Database Management:** Powered by SQLite and TypeORM for lightweight and fast persistence.
*   **Automatic Seeding:** Automatically seeds a default guest user and introductory list on startup.
*   **Security & Validation:** Fully validated requests using NestJS `ValidationPipe` with `class-validator` and `class-transformer`.
*   **Auth Guard:** Simulates a mock authentication context, mapping requests to the Guest User ID (`123`).

### Frontend (`todo-app-frontend`)
*   **Modern Angular (Zoneless):** Uses `provideZonelessChangeDetection` for optimal rendering performance.
*   **Angular Signals:** Leveraging modern reactive signals (`signal`, `computed`, `effect`, `linkedSignal`) to drive state and Positive UI updates.
*   **rxResource API Architecture:** Employs the new experimental `rxResource` API to manage asynchronous backend operations reactively.
*   **Premium Glassmorphic Design:** Tailored styling using Tailwind CSS, dark modes, animations, and clean responsive flex grids.
*   **Global Error Handling:** Implements an HTTP interceptor (`httpErrorInterceptor`) to capture and categorize HTTP error responses globally.

---

## 🚀 How to Run in Development

### 1. Prerequisites
Make sure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (Version `20.x` or higher is recommended)
*   [pnpm](https://pnpm.io/) (Version `10.x` is used and required)

### 2. Dependency Installation
Run the following command in the root folder of the project to install all dependencies for both the frontend and backend:
```bash
pnpm install
```

> [!NOTE]
> This project contains native bindings (`better-sqlite3`). The root `package.json` is pre-configured with `pnpm.onlyBuiltDependencies` to allow the package to compile native C++ SQLite bindings successfully on installation.

### 3. Run the Development Servers

You can launch both applications concurrently or individually using root-level scripts.

#### Start Both Servers (Concurrently)
Open two separate terminal windows in the root directory and run:

*   **Terminal 1 (Backend):**
    ```bash
    pnpm dev:back
    ```
    *Starts the NestJS API server on [http://localhost:3000/api](http://localhost:3000/api)*

*   **Terminal 2 (Frontend):**
    ```bash
    pnpm dev:front
    ```
    *Starts the Angular dev server (usually on [http://localhost:4200](http://localhost:4200))*

---

## 🛠️ Monorepo Commands Reference

The following scripts are available from the root of the project:

| Command | Action |
| :--- | :--- |
| `pnpm install` | Installs dependencies across all apps and builds native packages |
| `pnpm dev:back` | Launches the NestJS backend in development mode with watch-mode enabled |
| `pnpm dev:front` | Launches the Angular frontend dev server |
| `pnpm build:all` | Compiles production bundles for both frontend and backend |
| `pnpm test:all` | Runs Jest tests recursively across the entire monorepo |
