# 🚀 RepoPulse

### Your GitHub Activity. Your Developer Journey. One Platform.

RepoPulse is a full-stack developer analytics platform designed to help developers explore GitHub profiles, retrieve developer information, and gain insights into their coding journey.

The project integrates the GitHub REST API with a backend authentication and developer-data management system.

---

## ✨ Key Features

- **GitHub Profile Integration** – Retrieve developer information using GitHub usernames.
- **Developer Data Management** – Store and manage developer profile information.
- **Secure Authentication** – User registration and login using password hashing.
- **JWT Authentication** – Token-based authentication for protected API access.
- **REST API Architecture** – Structured backend APIs for handling application requests.
- **Full-Stack Architecture** – Separate frontend and backend applications.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| JavaScript | Application logic |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | Database modelling |
| JWT | Authentication |
| bcrypt.js | Password hashing |
| Git & GitHub | Version control |

## 📁 Project Structure

```text
RepoPulse/
│
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sayantanimandal07-pixel/RepoPulse.git
```

### 2. Navigate to the project

```bash
cd RepoPulse
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 5. Configure environment variables

Create a `.env` file inside the backend directory and configure the required database connection, JWT secret, and other environment variables used by the application.

Never commit your `.env` file.

### 6. Run the application

Start the backend and frontend using the development scripts configured in their respective `package.json` files.

## 🗺️ Development Roadmap

- [x] Initial project setup
- [x] Backend authentication implementation
- [x] JWT authentication middleware
- [x] GitHub API integration
- [ ] Complete frontend integration
- [ ] Developer analytics dashboard
- [ ] GitHub contribution insights
- [ ] Data visualization
- [ ] Application deployment

## 🎯 Project Objective

The goal of RepoPulse is to create a centralized developer analytics experience that makes GitHub activity and developer information easier to explore and understand.

## 👩‍💻 Author

**Sayantani Mandal**

B.Tech CSE (Data Science)

GitHub: [@sayantanimandal07-pixel](https://github.com/sayantanimandal07-pixel)

---

⭐ If you find this project interesting, consider giving it a star!

*Built with curiosity, consistency, and a passion for learning.*