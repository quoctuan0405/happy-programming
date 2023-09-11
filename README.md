# How to run

## Step 1: Install SQLServer

https://www.microsoft.com/en-us/sql-server/sql-server-downloads

## Step 2: Install NodeJS

https://nodejs.org/en/download

## Step 3: Edit DATABASE_URL in .env

Open a file called .env and edit the DATABASE_URL property:

```
DATABASE_URL="sqlserver://localhost:1433;database=[YOUR_DATABASE_HERE];user=[YOUR_USERNAME_HERE];password=[YOUR_PASSWORD_HERE];trustServerCertificate=true"
```

## Step 4: Install dependencies

Open your terminal at the project folder and run:

```
npm install
```

## Step 5: Create database

Next, run:

```
npm run init
```

It'll automatically create a database and tables for you.

## Step 6: Run server in dev mode

To start a server in dev mode, run:

```
npm run start:dev
```

# Swagger

Go to http://localhost:3000/swagger to see list APIs.

# Admin account

To logged in as admin, POST to the route http://localhost:3000/auth/login with:

```
{
    "email": "admin@email.com",
    "password": "password"
}
```
