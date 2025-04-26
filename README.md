
# Movie Tracker Application

## Overview
Movie Tracker is a web application that allows users to keep track of movies and TV shows they've watched and add favorites to their collection. Users can browse through a catalog of movies, filter them by various criteria, and maintain their own personalized lists.

## Features

### Movie Management
- **Browse Movies**: View a grid of movie posters with details
- **Filter Movies**: Filter by title, genre, type (movie/series), and year
- **Watch Tracking**: Mark movies as watched with a single click
- **Favorites**: Add movies to your favorites with the heart icon

### User Management
- **User Authentication**: Register and login to save your movie preferences
- **User Profile**: View your watched movies and favorite collections
- **Friend System**: Connect with other users to see their movie preferences
  - Send and accept friend requests
  - View friends' watched and favorite movies

### Movie Details
- **Movie Information**: View details like title, release year, and genres
- **Visual Interface**: Hover over movie posters to view additional information

## Technical Details

### Built With
- **React & TypeScript**: For building the user interface
- **Tailwind CSS**: For styling and responsive design
- **shadcn/ui**: For UI components
- **React Router**: For navigation
- **Context API**: For state management

### Project Structure
- **Components**: Reusable UI components like MovieCard and MovieGrid
- **Contexts**: State management for movies, authentication, and friends
- **Pages**: Main page views for home, profile, login, etc.

## Getting Started

### Prerequisites
- Node.js & npm installed

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd movie-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage
1. **Sign Up/Login**: Create an account or log in to start tracking movies
2. **Browse Movies**: Explore the movie catalog on the home page
3. **Track Movies**: Click on a movie card to mark it as watched
4. **Add to Favorites**: Click the heart icon to add a movie to your favorites
5. **Filter Movies**: Use the search bar and filter options to find specific movies
6. **Connect with Friends**: Search for friends by email and send friend requests
7. **View Profiles**: Check your profile or your friends' profiles to see their movie collections

## Future Enhancements
- Watchlist functionality for planning future movies to watch
- Rating system for watched movies
- Movie recommendations based on watch history
