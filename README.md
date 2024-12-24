# Express App and Postman Test Workflow

This repository contains an **Express app** and an automated **API test suite** using **Postman** and **GitHub Actions**. The goal of this setup is to validate the functionality of an Express API by running Postman tests every time changes are made to the `main` branch of the repository.

You may find a more detailed documentation here: https://notoolsnocraft.tech/express-server-source-postman-security-test/

## Overview

The automated workflow performs the following steps whenever a commit is pushed to the `main` branch:

1. **Setup Environment**: The repository is checked out, dependencies are installed, and the Express app is started.
2. **Run Postman Tests**: The Postman collection is executed using **Newman** (Postman's CLI tool).
3. **Test Results**: The results from the Postman tests are shown in the GitHub Actions output, highlighting successful and failed requests.

## Express API Setup (`app.js`)

The **Express app** (`app.js`) exposes a set of API endpoints that are tested by the Postman collection. Below is a summary of these endpoints and their corresponding tests.

### 1. **GET http://localhost:3001/**
   - **Purpose**: Retrieve a list of all items currently available.
   - **Request Body**: None (but a "role" header with "admin" is required for security purposes).
   - **Response**:
     ```json
     [
        {
            "id": 1,
            "username": "adminUser",
            "email": "admin@secure.com",
            "password": "hashedPassword123",
            "role": "admin",
            "active": true
        },
        {
            "id": 2,
            "username": "regularUser",
            "email": "user@secure.com",
            "password": "hashedPassword456",
            "role": "user",
            "active": true
        },
        {
            "id": 3,
            "username": "guestUser",
            "email": "guest@secure.com",
            "password": "hashedPassword789",
            "role": "guest",
            "active": false
        }
     ]
     ```
   The initial response matches mock data set within the `app.js` file.

### 2. **POST http://localhost:3001/update**
   - **Purpose**: Add a new item (user) to the list.
   - **Request Body**:
     ```json
     [
        {
          "id": 4,
          "username": "newUser",
          "email": "newuser@example.com",
          "role": "user",
          "active": true
        }
     ]
     ```
   - **Response**:
     ```json
     {
       "message": "Users processed successfully",
       "addedUsers": [
         {
           "id": 4,
           "username": "newUser",
           "email": "newuser@example.com",
           "role": "user",
           "active": true
         }
       ]
     }
     ```

### 3. **DELETE /users/:id**
   - **Purpose**: Delete a user by their ID.
   - **Response**:
     ```json
     {
       "message": "User deleted successfully",
       "data": {
         "id": 4,
         "username": "newUser",
         "email": "newuser@example.com",
         "role": "user",
         "active": true
       }
     }
     ```

## Postman Test Collection

The Postman test collection (`Security Test.postman_collection.json`) contains a series of requests to test the functionality of the Express API. Below are the key requests and how they map to the Express routes:

### 1. **POST /users**
   - **Purpose**: Test the `POST /users` route.
   - **Test Logic**:
     - A new user is created using the provided request body.
     - The response is validated to ensure the user was created successfully, checking for the `id`, `username`, `email`, `role`, and `active` properties.
     - A successful status code `201` is expected.

### 2. **GET /users**
   - **Purpose**: Test the `GET /users` route.
   - **Test Logic**:
     - The response is validated to ensure the newly created user appears in the list.
     - The `id`, `username`, `email`, `role`, and `active` properties are checked.

### 3. **DELETE /users/:id**
   - **Purpose**: Test the `DELETE /users/:id` route.
   - **Test Logic**:
     - The newly created user is deleted via the `DELETE` request.
     - The response is validated to ensure that the user was successfully deleted.
     - A subsequent `GET /users` request confirms that the user no longer exists.

## How the Postman Tests Work

### Step-by-Step Test Execution

1. **Step 1: POST /users**
   - A `POST` request is sent to create a new user:
     ```json
     {
       "id": 4,
       "username": "newUser",
       "email": "newuser@example.com",
       "role": "user",
       "active": true
     }
     ```
   - The test verifies the response status is `201`, and checks that the returned user data matches the values sent in the request.

2. **Step 2: GET /users**
   - A `GET` request retrieves the list of all users.
   - The test confirms the new user is listed, checking that the properties (`id`, `username`, `email`, `role`, and `active`) match the values provided in the previous `POST` request.

3. **Step 3: DELETE /users/:id**
   - A `DELETE` request deletes the user with ID `4`.
   - The test confirms that the response contains the correct success message and the user data.
   - A final `GET /users` request ensures the user no longer appears in the list.

## Running the Tests Locally

To run the Postman tests locally, you can use **Newman**, Postman's command-line tool:

1. Install Newman globally using npm:
   ```bash
   npm install -g newman
