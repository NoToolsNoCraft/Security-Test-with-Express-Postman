# Express App and Postman Test Workflow

This repository contains an Express app and automated API tests using Postman and GitHub Actions. The purpose of this setup is to validate the functionality of an Express API by running Postman tests whenever changes are made to the `main` branch.

## Overview

The workflow runs automated tests on an Express API using Postman collections. When code is pushed to the `main` branch, the following steps are executed:

1. **Setup Environment**: The repository is checked out, dependencies are installed, and the Express app is started.
2. **Postman API Tests**: Postman tests are executed using **Newman**, the Postman CLI tool.
3. **Test Results**: The results from the Postman tests are output, showing which requests were successful and which ones failed.

## Express API Setup (`app.js`)

The **Express app** (`app.js`) provides a set of endpoints that are tested by the Postman collection. Below is an overview of the routes defined in the Express app and their corresponding Postman tests:

### 1. **POST /users**
   - **Purpose**: Creates a new user.
   - **Request Body**: 
     ```json
     {
       "id": 4,
       "username": "newUser",
       "email": "newuser@example.com",
       "role": "user",
       "active": true
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "User created successfully",
       "data": {
         "id": 4,
         "username": "newUser",
         "email": "newuser@example.com",
         "role": "user",
         "active": true
       }
     }
     ```

### 2. **GET /users**
   - **Purpose**: Retrieves the list of all users.
   - **Response**: 
     ```json
     [
       {
         "id": 1,
         "username": "existingUser",
         "email": "existinguser@example.com",
         "role": "admin",
         "active": true
       },
       {
         "id": 4,
         "username": "newUser",
         "email": "newuser@example.com",
         "role": "user",
         "active": true
       }
     ]
     ```

### 3. **DELETE /users/:id**
   - **Purpose**: Deletes a user by their ID.
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

The Postman test collection (`Security Test.postman_collection.json`) contains a series of requests that test the functionality of the Express API. Below are the key requests and how they map to the Express routes:

### 1. **POST /users**
   - **Purpose**: Tests the `POST /users` route.
   - **Test**: 
     - A new user is created using the request body.
     - The response is validated to ensure the user was created successfully. The `id`, `username`, `email`, and `role` must match the request.
     - Status code 201 (Created) is expected.

### 2. **GET /users**
   - **Purpose**: Tests the `GET /users` route.
   - **Test**: 
     - The response is validated to ensure that the user created in the previous step is present in the list of users.
     - The `id`, `username`, `email`, `role`, and `active` properties should match the values from the `POST /users` request.

### 3. **DELETE /users/:id**
   - **Purpose**: Tests the `DELETE /users/:id` route.
   - **Test**: 
     - The newly created user is deleted.
     - The response is validated to ensure the user is deleted and the correct message is returned.
     - The `GET /users` route is run again to confirm that the user no longer exists.

## How the Postman Tests Work

### Step-by-Step Test Execution

1. **Step 1: POST /users**
   - A `POST` request is sent to create a new user with the following JSON body:
     ```json
     {
       "id": 4,
       "username": "newUser",
       "email": "newuser@example.com",
       "role": "user",
       "active": true
     }
     ```
   - The test checks that the response status is `201` and that the response body contains the newly created user's data, including their `id`, `username`, `email`, `role`, and `active` status.

2. **Step 2: GET /users**
   - After creating the user, a `GET` request is sent to retrieve the list of all users.
   - The test validates that the newly created user exists in the response and that all the properties (`id`, `username`, `email`, `role`, and `active`) match the values sent in the `POST` request.

3. **Step 3: DELETE /users/:id**
   - A `DELETE` request is sent to delete the user with the specified `id` (in this case, `4`).
   - The test checks that the response contains a success message and the deleted user’s data.
   - A final `GET /users` request is sent to confirm that the user has been removed from the list.

## Running the Tests Locally

You can run the Postman tests locally using **Newman**:

1. Install Newman globally using npm:
   ```bash
   npm install -g newman
