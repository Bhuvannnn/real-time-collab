# Local Development Setup Guide

Follow these steps to run the application locally on your machine.

## Prerequisites

- **Node.js** (v18.x or higher) - [Download here](https://nodejs.org/)
- **MongoDB Atlas account** (free tier is fine) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js)

## Step 1: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Make sure your cluster is **running** (not paused)
3. Click **Connect** on your cluster
4. Choose **Connect your application**
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/database`)
6. Replace `<password>` with your database password
7. Replace `<database>` with a database name (e.g., `collabdb`)

## Step 2: Set Up Environment Variables

You need to create `.env` files in each service directory. Create these files:

### Auth Service (`auth-service/.env`)
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
FRONTEND_URL=http://localhost:3000
```

### Document Service (`document-service/.env`)
```env
PORT=3002
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
AUTH_SERVICE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

### Real-time Service (`realtime-service/.env`)
```env
PORT=3003
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
AUTH_SERVICE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (`collaboration-frontend/.env`)
```env
REACT_APP_AUTH_URL=http://localhost:3001
REACT_APP_DOCUMENT_URL=http://localhost:3002
REACT_APP_SOCKET_URL=http://localhost:3003
```

**Important Notes:**
- Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string
- Use the **same** `JWT_SECRET` in all three backend services (auth, document, realtime)
- Generate a random JWT secret (you can use: `openssl rand -base64 32` in terminal)

## Step 3: Install Dependencies

Open a terminal in the project root and run:

```bash
# Install dependencies for auth service
cd auth-service
npm install

# Install dependencies for document service
cd ../document-service
npm install

# Install dependencies for realtime service
cd ../realtime-service
npm install

# Install dependencies for frontend
cd ../collaboration-frontend
npm install
```

## Step 4: Start the Services

You need to run **4 separate terminals** (one for each service). 

### Terminal 1: Auth Service
```bash
cd auth-service
npm run dev
```
You should see: `Server is running on port 3001` and `MongoDB connected successfully`

### Terminal 2: Document Service
```bash
cd document-service
npm run dev
```
You should see: `Document service running on port 3002` and `MongoDB connected successfully`

### Terminal 3: Real-time Service
```bash
cd realtime-service
npm run dev
```
You should see: `Realtime service running on port 3003` and `MongoDB connected successfully`

### Terminal 4: Frontend
```bash
cd collaboration-frontend
npm start
```
This will automatically open `http://localhost:3000` in your browser.

## Step 5: Test the Application

1. The frontend should open at `http://localhost:3000`
2. **Register** a new account (create a user)
3. **Login** with your credentials
4. **Create** a new document
5. **Open** the document to start editing
6. Open the same document in **another browser tab/window** (or different browser) to test real-time collaboration

## Troubleshooting

### MongoDB Connection Error
- Make sure your MongoDB Atlas cluster is **running** (not paused)
- Check that your connection string is correct
- Verify Network Access in MongoDB Atlas allows `0.0.0.0/0` (all IPs)

### Port Already in Use
- Make sure no other application is using ports 3000, 3001, 3002, or 3003
- You can change ports in the `.env` files if needed

### CORS Errors
- Make sure all services are running
- Check that `FRONTEND_URL` in backend `.env` files matches your frontend URL

### Dependencies Not Found
- Make sure you ran `npm install` in each service directory
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Services Won't Start
- Check that all `.env` files exist and have correct values
- Make sure you're in the correct directory when running commands
- Check the terminal output for specific error messages

## Quick Start Script (Optional)

You can create a script to start all services at once. Create a file `start-all.sh` in the root:

```bash
#!/bin/bash

# Start auth service
cd auth-service && npm run dev &
cd ..

# Start document service
cd document-service && npm run dev &
cd ..

# Start realtime service
cd realtime-service && npm run dev &
cd ..

# Start frontend
cd collaboration-frontend && npm start
```

Make it executable: `chmod +x start-all.sh`
Run it: `./start-all.sh`

**Note:** This starts services in the background. To stop them, you'll need to kill the processes manually.

## What You Should See

- **Auth Service**: Running on `http://localhost:3001`
- **Document Service**: Running on `http://localhost:3002`
- **Real-time Service**: Running on `http://localhost:3003`
- **Frontend**: Running on `http://localhost:3000` (auto-opens in browser)

All services should show "MongoDB connected successfully" (except realtime-service which may not need MongoDB depending on your setup).

Enjoy developing! 🚀

