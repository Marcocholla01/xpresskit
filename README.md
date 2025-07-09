# XPressKit

**XPressKit** is a robust and modern TypeScript-based starter kit for building scalable backend applications using **Express.js**, **Prisma ORM**, and **TypeScript**. It offers a clean, well-organized folder structure, essential configurations, and common modules to jumpstart your development with best practices.

Whether you're building a RESTful API or a microservice architecture, XPressKit is designed for speed, structure, and scalability.

## 📚 Table of Contents

- [Features](#features)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Development](#development)
  - [Scripts](#scripts)
  - [Database](#database)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Features

- **TypeScript**: Strongly typed codebase for better maintainability and fewer runtime errors.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **Prisma**: Modern ORM for Node.js and TypeScript.
- **Vitest**: Blazing fast unit test framework powered by Vite.
- **Modular Structure**: Clear separation of concerns (controllers, services, middleware, routes).
- **Environment Management**: Easy handling of environment-specific configurations.
- **Linting & Formatting**: Pre-configured ESLint and Prettier for consistent code style.
- **HTTP Client**: `axiosinstance.ts` for standardized external API calls.
- **Socket.IO (optional)**: Ready for real-time communication.
- **Error Handling**: Centralized error handling with middlewares.

---

## 📁 Folder Structure

```bash
├── generated/              # Generated files (e.g., Prisma client)
├── logs/                   # Application logs
├── node\_modules/           # Node.js dependencies
├── public/                 # Static assets
├── src/                    # Main application source code
│   ├── __tests__/          # Unit and integration tests
│   ├── config/             # Application configurations
│   ├── controllers/        # Request handlers for routes
│   ├── libs/               # Utility libraries or third-party integrations
│   ├── middlewares/        # Express middleware functions
│   ├── routes/             # API route definitions
│   ├── schemas/            # Validation schemas (e.g., Joi, Zod)
│   ├── services/           # Business logic and data manipulation
│   ├── socket/             # Socket.IO related logic
│   ├── templates/          # Email templates or similar
│   ├── types/              # Custom TypeScript type definitions
│   ├── utils/              # General utility functions
│   ├── app.ts              # Express application setup
│   └── server.ts           # Server bootstrapping and listening
├── .env                    # Environment variables (local)
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore rules
├── .npmrc                  # npm configuration
├── .nvmrc                  # Node Version Manager configuration
├── .prettierrc             # Prettier configuration
├── axiosinstance.ts        # Axios instance for HTTP requests
├── bun.lockb               # Bun lock file (if using Bun)
├── eslint.config.mjs       # ESLint configuration
├── package.json            # Project metadata and scripts
├── README.md               # This file
├── tsconfig.json           # TypeScript compiler configuration
└── vitest.config.ts        # Vitest test runner configuration

```

---

## 🏁 Getting Started

### 📦 Prerequisites

- Node.js (LTS recommended, check `.nvmrc`)
- Package Manager:
  - npm
  - Yarn
  - Bun (suggested by presence of `bun.lockb`)
- Database (PostgreSQL, MySQL, MongoDB, SQLite) — supported by Prisma

---

### 🔧 Installation

Clone the repository:

```bash
git clone https://github.com/marcocholla01/xpresskit.git
cd xpresskit
```

Install dependencies:

```bash
# Using npm
npm install

# OR using yarn
yarn install

# OR using bun
bun install
```

---

### ⚙️ Environment Variables

Create a `.env` file in the root directory based on `.env.example`.

```env
PORT=3000
DATABASE_URL="postgresql://user:password@host:port/database"
NODE_ENV=development
```

> ⚠️ **Important**: Never commit your actual `.env` file.

---

## ▶️ Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

Server runs on: [http://localhost:3000](http://localhost:3000) or your `.env` PORT

---

## 💻 Development

### 🔁 Scripts

Refer to `package.json` for a complete list. Common ones:

| Script        | Description                      |
| ------------- | -------------------------------- |
| `dev`         | Start dev server with hot-reload |
| `build`       | Compile TypeScript to JavaScript |
| `start`       | Start compiled production server |
| `lint`        | Run ESLint for code checks       |
| `format`      | Format code using Prettier       |
| `test`        | Run all tests                    |
| `test:watch`  | Watch mode for Vitest            |
| `test:cov`    | Run tests with coverage          |
| `db:migrate`  | Apply DB migrations (Prisma)     |
| `db:generate` | Generate Prisma client           |

---

### 🛢️ Database

This project uses **Prisma** as its ORM.

- **Define Schema** in `prisma/schema.prisma`
- **Run Migrations**:

```bash
npx prisma migrate dev --name <migration-name>
```

- **Generate Client**:

```bash
npx prisma generate
```

---

## 🧪 Testing

XPressKit comes pre-configured with:

- [**Vitest**](https://vitest.dev/) – A fast and lightweight testing framework
- [**Supertest**](https://github.com/ladjs/supertest) – For end-to-end HTTP assertions on Express routes

Tests are located in: `src/__tests__/`

Run all tests:

```bash
npm test
# or
yarn test
# or
bun test
```

Watch mode:

```bash
npm run test:watch
# or
yarn test:watch
# or
bun test:watch
```

Coverage mode:

```bash
npm run test:cov
# or
yarn test:cov
# or
bun test:cov
```

---

## 🚀 Deployment

> Deployment may vary by provider (Heroku, Vercel, AWS, DigitalOcean, etc.)

Basic Steps:

1. Run: `npm run build`
2. Configure environment variables on the server
3. Start the server: `npm start`
4. Ensure DB connection is active and allowed

---

## 🤝 Contributing

Contributions welcome!

1. Fork the repo
2. Create a branch:
   `git checkout -b feature/your-feature-name`
3. Make your changes
4. Ensure tests pass:
   `npm test`
5. Commit:
   `git commit -m 'feat: Add new feature'`
6. Push:
   `git push origin feature/your-feature-name`
7. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.  
See the `LICENSE.md` file for more details.

---

## 🙋‍♂️ Support

If you encounter any issues, feel free to:

- [Open an Issue](https://github.com/marcocholla01/xpresskit/issues)
- Contact me via [Email](mailto:marcochollapaul01@gmail.com)
- Suggest features or improvements

Your feedback is always welcome and appreciated!

---

## 🙌 Credits

Special thanks to:

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
<!-- - [Open Source Contributors](https://github.com/your-username/xpresskit/graphs/contributors) -->

Project maintained by [**Paul Ocholla**](https://marcocholla.netlify.app/)  
Connect on [LinkedIn](https://linkedin.com/in/marcocholla) or [Twitter](https://twitter.com/marcochollaP)
