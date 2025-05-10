# API Links Documentation

This document lists all API endpoints available in the application, organized by category. For each endpoint, the document provides the URL pattern, the file where it's defined, and a brief description of its purpose.

## Authentication APIs

### `/api/auth/register` [POST]
- **File:** `backend/src/routes/auth.ts`
- **Description:** Registers a new user with username, email, password, and optional profile information.
- **Auth Required:** No

### `/api/auth/login` [POST]
- **File:** `backend/src/routes/auth.ts`
- **Description:** Authenticates a user using username/email and password, returns JWT token.
- **Auth Required:** No

### `/api/auth/forgot-password` [POST]
- **File:** `backend/src/routes/auth.ts`
- **Description:** Initiates password reset process by generating a token and (in production) sending an email.
- **Auth Required:** No

### `/api/auth/reset-password` [POST]
- **File:** `backend/src/routes/auth.ts`
- **Description:** Resets a user's password using a valid reset token.
- **Auth Required:** No

### `/api/auth/change-password` [POST]
- **File:** `backend/src/routes/auth.ts`
- **Description:** Changes a user's password (requires current password).
- **Auth Required:** Yes

### `/api/auth/profile` [GET]
- **File:** `backend/src/routes/auth.ts`
- **Description:** Retrieves the authenticated user's profile information.
- **Auth Required:** Yes

### `/api/auth/profile` [DELETE]
- **File:** `backend/src/routes/auth.ts`
- **Description:** Deletes the authenticated user's account.
- **Auth Required:** Yes

### `/api/auth/logout` [POST]
- **File:** `backend/src/routes/auth.ts`
- **Description:** Logs out the current user (invalidates the token).
- **Auth Required:** Yes

## Admin APIs

### `/api/admin/users` [GET]
- **File:** `backend/src/routes/admin.ts`
- **Description:** Returns a list of all users in the system.
- **Auth Required:** Yes (admin only)

### `/api/admin/users/:id` [GET]
- **File:** `backend/src/routes/admin.ts`
- **Description:** Returns details for a specific user.
- **Auth Required:** Yes (admin only)

### `/api/admin/users` [POST]
- **File:** `backend/src/routes/admin.ts`
- **Description:** Creates a new user account (by an admin).
- **Auth Required:** Yes (admin only)

### `/api/admin/users/:id` [DELETE]
- **File:** `backend/src/routes/admin.ts`
- **Description:** Deletes a user account.
- **Auth Required:** Yes (admin only)

## Player Cards APIs

### `/api/player-cards` [GET]
- **File:** `backend/src/routes/playerCards.ts`
- **Description:** Returns a list of all player scorecards with course and user info.
- **Auth Required:** No

### `/api/player-cards/player/:playerId` [GET]
- **File:** `backend/src/routes/playerCards.ts`
- **Description:** Returns player scorecards for a specific player.
- **Auth Required:** No

### `/api/player-cards/course/:courseId` [GET]
- **File:** `backend/src/routes/playerCards.ts`
- **Description:** Returns player scorecards for a specific course.
- **Auth Required:** No

### `/api/user/chart-data` [GET]
- **File:** `backend/src/routes/playerCards.ts`
- **Description:** Returns data for the current user's last 50 'OK' scorecards for chart display.
- **Auth Required:** Yes

### `/api/player-cards/:id` [GET]
- **File:** `backend/src/routes/playerCards.ts`
- **Description:** Returns details for a specific player scorecard.
- **Auth Required:** No

### `/api/player-cards/:id` [PUT]
- **File:** `backend/src/routes/playerCards.ts`
- **Description:** Updates an existing player scorecard.
- **Auth Required:** No

## Courses APIs

### `/api/courses` [GET]
- **File:** `backend/src/routes/courses.ts`
- **Description:** Returns a list of all courses.
- **Auth Required:** No

### `/api/courses/list-names` [GET]
- **File:** `backend/src/routes/courses.ts`
- **Description:** Returns a simplified list of course names and IDs.
- **Auth Required:** No

### `/api/courses/:id` [GET]
- **File:** `backend/src/routes/courses.ts`
- **Description:** Returns details for a specific course.
- **Auth Required:** No

### `/api/courses/:courseId/tees` [GET]
- **File:** `backend/src/routes/courses.ts`
- **Description:** Returns tee information for a specific course.
- **Auth Required:** No

