# 🎓 Student Manager

> *Easy to use, easy to get. Helping students manage their time and tasks better.*

---

## 📸 Sneak Peek

### Home Page
![Home Page](website_screenshots/Screenshot%202026-09-20%20160530.png)

### Filter Section
![Filter Section](website_screenshots/Screenshot%202026-09-20%20160555.png)

### AI Functionality
![AI Functionality](website_screenshots/Screenshot%202026-09-20%20160702.png)

---

## ✨ Key Features

- [x] **Task Management:** Create, edit, and delete tasks effortlessly.
- [x] **Status Tracking:** Quickly update and change a task's status.
- [x] **Smart Filtering:** Search and filter through your tasks to find exactly what you need.
- [x] **Detailed View:** Open and view the full details of any task.
- [x] **AI Integration:** Provide a raw text prompt, and the AI will automatically extract context and generate a structured task for you.

---

## 📁 Project Structure

A high-level overview of the project's architecture:

```text
📦 Student-Manager
├── 📂 backend                              # Spring Boot application
│   ├── 📂 src/main/java/.../backend
│   │   ├── 📂 controller                   # REST API endpoints
│   │   ├── 📂 dto                          # Data Transfer Objects
│   │   ├── 📂 model                        # Database entities
│   │   ├── 📂 repository                   # Database access layer (Spring Data JPA)
│   │   └── 📂 service                      # Business logic
│   ├── 📂 src/main/resources               # Configuration (application.properties)
│   ├── 📂 src/test                         # Tests
│   └── 📄 pom.xml                          # Maven dependencies
├── 📂 frontend                             # React & Vite application
│   ├── 📂 public                           # Static assets
│   ├── 📂 src
│   │   ├── 📂 components                   # Reusable UI React components
│   │   └── 📂 hooks                        # Custom React hooks
│   ├── 📄 package.json                     # Frontend dependencies and scripts
│   └── 📄 vite.config.js                   # Vite configuration
├── 📂 website_screenshots                  # Images used for documentation
├── 📄 docker-compose.yml                   # Database container setup
└── 📄 .env.example                         # Environment variables template
```

---

## 🛠️ Tech Stack

### Backend
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/springboot-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Maven](https://img.shields.io/badge/apache_maven-%23C71A36.svg?style=for-the-badge&logo=apachemaven&logoColor=white)

### Database & DevOps
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

### AI Integration
![Gemini API](https://img.shields.io/badge/Gemini%20API-%238E75B2.svg?style=for-the-badge&logo=googlebard&logoColor=white)

### Frontend
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

### Tools
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJIDEA-000000.svg?style=for-the-badge&logo=intellij-idea&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![PowerShell](https://img.shields.io/badge/PowerShell-%235391FE.svg?style=for-the-badge&logo=powershell&logoColor=white)

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) (running)
- Java 25
- Node.js and npm
- A [Gemini API key](https://aistudio.google.com/app/apikey) for the AI feature

### Run the app

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/Student-Manager.git
   cd Student-Manager
   ```

2. **Create your `.env` file** in the root folder, based on `.env.example`
   ```bash
   cp .env.example .env
   ```
   Then fill in the values (database credentials and your Gemini API key).

3. **Start the database**
   ```bash
   docker compose up -d
   ```

4. **Start the backend**: run the main application class from your IDE
   (`backend/src/main/java/com/alexstefan/backend`), or from the terminal:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

5. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Open the app** at http://localhost:5173

Now you're good to go: organize your tasks and stay on top of your deadlines! 📚

---

## 👤 Author

**Alexandru-Ștefan Ștefănescu** - [GitHub](https://github.com/<your-username>)
