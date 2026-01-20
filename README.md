# 🎬 Smart Cinema Booking System

A full-stack cinema booking application with **intelligent showtime and seat recommendations**, built using **React (Frontend) + Spring Boot (Backend)**.

---

## Key Features

### Feature 1 — **Smart Showtime Recommendation (Frontend-Based)**
The system dynamically recommends the best showtime based on:

- **Current system time** — Past sessions are ignored  
- **Seat availability** — Among future sessions, the one with the **most seats available** is recommended  
- **Visual Highlighting** — The recommended showtime is:
  - Highlighted in **green**
  - Marked with a **“Recommended” badge**
  - Slightly scaled up for better visibility  

This recommendation is currently handled **on the frontend (React)** inside `MovieDetails.js`.

---

### Feature 2 — **Best Seat Recommendation (Backend-Based)**
The backend provides seat recommendations via:

**Service:**  
`RecommendationAnalyticsService.java`

It suggests the best seats in a hall based on:
- Central seating preference
- Proximity to center for optimal viewing

This data can later be integrated into the seat selection UI.

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- TMDB API (for movie data)

### Backend
- Spring Boot
- Java 17
- REST APIs
- DTO-based responses

---

## Important Files

### Frontend Recommendation Logic
`src/pages/MovieDetails.js`

Responsible for:
- Fetching movie sessions
- Calculating occupancy
- Filtering past sessions
- Selecting the future session with **maximum seats available**
- Highlighting the recommended showtime in UI

---

### Backend Analytics Service
`src/main/java/com/cinema/backend/services/RecommendationAnalyticsService.java`

Currently provides:
- Simulated “best session” recommendation (to be upgraded later)
- Functional best-seat recommendation logic

---

## How Recommendation Works (Frontend Logic)

For each movie:

1. Fetch all sessions  
2. Get current time  
3. Remove past sessions  
4. Calculate available seats for each session  
5. Pick the session with **most seats available**  
6. Mark it as **Recommended** in the UI  

---

## Future Improvements

Planned enhancements include:

- Moving showtime recommendation logic fully to the backend  
- Storing real session + seat data in MySQL  
- Machine-learning-based crowd prediction  
- Personalized recommendations per user  

---

## How to Run

### Backend
```bash
mvn spring-boot:run

