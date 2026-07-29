# 🏡 Hulu Properties

**Hulu Properties** is a modern real estate platform designed to help users discover, explore, and manage properties in Addis Ababa. The platform focuses on showcasing premium and luxury furnished apartments while providing a trusted and user-friendly property browsing experience.

> **More than a home… a lifestyle.**

## 🌐 Live Demo

[Hulu Properties Live Website](https://huluproperties.vercel.app/?utm_source=chatgpt.com)

## 📦 Repository

[GitHub Repository](https://github.com/Bemnet-dev/HuluProperties?utm_source=chatgpt.com)

---

## ✨ Features

* 🏠 **Property Listings** — Browse available properties with detailed information.
* 🔍 **Property Search** — Easily discover properties based on user needs.
* 🖼️ **Property Galleries** — View property images and explore different spaces.
* 📱 **Responsive Design** — Optimized for desktop, tablet, and mobile devices.
* 🔐 **Authentication** — Secure user authentication and account management.
* 👥 **Role-Based Access** — Different access levels for users and property management.
* 📊 **Property Management** — Structured system for managing properties and users.
* ⚡ **Modern User Experience** — Clean, intuitive, and responsive interface.
* 🏙️ **Addis Ababa Properties** — Focused on premium and modern properties in Addis Ababa.

---

## 🛠️ Tech Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**

### Backend & Database

* **Supabase**
* **PostgreSQL**

### Deployment

* **Vercel**

---

## 🏗️ Project Architecture

The application follows a modern full-stack architecture:

```text
User
  │
  ▼
Next.js Frontend
  │
  ├── Property Listings
  ├── Property Details
  ├── Search & Discovery
  ├── Authentication
  └── User Interface
  │
  ▼
Supabase
  │
  ├── Authentication
  ├── PostgreSQL Database
  └── Data Management
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Bemnet-dev/HuluProperties.git
```

### 2. Navigate to the Project

```bash
cd HuluProperties
```

### 3. Install Dependencies

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your Supabase project credentials.

### 5. Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

---

## 📁 Project Structure

```text
HuluProperties/
├── app/
│   ├── components/
│   ├── properties/
│   ├── auth/
│   └── ...
├── public/
│   ├── images/
│   └── ...
├── lib/
│   └── ...
├── types/
│   └── ...
├── .env.local
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

> The exact folder structure may vary depending on the current implementation of the project.

---

## 🎯 Project Goals

Hulu Properties aims to create a reliable and modern digital experience for real estate discovery by:

* Making property discovery simple and accessible.
* Providing detailed and visually engaging property listings.
* Building trust through transparent property information.
* Creating a scalable foundation for real estate management.
* Delivering a seamless experience across different devices.

---

## 🔮 Future Improvements

Potential future features include:

* 🗺️ Interactive property maps
* ❤️ Favorites and saved properties
* 💬 Property inquiries and messaging
* 📅 Property viewing appointments
* 🔔 Property notifications
* 💳 Online booking and payment
* 🧑‍💼 Advanced admin dashboard
* 📈 Property analytics
* 🤖 AI-powered property recommendations

---

## 👨‍💻 Author

**Bemnet Yitagesu**

* GitHub: [Bemnet-dev on GitHub](https://github.com/Bemnet-dev)

---

## 📄 License

This project is developed as a real estate platform project by **Bemnet Yitagesu**.

---

⭐ If you find this project interesting, consider giving the repository a star!
