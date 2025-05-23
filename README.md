# Address Book App

A contact management and storage web application built with React and Firebase.

---

## Table of Contents

- [About the Project](#about-the-project)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Deployment](#deployment)   
- [Project Structure](#project-structure)   
- [Author](#author)

---

## About the Project

The Address Book App allows users to sign up, log in, and manage a list of personal contacts. Users can add, edit, delete, filter, sort, search, and favorite contacts. The application is fully responsive and stores data securely using Firebase Authentication and Firestore.

---

## Features

- User authentication (Sign up, Log in, Log out)  
- Add new contacts with detailed information  
- Edit or delete existing contacts  
- Mark contacts as favorites (and pin them)  
- Search contacts by name, email, or tags  
- Filter by area code or tags  
- Sort contacts by name or date added  
- Display favorited contacts only
- Fully mobile responsive design  

---

## Tech Stack

- **Frontend**: React, React Router  
- **Backend/Database**: Firebase (Authentication + Firestore)  
- **Hosting**: Firebase Hosting  
- **Styling**: CSS   

---

## Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/your-username/address-book-app.git
   ```

2. Navigate to the project directory  
   ```bash
   cd address-book-app
   ```

3. Install dependencies  
   ```bash
   npm install
   ```

4. Set up your `.env` file with Firebase credentials  
   ```
   VITE_API_KEY=your_api_key
   VITE_AUTH_DOMAIN=your_auth_domain
   VITE_PROJECT_ID=your_project_id
   VITE_STORAGE_BUCKET=your_storage_bucket
   VITE_MESSAGING_SENDER_ID=your_sender_id
   VITE_APP_ID=your_app_id
   ```

5. Start the development server  
   ```bash
   npm run dev
   ```

---

## Usage

1. Sign up or log in (using email/password or Google)
2. Add contacts with name, phone, email, tags, address, and optional photo URL  
3. Edit or delete your current contacts
4. Use filters or search to find specific contacts  
5. Mark important contacts as favorites  
6. Logout, all your contacts will be saved for when you return

---

## Deployment

This app is deployed via Firebase Hosting:

```bash
npm run build
firebase deploy
```

Live deployed site: https://addressbookapp-f3b21.web.app 

--- 

## Project Structure

```
src/
├── components/
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Dashboard.jsx
├── firebase/
│   └── config.js
├── App.jsx
├── AuthContext.jsx
├── ProtectedRoute.jsx
└── index.css
```

---

## Author

**Cornelia Crumley**  
- GitHub: [@Cornelia23](https://github.com/Cornelia23)  
- Email: cornelia_crumley@brown.edu

