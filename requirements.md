
## 1. User Stories (Features from the User's Perspective)

### 1.1. User Authentication & Profile
* **AS A** new user, **I WANT TO** create an account (via email/password or Google) **SO THAT I CAN** access the app's features.
* **AS A** returning user, **I WANT TO** log in to my account **SO THAT I CAN** continue using the app.
* **AS A** user, **I WANT TO** view and update my basic profile information (e.g., name, university).

### 1.2. Club/Venue Discovery & Details
* **AS A** user, **I WANT TO** browse a list of available clubs/pubs **SO THAT I CAN** see what options are nearby or trending.
* **AS A** user, **I WANT TO** search for specific clubs/pubs by name **SO THAT I CAN** quickly find a known venue.
* **AS A** user, **I WANT TO** filter clubs/pubs (e.g., "Open Now," "Closest") **SO THAT I CAN** refine my search.
* **AS A** user, **I WANT TO** view a detailed page for each club/pub **SO THAT I CAN** get all relevant information.
    * This page must include: Name, Location (address with map integration), Operating Hours, Contact Info, Short Description/Vibe, Photo Gallery.
    * **Crucially:** Display of their Food/Drink Menu (simple format: text list or image).
    * **Crucially:** Display of their Current Offers/Promotions.

### 1.3. Party Group Management
* **AS A** user, **I WANT TO** create a new party group **SO THAT I CAN** plan a night out with others.
    * Must specify: Group Name, Date, Time, Chosen Venue, Maximum Group Size.
* **AS A** user, **I WANT TO** browse available public party groups **SO THAT I CAN** join new people or existing plans.
* **AS A** user, **I WANT TO** join an existing party group (with creator approval or open join) **SO THAT I CAN** participate in their plans.
* **AS A** user, **I WANT TO** communicate with other members within my party group **SO THAT I CAN** coordinate plans in real-time. (Basic text chat).
* **AS A** user, **I WANT TO** see a list of members in my joined groups **SO THAT I KNOW** who I'm partying with.

---

## 2. Venue Admin Portal Features (Web Interface)

* **AS A** venue representative, **I WANT TO** create and log in to my venue's account **SO THAT I CAN** manage its presence on Buzzvar.
* **AS A** venue representative, **I WANT TO** manage my venue's basic information (name, address, hours, contact) **SO THAT IT IS** accurate on Buzzvar.
* **AS A** venue representative, **I WANT TO** upload and manage photos for my venue **SO THAT IT** looks appealing to users.
* **AS A** venue representative, **I WANT TO** easily add/edit my food and drink menus **SO THAT USERS** have up-to-date information. (Simple text input, or option to upload a single menu image/PDF for V1).
* **AS A** venue representative, **I WANT TO** add, edit, and remove special offers/promotions (with start/end dates) **SO THAT USERS** see my latest deals.

---

## 3. Technical Requirements & Architecture

### 3.1. Database Schema (Neon DB + Drizzle ORM)

Define Drizzle schemas and migrations for the following core entities:

* **Users:**
    * `id` (PK, UUID)
    * `email` (UNIQUE)
    * `password_hash` (if using email/password)
    * `provider` (e.g., 'email', 'google')
    * `provider_id` (e.g., Google ID)
    * `name`
    * `university`
    * `created_at`
    * `updated_at`
* **Venues:**
    * `id` (PK, UUID)
    * `name`
    * `address`
    * `latitude`, `longitude`
    * `phone_number`
    * `website_url` (optional)
    * `description`
    * `opening_hours` (JSONB for daily schedules)
    * `created_at`
    * `updated_at`
    * `owner_user_id` (FK to Users, if venue owners are also users)
* **VenueImages:**
    * `id` (PK, UUID)
    * `venue_id` (FK to Venues)
    * `image_url`
    * `alt_text` (optional)
    * `created_at`
