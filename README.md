
# Evangadi Book Store

A React and Vite bookstore frontend for browsing books, searching the catalog,
filtering categories, managing a shopping cart, and saving a wishlist.

## Technologies

- React
- JavaScript
- Vite
- CSS
- Browser localStorage

## Requirements

- Node.js
- npm
- Git

## Installation

Clone the repository or open the project directory.

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```dotenv
VITE_API_URL=http://localhost:3000/api
```

Start the development server:

```bash
npm run dev
```

## Available features

- Book catalog
- Search by title, author, and description
- Category filtering
- Book details
- Add and remove cart items
- Quantity and subtotal calculations
- Persistent cart
- Wishlist
- Checkout form validation
- Login and registration form interfaces
- Order history interface

## Backend requirements

The frontend service layer expects a backend API for books, authentication,
and orders. Configure the API URL using `VITE_API_URL`.

Authentication, order creation, and payment processing must be implemented
and secured on the backend before the application is used for real customers.

## Production build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Notes

Book records and prices in the sample data are illustrative.
Replace them with verified catalog information before publishing.
