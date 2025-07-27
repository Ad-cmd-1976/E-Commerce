# 🛒 E-Commerce Platform - Interactive Shopping & Analytics Experience

<p align="center">
  <a href="https://e-commerce-irns.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-3393FF?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/Ad-cmd-1976/E-Commerce" target="_blank">
    <img src="https://img.shields.io/badge/View%20Code-181717?style=for-the-badge&logo=github&logoColor=white" alt="View Code" />
  </a>
</p>

This is a full-stack e-commerce platform built with the MERN stack. It features a rich user interface, secure payment processing, and an admin-facing dashboard for analytics, providing a complete shopping experience.

![Project Screenshot](https://github.com/user-attachments/assets/b552102e-c513-4c35-b978-c4fb92a87bc7)

---

## ✨ Features

- **Dynamic Product Catalog:** Browse and search for products with ease.
- **Shopping Cart & Coupons:** Add items to a cart and apply discount coupons.
- **Secure Payments:** Integrated with the Stripe API for reliable and secure payment processing.
- **User Profiles:** Secure user accounts with JWT authentication for managing profiles and orders.
- **Admin Dashboard:** An admin-facing panel to visualize key metrics like sales trends and user activity.
- **Cloud Image Management:** Uses Cloudinary for efficient image storage and retrieval.

---

## 🛠️ Tech Stack

- **Frontend:** React, Zustand, Axios, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Payments:** Stripe API
- **Deployment:** Render (with CI/CD pipeline)

---

## ⚙️ Setup and Installation

To get this project up and running on your local machine, follow these steps:

```sh
# 1. Clone the repository into your desired directory
git clone https://github.com/Ad-cmd-1976/E-Commerce.git

# 2. Navigate into the project's root folder
cd E-Commerce

# 3. Create a .env file in the root directory.
    You will need to add the following environment variables to this file:

    PORT=8080
    MONGO_URI=your_mongodb_uri

    UPSTASH_REDIS_URI=your_upstadsh_redis_uri

    ACCESS_TOKEN_SECRET=your_access_token_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret

    CLOUDINARY_CLOUD_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_api
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    STRIPE_SECRET_KEY=your_stripe_secret_key

# 4. Run the application
    #  Build Command
        npm run build
    #  Start the application
        npm run start
```
