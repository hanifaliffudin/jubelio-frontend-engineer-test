# Jubelio Frontend Engineer Test

## About The Project

This project demonstrates various frontend development skills required for a Jubelio Frontend Engineer role. It implements a product management system with authentication, CRUD operations for products, a shopping cart system, and a basic dashboard.

Features:

- Auth:
  - Login
  - Logout
- Products:
  - Table List Product
  - Search Product
  - Add Product
  - View Detail Product
  - Add to Cart
  - Edit Product
  - Delete Product
- Carts:
  - Table List Cart
  - View Detail in Modal

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/hanifaliffudin/jubelio-frontend-engineer-test.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run dev
   ```sh
   npm run dev
   ```
4. Run test
   ```sh
   npm test
   ```

### Assumptions or Decisions

- Auth
  - Login using user from https://dummyjson.com/users
  - Every page changed, fetch auth me first to check token expired
  - To try expired, in the login payload the expiresInMins is changed to 1
- Products
  - Product list table, pagination using infinite scroll
  - Get detail using ssr, so no action
  - Create, edit, and delete only fetch, does not affect what is in the table or db
  - Search with static function, filter array
- Carts
  - List cart in table pure from api, which is added to local storage is separated in my cart
  - Table list cart, pagination using button
  - Modal detail cart does not fetch, only uses find array list cart
  - Search difficult to implement :(
- Unit Testing
  - Only check element html in layout

### Built With

- ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
- ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
