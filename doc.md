### 1. **intro:**
- interface to log cobbles
- analysis for logs (by day/region/week)

### 2. **structure:**
- api (server)
    - models
        - Log schema
        - User schema
- client (frontend)
    - creating / editing logs
    - view all logs / delete logs
    - register user
    - user login
    - analysis page (on progress)

### 3. **running locally:**

- starting server

```
cd api
nodemon index.js
```


- starting frontend

```
cd client
yarn start
```


### 4. **database schema:**

log schema

- **time**: *Date*
- **duration**: *Number*
- **region**: *String*
- **sensorID**: *String*
- **stoppage**: *String*
- **profile**: *String*
- **measure**: *String*
- **comment**: *String*

user schema

- **username**: *String*
  - *required*: true
  - *minimum Length*: 4 characters
  - *unique*: true

- **password**: *String*
  - *Type*: String
  - *required*: true

### 7. **authentication and authorization:**

- **user registration (`/register` route):**
  - accepts a post request with the `username` and `password`.
  - uses bcrypt to hash the password before storing it in the database.
  - creates a new user document and responds with the user details.

- **user login (`/login` route):**
  - accepts a post request with the `username` and `password`.
  - finds the user in the database by the provided `username`.
  - compares the hashed password with the provided password using bcrypt.
  - if the passwords match, creates a jwt token and sends it as a cookie in the response.
  - responds with the user's id and username.

- **user profile retrieval (`/profile` route):**
  - accepts a get request to retrieve the user profile.
  - extracts the jwt token from the cookie.
  - verifies the token using the secret.
  - responds with the decoded information from the token, which includes the username and user id.

- **user logout (`/logout` route):**
  - accepts a post request for user logout.
  - clears the jwt token cookie, logging the user out.

register, log in, retrieve their profile information, and log out using jwt for token-based authentication.

### to do

1. deployment for backend and frontend
2. analysis page visualizations