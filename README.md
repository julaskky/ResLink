# ResLink – Research Linkage and Collaboration Platform

**Connecting Researchers. Strengthening Supervision. Advancing Research.**

ResLink is a web-based research linkage and collaboration platform designed to facilitate meaningful connections between researchers, students, and academic supervisors. The platform aims to streamline research coordination, improve academic communication, and support the management of research activities throughout the research lifecycle.

By providing a centralised digital environment for researcher registration, profile management, and academic collaboration, ResLink seeks to make research engagement more organised, accessible, and efficient.

---

## 1. Project Overview

Academic research often involves multiple stakeholders, including students, supervisors, research collaborators, and institutions. Coordinating these stakeholders, maintaining researcher information, and managing research-related interactions can become challenging when activities are distributed across disconnected systems.

ResLink addresses this challenge through an integrated web-based platform intended to support research linkage, academic collaboration, and research coordination.

The platform is being developed with a modular architecture that separates the frontend presentation layer from the backend application and data management layer. This architecture supports maintainability, scalability, and future feature expansion.

## 2. Core Objectives

ResLink is designed to:

- Facilitate connections between researchers and academic stakeholders.
- Provide a structured researcher registration process.
- Support researcher profile management.
- Improve communication and collaboration within academic research environments.
- Provide a foundation for research supervision and project coordination.
- Promote more organised management of research-related activities.
- Support the development of a connected academic research ecosystem.

## 3. Key Features

The current implementation includes:

- **Researcher Registration:** Structured registration functionality for researchers.
- **Email Verification:** Email verification functionality to support account validation.
- **Researcher Profiles:** Dedicated data models for managing researcher profile information.
- **Registration Consent:** Structured recording of registration-related consent.
- **API-Based Architecture:** Backend API endpoints for communication between the frontend and backend.
- **Database Migrations:** Version-controlled database schema management.

The platform is under active development, with additional research collaboration and management capabilities intended for future releases.

## 4. Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, TypeScript |
| Frontend tooling | Vite |
| Backend | PHP, Laravel |
| Database | SQLite (default development configuration) |
| Backend dependencies | Composer |
| Frontend dependencies | npm |
| API architecture | REST-oriented Laravel API |

## 5. Project Architecture

ResLink follows a separated frontend/backend architecture.

```text
ResLink/
│
├── reslink-api/
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Api/
│   │   ├── Models/
│   │   └── Providers/
│   │
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   │
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── tests/
│   ├── composer.json
│   └── .env.example
│
├── reslink-web/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── Registration.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

### Architectural components

**Frontend – `reslink-web`**

The React and TypeScript frontend provides the user-facing interface and communicates with the backend services.

**Backend – `reslink-api`**

The Laravel application provides the backend API, application logic, registration controllers, researcher models, and database management functionality.

**Database**

Laravel migrations provide a structured mechanism for creating and maintaining the application's database schema.

## 6. Installation and Setup

### Prerequisites

Ensure the following software is installed:

- PHP (compatible with the Laravel version specified in `composer.json`).
- Composer.
- Node.js and npm.
- Git.
- A compatible database engine.

### Step 1: Clone the repository

```bash
git clone https://github.com/julaskky/ResLink.git
```

Navigate into the project:

```bash
cd ResLink
```

### Step 2: Configure the backend

Navigate to the backend directory:

```bash
cd reslink-api
```

Install PHP dependencies:

```bash
composer install
```

Create the local environment configuration:

```bash
copy .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

For the default SQLite development configuration, create the database file:

```bash
type nul > database\database.sqlite
```

Run database migrations:

```bash
php artisan migrate
```

Start the Laravel development server:

```bash
php artisan serve
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

### Step 3: Configure the frontend

Open another terminal and navigate to the project root:

```bash
cd ResLink/reslink-web
```

Install frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

### Step 4: Configure frontend/backend communication

Ensure that the frontend API configuration points to the running Laravel backend.

Configure any required environment variables, API base URL, CORS settings, and authentication settings according to the application's implementation.

## 7. Database Management

ResLink uses Laravel migrations to manage database structures.

To execute migrations:

```bash
php artisan migrate
```

To inspect available migration status:

```bash
php artisan migrate:status
```

To roll back the most recent migration batch:

```bash
php artisan migrate:rollback
```

**Important:** Back up important development or production data before performing database operations.

## 8. Development and Testing

### Backend tests

From the `reslink-api` directory:

```bash
php artisan test
```

### Frontend development

From the `reslink-web` directory:

```bash
npm run dev
```

### Frontend production build

```bash
npm run build
```

The available frontend scripts can be inspected in `reslink-web/package.json`.

## 9. Security Considerations

Security is an important consideration in the development of ResLink.

The following practices should be observed:

- Never commit `.env` files or application secrets.
- Keep database credentials and API keys private.
- Use environment-specific configuration.
- Validate and sanitise user-submitted information.
- Apply appropriate authentication and authorisation controls.
- Configure email verification and account security appropriately.
- Use HTTPS in production deployments.
- Keep PHP, Laravel, Node.js, and application dependencies updated.
- Protect researcher information and personal data.
- Avoid committing production databases, private documents, or user-generated uploads.

The repository includes `.gitignore` configurations to exclude common development dependencies and sensitive local files.

## 10. Project Status

**Development status: Active Development**

ResLink is under continuous development. Its current implementation establishes the frontend/backend architecture, researcher registration functionality, email verification components, researcher profile models, and database migration structure.

Future development is intended to expand the platform's research linkage, academic collaboration, and research management capabilities.

## 11. Future Development Roadmap

Potential development areas include:

- Researcher discovery and matching.
- Student–supervisor linkage.
- Research project management.
- Research proposal and dissertation tracking.
- Supervisor–researcher communication.
- Research collaboration and networking.
- Meeting and appointment management.
- Research progress monitoring.
- Notifications and activity tracking.
- Institutional research management and reporting.

These are development objectives and should not be interpreted as features already implemented.

## 12. Contributing

Contributions, suggestions, and technical feedback are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature-name
```

3. Implement and test your changes.
4. Commit your changes.

```bash
git add .
git commit -m "Add: describe your contribution"
```

5. Push your branch.

```bash
git push origin feature/your-feature-name
```

6. Open a Pull Request describing your contribution.

Please ensure that contributions follow the existing project architecture and coding conventions.

## 13. License

The licensing terms for ResLink have not yet been specified. Please contact the repository owner regarding permissions for reuse, modification, and redistribution.

## 14. Repository

**GitHub:** https://github.com/julaskky/ResLink

---

**ResLink – Research Linkage and Collaboration Platform**

*Building a more connected, collaborative, and organised research ecosystem.*