## Courses Data APIs

### `/api/coursesData/course-names` [GET]
- **File:** `backend/src/routes/coursesData.ts`
- **Description:** Returns a list of all course names.
- **Auth Required:** No

### `/api/coursesData/course-names/:id` [GET]
- **File:** `backend/src/routes/coursesData.ts`
- **Description:** Returns details for a specific course name.
- **Auth Required:** No

### `/api/coursesData/course-data/:id` [GET]
- **File:** `backend/src/routes/coursesData.ts`
- **Description:** Returns course data for a specific course.
- **Auth Required:** No

### `/api/coursesData/course-hole-data/:id` [GET]
- **File:** `backend/src/routes/coursesData.ts`
- **Description:** Returns hole data for a specific course.
- **Auth Required:** No

### `/api/coursesData/normalized-holes/:id` [GET]
- **File:** `backend/src/routes/coursesData.ts`
- **Description:** Returns normalized hole data for a specific course.
- **Auth Required:** No

### `/api/coursesData/tee-types` [GET]
- **File:** `backend/src/routes/coursesData.ts`
- **Description:** Returns a list of all tee types.
- **Auth Required:** No

### `/api/coursesData/course-names/:id` [PUT]
- **File:** `backend/src/routes/coursesData.ts`
- **Description:** Updates course name information.
- **Auth Required:** Yes

### `/api/coursesData/course-data/:id` [PUT]
- **File:** `backend/src/routes/coursesData.ts`
- **Description:** Updates course data information.
- **Auth Required:** Yes

### `/api/coursesData/course-hole-data/:id` [PUT]
- **File:** `backend/src/routes/coursesData.ts`
- **Description:** Updates course hole data information.
- **Auth Required:** Yes

## Handicap Calculation APIs

### `/api/handicap-calc` [GET]
- **File:** `backend/src/routes/handicapCalc.ts`
- **Description:** Returns handicap calculation information.
- **Auth Required:** No

### `/api/handicap-calc/view/:player_id` [GET]
- **File:** `backend/src/routes/handicapCalc.ts`
- **Description:** Returns handicap calculation view for a specific player.
- **Auth Required:** No

### `/api/handicap-calc/test` [GET]
- **File:** `backend/src/routes/handicapCalc.ts`
- **Description:** Test endpoint for handicap calculation.
- **Auth Required:** No

### `/api/handicap-calc/debug` [GET]
- **File:** `backend/src/routes/handicapCalc.ts`
- **Description:** Debug endpoint for handicap calculation.
- **Auth Required:** No

### `/api/handicap-calc/:player_id` [GET]
- **File:** `backend/src/routes/handicapCalc.ts`
- **Description:** Returns handicap calculation for a specific player.
- **Auth Required:** No

## Logs APIs

### `/api/logs` [GET]
- **File:** `backend/src/routes/logs.ts`
- **Description:** Returns logs data.
- **Auth Required:** No

### `/api/logs` [POST]
- **File:** `backend/src/routes/logs.ts`
- **Description:** Creates a new log entry.
- **Auth Required:** No

### `/api/logs` [DELETE]
- **File:** `backend/src/routes/logs.ts`
- **Description:** Deletes log entries.
- **Auth Required:** No

### `/api/logs/search` [GET]
- **File:** `backend/src/routes/logs.ts`
- **Description:** Searches log entries.
- **Auth Required:** No

### `/api/logs/test` [GET]
- **File:** `backend/src/routes/logs.ts`
- **Description:** Test endpoint for logs.
- **Auth Required:** No

## News APIs

### `/api/golf-news` [GET]
- **File:** `backend/src/routes/news.ts`
- **Description:** Returns golf news articles.
- **Auth Required:** No

### `/api/debug-news` [GET]
- **File:** `backend/src/routes/news.ts`
- **Description:** Debug endpoint for news.
- **Auth Required:** No

## Miscellaneous APIs

### `/api/random-quote` [GET]
- **File:** `backend/src/routes/randomQuote.ts`
- **Description:** Returns a random quote.
- **Auth Required:** No

### `/api` [GET]
- **File:** `backend/src/index.ts`
- **Description:** Simple health check endpoint that returns "API is working".
- **Auth Required:** No

### `/health` [GET]
- **File:** `backend/src/index.ts`
- **Description:** Health check endpoint for the backend service.
- **Auth Required:** No
