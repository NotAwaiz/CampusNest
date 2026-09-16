# CampusNest 🏠🎓

> **FIND. STAY. BELONG.**

CampusNest is a student accommodation and services management platform designed to help students and young professionals discover suitable PGs, hostels, co-living spaces, and flats near their college or workplace.

The project brings two major experiences together under one account:

- 🔎 **Find a Stay** — search, filter, compare, save, and inspect accommodation.
- 🏠 **List a Property** — use the same account to list and manage a property.

The administrator experience remains a separate role for platform management.

---

## ✨ Features

- Premium, responsive student-accommodation marketplace UI
- Full-screen CampusNest brand-reveal video
- Scroll-controlled introduction experience
- Location and monthly-budget search
- Stay-type filters: All Stays, Girls PG, Boys PG, Co-Living & Flats
- City, budget, amenity, gender/stay-type, and sorting filters
- Property detail modal
- Save/bookmark favourite properties
- Owner Portal for listing a property
- Property photo upload with image previews
- Toast notifications and UI feedback
- Mock accommodation dataset for development
- LocalStorage-based prototype behaviour
- Architecture prepared for future Java + MySQL integration

---

## 🎯 Problem Statement

Students often struggle to find trustworthy accommodation near their college or workplace. Information can be scattered, pricing may be unclear, property details may be inconsistent, and comparing accommodation options can be difficult.

CampusNest aims to provide one focused platform where users can discover accommodation, evaluate properties, save options, and eventually move through a rental/application workflow.

---

## 💡 Solution

### Students / Tenants

Users can:

1. Search by location.
2. Select a monthly budget.
3. Choose a stay category.
4. Browse available properties.
5. Apply filters and sorting.
6. Open detailed property information.
7. Save preferred properties.
8. Contact/interact with owners.
9. Move toward a rental request.

### Property Owners

The same account can later be used to:

1. Open the Owner Portal.
2. Enter property information.
3. Add location and rent details.
4. Upload property photographs.
5. Submit a listing.
6. Manage the property.
7. Handle rental requests through the future backend.

### Administrators

The planned admin role will manage:

- Users
- Owners
- Property listings
- Listing verification
- Reviews
- Rental requests
- Platform data

---

## 🧭 User Flow

```text
CampusNest
    │
    ▼
Search Location + Budget
    │
    ▼
Property Listings
    │
    ├── Filter
    ├── Sort
    └── Save
    │
    ▼
Property Details
    │
    ├── Contact
    ├── Save
    └── Request to Rent
            │
            ▼
       Rental Request
```

---

## 🏠 One Account. More Possibilities.

CampusNest intentionally combines the student and owner experiences instead of creating separate websites.

> **Find your next home today. List a property tomorrow.**

This creates a unified marketplace while keeping the owner workflow accessible from the same account.

---

## 🖥️ Current Frontend

### Brand Reveal

The first viewport is dedicated to the CampusNest brand animation.

```text
Page Load
    ↓
Video Paused
    ↓
1st Downward Scroll
    ↓
Video Starts
    ↓
2nd Downward Scroll
    ↓
CampusNest Homepage
```

If the visitor stays on the intro until the video completes, the page transitions to the homepage automatically.

### Homepage / Search Hub

The homepage contains:

- Student-verification messaging
- Location search
- Monthly budget selection
- Stay-category tabs
- Featured accommodation
- Quick discovery controls

### Property Discovery

The current prototype includes six sample properties:

1. Heritage Student Suite & Co-Living
2. Scholars Inn Boys PG
3. Palm Grove Girls Residency
4. Urban Loft Scholar Flat
5. St. Teresa Student Residence
6. Valley View Student PG

The JavaScript mock dataset stores property name, location, rent, distance, image, and description information.

### Filters

The frontend supports:

- City filtering
- Budget filtering
- Gender/stay-type filtering
- Amenity filtering
- Sorting
- Resetting filters

The search interface also recognizes prototype locations such as Kharghar, Nerul, Navi Mumbai, Powai, Bandra, and Vile Parle.

### Saved Properties

Users can bookmark properties. The current prototype initializes sample saved properties and updates bookmark states in the interface.

### Owner Portal

The Owner Portal provides:

- Property name
- City
- Locality
- Rent
- Property photos
- Click-to-upload / drag-and-drop photo area
- Image previews
- Submission feedback

The current prototype simulates listing persistence locally; production persistence will be handled by the Java/MySQL backend.