* **Menus:**
    * `id` (PK, UUID)
    * `venue_id` (FK to Venues)
    * `type` (e.g., 'food', 'drinks')
    * `content` (JSONB for structured items or TEXT for simple list/image URL for V1)
    * `updated_at`
* **Offers:**
    * `id` (PK, UUID)
    * `venue_id` (FK to Venues)
    * `title`
    * `description`
    * `start_date`
    * `end_date`
    * `active` (boolean)
    * `created_at`
    * `updated_at`
* **PartyGroups:**
    * `id` (PK, UUID)
    * `name`
    * `creator_id` (FK to Users)
    * `venue_id` (FK to Venues, nullable if venue isn't decided yet)
    * `event_date`
    * `event_time`
    * `max_members`
    * `is_public` (boolean, for browseable groups)
    * `status` (e.g., 'open', 'closed', 'cancelled')
    * `created_at`
    * `updated_at`
* **GroupMembers:** (Join table for PartyGroups and Users)
    * `id` (PK, UUID)
    * `group_id` (FK to PartyGroups)
    * `user_id` (FK to Users)
    * `status` (e.g., 'pending', 'approved', 'declined')
    * `joined_at`
* **GroupMessages:**
    * `id` (PK, UUID)
    * `group_id` (FK to PartyGroups)
    * `sender_id` (FK to Users)
    * `message_content`
    * `sent_at`

### 3.2. Next.js & Server Actions Implementation

* **API Layer:** All data fetching and mutations via Next.js Server Actions.
* **Authentication:** Implement secure user authentication (e.g., using `next-auth` or a custom solution with session management) for both regular users and venue admins.
* **Routing:** Define clear routes for:
    * `/_app` (main app layout)
    * `/auth/login`, `/auth/signup`
    * `/dashboard` (user homepage/feed)
    * `/clubs` (list of clubs)
    * `/clubs/[id]` (individual club detail page)
    * `/groups` (list of party groups)
    * `/groups/create`
    * `/groups/[id]` (individual group detail page with chat)
    * `/profile` (user profile)
    * `/venue/login`, `/venue/signup` (for venue reps)
    * `/venue/dashboard`
    * `/venue/profile`
    * `/venue/menus`
    * `/venue/offers`
    * `/venue/photos`
* **Data Fetching:** Use Server Actions for all database interactions (e.g., fetching clubs, creating groups, sending chat messages, updating venue info).
* **Error Handling:** Implement robust error handling for all Server Actions and UI components.
* **Loading States:** Show appropriate loading indicators (e.g., Shadcn Skeleton) during data fetches.

### 3.3. UI/UX (Shadcn UI + Tailwind CSS)

* **Consistent Styling:** Utilize Shadcn UI components (Button, Input, Dialog, Card, Table, Form, etc.) and Tailwind CSS for a consistent and responsive design across all pages.
* **Mobile-First Design:** Ensure the app is fully responsive and optimized for mobile devices as the primary usage platform.
* **Clear Navigation:** Intuitive navigation (e.g., bottom navigation bar for mobile, sidebar/header for web) for core user flows.
* **Forms:** Implement forms for signup, login, group creation, and venue data entry using Shadcn's Form component where applicable.
* **Map Integration:** Display club locations using a map component (e.g., react-google-maps/api) with marker.

### 3.4. External Services

* **Google Maps API:** For displaying maps and providing directions to venues.
* **Cloud Storage:** For storing uploaded venue images (e.g., Vercel Blob, AWS S3, or similar).

---

## 4. Testing & Deployment

* **Unit/Integration Tests:** Basic tests for core Server Actions and Drizzle ORM interactions.
* **Local Development:** Ensure the app can be run locally with `npm run dev` and connected to a local or remote Neon DB.
* **Deployment:** Successfully deploy the application to Vercel (or similar hosting) and verify all MVP features function correctly in a production environment.

---

## 5. Definition of Done (for MVP)

* All listed User Stories are implemented and tested.
* All Technical Requirements are met.
* The application is stable and performant.
* Basic error handling is in place.
* The application can be successfully deployed.

---