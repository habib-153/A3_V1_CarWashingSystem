# Car Wash Booking System

Welcome to the Car Wash Booking System Backend ! This project is designed to handle the backend operations of a car wash booking platform, focusing on robust error handling, CRUD operations, and secure authentication and authorization processes.

[Live Link](https://a3-v1-car-washing-system.vercel.app/)

## Used Technologies

- **Express.js:** A fast web framework for Node.js.
- **JWT:** Used for Auth.
- **TypeScript:** A statically typed superset of JavaScript that compiles to plain JavaScript.
- **MongoDB:** A NoSQL database for storing structured data.
- **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Zod:** Libraries for data validation and schema definition.
- **dotenv:** A zero-dependency module that loads environment variables from a .env file.
- **Nodemon:** A utility that automatically restarts the server during development.
- **Vercel:** A platform for deploying frontend applications.
- **Prettier:** An opinionated code formatter that ensures consistent code style.
- **EsLint:** ESLint is a popular JavaScript linter that helps you identify and fix problems in your code.

## Environment Variables

- **PORT**: Use a any PORT number what you want. ex.(6000, 7000)
- **DATABASE_URL**: URI of MongoDB. You can take it form your MongoDB Ac.
- **NODE_ENV**: development
- **BCRYPT_SALT_ROUNDS**: give a value less than 10
- **JWT_EXPIRE**: Time of expiring Token
- **ACCESS_TOKEN_SECRET**: Secret token. You can generate it from Terminal.

## Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/habib-153/A3_V1_CarWashingSystem
   ```

2. **Navigate to the project directory:**

   ```bash
   cd A3_V1_CarWashingSystem
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env.local` file:**

   - Create a `.env.local` file in the root directory of your project.
   - Copy the required environment variables from the provided `.env.example` file.

5. **Start the development server:**

   ```bash
   npm run start:dev
   ```
