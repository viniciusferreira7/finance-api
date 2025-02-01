# Finance API

## **Main Features:**

- [x] Secure authentication for user registration and login.
- [x] Financial transaction tracking (income and expenses) with attributes like amount, category, description, and date.
- [x] Automatic calculation of the current balance and categorization for detailed analysis.
- [x] Management of custom categories (create, edit, and delete).

### Technical Requirements:

- [x] Fast performance for calculations.
- [x] Scalability to handle a large number of users and data.
- [x] Intuitive and responsive interface, compatible with browsers and mobile devices.
- [x] Must include E2E and unity testing.
- [X] Must have run test in github's CI environment 
- [x] Advanced security (HTTPS, JWT authentication, attack prevention).

## 💻 Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of **Node.js**.
- You must have **Docker** installed

## 🚀 Getting Started

### 1. Clone the repository:

Open the terminal and use the following command to clone the project to your computer:

```bash
git clone https://github.com/viniciusferreira7/finance-api
```

### 2. Access the project directory:

```bash
cd <PROJECT_DIRECTORY_NAME>
```

### 3. Install the project:

```bash
npm install
```

### 4. You have create environments variables:
- this env you need to run application:

```bash
NODE_ENV=dev
PORT=3333

#AUTH
JWT_SECRET=
FINANCE_APP_TOKEN=

# DATABASE
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
DATABASE_URL=
```
- Create a file with name is **.env** and enter with your values 

### 5. Run docker compose:

```bash
 docker compose --env-file .env up -d
```

### 6. Run the migrations:

```bash
  npx prisma migrate deploy
```

### 7. **(if you want):** You can run a command to seed data in database, to facilitate:


```bash
  npx prisma db seed
```

## Start the project:

```bash
  npm start:dev
```

## Running the Project with Docker

This project can be easily run using **Docker** and **Docker Compose**. Below are the instructions to run the project in a container.

## Prerequisites

Before you start, make sure you have:

- [Docker](https://www.docker.com/products/docker-desktop) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/) installed (usually included with Docker Desktop).

## Steps to Run the Project

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/username/repository-name.git
cd repository-name
```

### 2. Set Up Environment Variables

Create .env file following .env.example

### 3. Run the Containers

```bash
npm run start:containers
```

This command will:

- Build the container images.
- Run PostgreSQL (finance-api-postgresql container).
- Run the application (finance-api container).
- Run Prisma migrations if configured.

### 4. Check the Status
After running the command, you can check if the containers are working properly by running:

```bash
docker-compose ps
```
This will list the active containers and show their status

### 5. Access the Application

#### Swagger
- **http://localhost:3333/documentation**

#### Scalar
- **http://localhost:3333/reference**

### Prisma studio
- **http://localhost:5555**

### 6. Stop the Containers

To stop the running containers, use the following command:

```bash
docker-compose down
```

This will stop and remove all the created containers, but will keep the volumes and networks persistent.


## Packages and Versions
### Dependencies:

- @faker-js/faker: 8.4.1,
- @fastify/jwt: 8.0.0,
- @fastify/swagger: 8.14.0,
- @fastify/swagger-ui: 4.0.0,
- @prisma/client: 5.12.1,
- @scalar/fastify-api-reference: 1.24.35,
- bcryptjs: 2.4.3,
- chalk: 5.3.0,
- dayjs: 1.11.11,
- fastify: 4.26.2,
- supertest: 7.0.0,
- zod: ^3.22.4,
- zod-to-json-schema: 3.23.2

 ### Development Dependencies:

- @rocketseat/eslint-config: 2.2.2,
- @types/bcryptjs: 2.4.6,
- @types/fastify-jwt: 0.8.1,
- @types/node: ^20.12.7,
- @types/supertest: 6.0.2,
- @vitest/coverage-v8: 1.5.3,
- @vitest/ui: 1.5.3,
- dotenv: 16.4.5,
- eslint: 8.56.0,
- eslint-plugin-simple-import-sort: 12.1.0,
- npm-run-all: 4.1.5,
- prisma: 5.12.1,
- tsup: ^8.0.2,
- tsx: ^4.7.2,
- typescript: ^5.4.5,
- vite-tsconfig-paths: 4.3.2,
- vitest: 1.5.3