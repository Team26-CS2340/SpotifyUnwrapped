# Spotify Wrapper App

This project is a Spotify wrapper application built with a Django backend and a React frontend. It allows users to interact with the Spotify API to access their music data and create personalized experiences.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This app serves as a wrapper around the Spotify API, enabling users to view playlists, track information, and other personal music data. The app consists of:
- **Django backend:** Manages API endpoints, authentication, and data processing.
- **React frontend:** Provides a user-friendly interface to display data retrieved from the backend.

## Features

- User authentication with Spotify.
- Display of user playlists and tracks.
- Interaction with Spotify API for music data retrieval.
- Responsive front-end design for a seamless user experience.

## Tech Stack

- **Backend:** Django, Django REST Framework, Python
- **Frontend:** React, JavaScript, HTML, CSS
- **Database:** PostgreSQL (or SQLite for local development)
- **Spotify API:** OAuth 2.0 for authentication and data access

## Setup Instructions

### Prerequisites

- Python 3.x
- Node.js & npm
- Spotify Developer Account (to obtain client credentials)

### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/spotify-wrapper-app.git
   cd spotify-wrapper-app
   ```
2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: `venv\Scripts\activate`
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Apply database migrations:**
   ```bash
   python manage.py migrate
   ```
5. **Start the Django server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to the frontend directory on a new terminal:**
   ```bash
   cd frontend
   ```
2. **Install frontend dependencies:**
   ```bash
   npm install
   ```
3. **Start the React development server:**
   ```bash
   npm start
   ```

The app should now be running, with the backend available at `http://localhost:8000` and the frontend at `http://localhost:3000`.

## Usage

1. Navigate to the frontend at `http://localhost:3000`.
2. Log in with your Spotify account.
3. View and interact with your playlists, tracks, and other Spotify data.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a pull request.
