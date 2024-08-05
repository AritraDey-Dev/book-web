```markdown
# Book Odyssey

Welcome to Book Odyssey! This web application allows users to browse, review, and purchase books. Users can also manage their profiles, follow other users, and see a leaderboard of top reviewers.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Sign up, login, and manage user profiles.
- **Book Management**: Add, edit, and delete books.
- **Wishlist**: Add books to a wishlist for future reference.
- **Cart**: Add books to a cart and proceed to checkout.
- **Reviews and Ratings**: Write reviews, rate books, and interact with other users' reviews.
- **Points and Rewards**: Earn points by writing reviews and liking/disliking reviews.
- **Leaderboard**: Display top reviewers based on their points.
- **Follow/Unfollow**: Follow other users and see their reviews.

## Tech Stack

- **Frontend**: React, Next.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Payment**: Stripe
- **Styling**: Tailwind CSS

## Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/adey-github/book-web.git
   cd book-web
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**

   ```sh
   npm run dev
   ```

5. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

- **Home Page**: Browse books and see featured books.
- **Profile Page**: View and update your profile information.
- **Book Details Page**: View book details, add to cart, wishlist, and see reviews.
- **Cart Page**: View cart items and proceed to checkout.
- **Wishlist Page**: View and manage your wishlist.
- **Leaderboard Page**: See the top reviewers.

## API Endpoints

- **Authentication**
  - `POST /api/auth/register`: Register a new user
  - `POST /api/auth/login`: Login a user
  - `POST /api/auth/logout`: Logout a user

- **Books**
  - `GET /api/books`: Get all books
  - `POST /api/books/create`: Create a new book
  - `GET /api/books/:id`: Get a single book
  - `PUT /api/books/:id`: Update a book
  - `DELETE /api/books/:id`: Delete a book

- **Reviews**
  - `GET /api/reviews/:bookId`: Get all reviews for a book
  - `POST /api/reviews/:bookId`: Create a new review
  - `PUT /api/reviews/:reviewId`: Update a review
  - `DELETE /api/reviews/:reviewId`: Delete a review

- **Users**
  - `GET /api/users/:id`: Get a user profile
  - `PUT /api/users/:id`: Update a user profile

- **Leaderboard**
  - `GET /api/leaderboard`: Get the leaderboard

- **Follow/Unfollow**
  - `POST /api/users/:id/follow`: Follow a user
  - `POST /api/users/:id/unfollow`: Unfollow a user

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```

Make sure to replace placeholders like `your_stripe_publishable_key`, `your_stripe_secret_key`, `your_mongodb_connection_string`, etc., with your actual credentials. If you have any additional instructions or information, you can add them to the respective sections.