### Property Details

Property cards open a detailed modal containing property information such as:

- Property name
- Location
- Monthly rent
- Description
- Amenities
- Verification information

---

# 🎨 Design System

CampusNest uses a warm, trustworthy, premium visual identity.

| Token | Hex | Usage |
|---|---|---|
| Midnight Navy | `#082B3D` | Primary structure, headings, trust |
| Campus Teal | `#0F9F9A` | Brand colour, buttons, links, active states |
| Leaf Green | `#4CAF7A` | Success, availability, verification |
| Sunrise Gold | `#F4A261` | Ratings and highlights |
| Warm Cream | `#FFF9F0` | Warm backgrounds |
| White | `#FFFFFF` | Cards and clean surfaces |
| Secondary Text | `#667085` | Muted/interface text |
| Border | `#E7ECEC` | Borders and dividers |

Typography:

- **Epilogue** — headings/display
- **Inter** — body, navigation, labels, interface
- **Material Symbols** — UI icons

---

# 🛠️ Technology Stack

## Current Prototype

| Technology | Purpose |
|---|---|
| HTML5 | Structure and content |
| CSS3 | Custom visual system and responsive styling |
| JavaScript | Interactions and application logic |
| Tailwind CSS CDN | Utility classes and layout |
| Google Fonts | Epilogue + Inter |
| Material Symbols | Icons |
| LocalStorage | Prototype persistence |
| JavaScript mock data | Property data |

The current HTML loads Tailwind CSS from its CDN and defines a custom theme containing colours, spacing, typography, and border-radius tokens.

## Planned Full-Stack Architecture

```text
Frontend
HTML + CSS + JavaScript
        │
        ▼
Java Backend
        │
        ▼
JDBC / API Layer
        │
        ▼
MySQL Database
```

The current repository is frontend-first. The Java/JDBC/MySQL layer is the planned next stage for turning the prototype into a complete database-backed application.

---

# 🏗️ Architecture

```text
┌───────────────────────────────────────┐
│              FRONTEND                 │
│                                       │
│ HTML / CSS / JavaScript / Tailwind    │
│                                       │
│ Search • Filters • Listings            │
│ Saved Stays • Owner Portal             │
│ Property Details • UI Feedback         │
└──────────────────┬────────────────────┘
                   │
                   │ API / HTTP
                   ▼
┌───────────────────────────────────────┐
│             JAVA BACKEND              │
│                                       │
│ Authentication                         │
│ User Management                        │
│ Property Management                    │
│ Rental Requests                        │
│ Reviews                                │
│ Owner Operations                       │
│ Admin Operations                       │
└──────────────────┬────────────────────┘
                   │
                   │ JDBC
                   ▼
┌───────────────────────────────────────┐
│                MYSQL                   │
│                                       │
│ Users                                  │
│ Properties                             │
│ Amenities                              │
│ Saved Properties                       │
│ Rental Requests                        │
│ Reviews                                │
│ Messages                               │
└───────────────────────────────────────┘
```

---

# 🗃️ Planned Database

The future MySQL implementation can use entities such as:

```text
Users
Properties
Amenities
Property_Amenities
Saved_Properties
Rental_Requests
Reviews
Messages
```

A typical relationship is:

```text
User ───────< Saved_Properties >────── Property
  │                                      │
  ├────────< Rental_Requests >───────────┤
  │                                      │
  └──────────────< Reviews >─────────────┘
                                         │
                                      Owner
```

The database is planned for the full-stack phase; the current frontend uses mock JavaScript data.

---

# 📂 Project Structure

```text
CampusNest/
│
├── index.html
├── styles.css
├── script.js
│
├── Campusnest.png
├── Campus nest Logo.png
├── CampusAnimnation.mp4
│
├── README.md
│
└── backend/                 # Planned Java backend
    ├── src/
    │   ├── model/
    │   ├── dao/
    │   ├── service/
    │   ├── controller/
    │   └── util/
    │
    └── database/
        └── schema.sql
```

---

# 🚀 Getting Started

## Prerequisites

For the current frontend prototype:

- Modern web browser
- VS Code recommended
- Internet connection for CDN-hosted Tailwind CSS and Google Fonts

Node.js is **not required** for the current prototype.

## Clone

```bash
git clone https://github.com/your-username/campusnest.git
cd campusnest
```

Replace the example repository URL with your actual GitHub repository.

## Verify Assets

Keep these files in the same project directory:

```text
index.html
styles.css
script.js
CampusAnimnation.mp4
Campusnest.png
Campus nest Logo.png
```

The HTML references `styles.css` and `script.js`, and the brand intro references `CampusAnimnation.mp4`.

## Run

Open `index.html` in a browser, or use VS Code Live Server for development.

---

# 🧪 Prototype Data

The current JavaScript prototype uses a mock dataset.

Each property contains fields similar to:

```javascript
{
    title,
    sub,
    price,
    distance,
    img,
    desc
}
```

This allows the complete frontend experience to be developed before connecting the application to a Java backend and MySQL database.

---

# 📊 Current vs Planned Functionality

| Feature | Prototype | Production |
|---|:---:|:---:|
| Homepage | ✅ | ✅ |
| Responsive UI | ✅ | ✅ |
| Search | ✅ | ✅ |
| Filters | ✅ | ✅ |
| Property details | ✅ | ✅ |
| Saved properties | ✅ | ✅ |
| Owner listing form | ✅ | ✅ |
| Image previews | ✅ | ✅ |
| LocalStorage | ✅ | — |
| Real authentication | — | Planned |
| Java backend | — | Planned |
| MySQL database | — | Planned |
| Real rental requests | Prototype | Planned |
| Owner dashboard | Prototype direction | Planned |
| Admin dashboard | Planned | Planned |
| Real messaging | Planned | Planned |
| Persistent reviews | Planned | Planned |
| Maps | Future | Future |
| AI recommendations | Future | Future |

---

# 🔮 Roadmap

## Phase 1 — Frontend Prototype

- [x] Brand identity
- [x] Homepage
- [x] Search interface
- [x] Property cards
- [x] Filters
- [x] Property details
- [x] Saved properties
- [x] Owner listing interface
- [x] Responsive styling
- [x] Brand reveal animation

## Phase 2 — Java Backend

- [ ] Java project setup
- [ ] Authentication
- [ ] User management
- [ ] Property CRUD
- [ ] Owner operations
- [ ] Rental request management
- [ ] Review management
- [ ] Admin authentication
- [ ] Role-based authorization

## Phase 3 — MySQL

- [ ] Database schema
- [ ] JDBC connection
- [ ] Prepared statements
- [ ] User persistence
- [ ] Property persistence
- [ ] Saved-property persistence
- [ ] Rental-request persistence
- [ ] Review persistence

## Phase 4 — Advanced Services

- [ ] Map integration
- [ ] Real-time messaging
- [ ] Property verification workflow
- [ ] Roommate matching
- [ ] Mess/tiffin discovery
- [ ] Cloud-kitchen discovery
- [ ] Personalized accommodation recommendations
- [ ] Mobile application

---

# 🔐 Security

The current prototype is for academic/demo purposes and should not be considered production-ready authentication or data storage.

Before production deployment, implement:

- Password hashing
- Secure session/authentication management
- Server-side validation
- Role-based access control
- Prepared SQL statements
- Secure file-upload validation
- Input sanitization
- HTTPS
- Rate limiting
- Secure database credentials
- Protection of personal information

---

# 📱 Responsive Design

The interface is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive utility classes and custom CSS adapt the navigation, search interface, property cards, modals, and content layout to different screen sizes.

---

# 🤝 Git Workflow

For frontend development, use a feature branch instead of working directly on `main`.

Example:

```bash
git checkout -b frontend
```

Then:

```bash
git add .
git commit -m "Improve CampusNest frontend"
git push origin frontend
```

Recommended future branches:

```text
frontend
feature/search-filters
feature/owner-dashboard
feature/java-backend
feature/mysql-integration
feature/admin-panel
```

---

# 🔒 License

This project is currently an academic/educational project.

A formal open-source license can be added before public distribution.

---

# 👥 Project

## CampusNest — Student Accommodation & Services Management System

> **FIND. STAY. BELONG.**

A student-focused accommodation platform built to make finding and managing student housing simpler, clearer, and more trustworthy.

---

## 🌱 Vision

CampusNest starts with one simple problem:

> **Finding a place to stay near campus.**

The long-term vision is to evolve CampusNest into a broader student-living ecosystem covering:

- PGs
- Hostels
- Co-living spaces
- Flats
- Roommates
- Mess and food services
- Local student services
- Personalized accommodation recommendations

The project is designed to grow from a frontend prototype into a complete Java + MySQL full-stack application.
