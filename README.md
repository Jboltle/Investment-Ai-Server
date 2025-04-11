# Investment-AI

## Description

This project aims to decide stock sentiment based on news rather than statistical analysis. We are testing to see if news data alone is powerful enough to trade on. One of the biggest shortcomings that most stock screeners or stock analysis applications have is a lack of transparency. They do not tell you why a stock has a 78% chance of increasing in value. Our application will help the end-user understand how and why we came to the analysis we did and what influenced our decision.

## Installation & Getting Started

### Prerequisites
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Create a free [Docker Hub account](https://hub.docker.com/signup)
3. Sign in to Docker Desktop with your Docker Hub account

### Setup
1. Clone the repository and navigate to the project directory:
   ```bash
   cd investment-ai
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start both the client and server in development mode:
   ```bash
   yarn dev
   ```

   Or start them separately:
   ```bash
   # Start just the client
   yarn dev:client

   # Start just the server
   yarn dev:server
   ```

### For Production
```bash
# Build the client
yarn build

# Start both client and server in production mode
yarn start

# Or start them separately
yarn start:client
yarn start:server
```

Note: Initial setup will take a while to download the dependencies and start the server with supabase.
The application will be available at `http://localhost:3000`

## Project Structure

The project is organized into two main directories:
- `/Client`: Next.js frontend application 
- `/Server`: Node.js/Express backend server

Both share a single package.json at the root level for easier dependency management.

## Features

- News-based analysis
- Statistical analysis
- Combination of the above
- Supabase authentication
- Real-time portfolio updates
- Watchlist management

## Technologies Used

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express, Drizzle ORM, PostgreSQL
- **Authentication**: Supabase
- **Database**: PostgreSQL (Supabase)

## API Endpoints

- `GET /api/stocks/:userId` - Get user's watchlist
- `POST /api/stocks/:userId` - Add stock to watchlist  
- `DELETE /api/stocks/:userId` - Remove stock from watchlist

## License

This project is licensed under the MIT License