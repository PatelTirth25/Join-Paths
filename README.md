# Join Paths

Join Paths is a social media platform where users can post, like, comment, and follow other users. Please note that this application is not responsive.

## Features

- User authentication with GitHub and Google
- JWT-based session management
- Post, like, comment, and follow functionality

## Technologies Used

- **Client:** Next.js, Tailwind CSS
- **Server:** Node.js, GraphQL
- **Database:** PostgreSQL

## Project Structure

```
/client
  /pages
  /components
  /styles
  .env
  next.config.js
  tailwind.config.js

/server
  /src
  /resolvers
  /models
  .env
  index.js
  graphql-schema.js
```

## Environment Variables

### Client

Create a `.env` file in the `client` folder with the following variables:

```
NEXT_PUBLIC_GITHUB_ID=your_github_id
NEXT_PUBLIC_GITHUB_SECRET=your_github_secret
NEXT_PUBLIC_GOOGLE_ID=your_google_id
NEXT_PUBLIC_GOOGLE_SECRET=your_google_secret
```

### Server

Create a `.env` file in the `server` folder with the following variable:

```
JWT_SECRET=your_jwt_secret
```

## Installation

### Client

1. Navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

### Server

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

## Usage

1. Ensure both client and server are running.
2. Open your browser and navigate to `http://localhost:3000`.

## Contributing

Feel free to submit issues or pull requests.



