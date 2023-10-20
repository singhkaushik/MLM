# MLM
# Refer and Earn API

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Refer and Earn API is a Node.js-based application that facilitates referral marketing. It allows users to refer others to your platform and earn rewards for successful referrals. This API provides a powerful backend for your "Refer and Earn" project.

## Features

- User registration and authentication.
- Generation of unique referral links for users.
- Tracking referrals and rewarding users for successful referrals.
- User account management.
- Secure API endpoints.

## API Endpoints

The API provides the following endpoints:

### Authentication

- `POST /api/signup`: Register a new user.
- `POST /api/signin`: Log in and obtain an authentication token.
- `POST /api/logout`: Log out and invalidate the authentication token.

### Referral System

- `POST /api/generate-referral-link`: Generate a unique referral link.
- `GET /api/my-referrals`: Retrieve a user's referral history and earnings.
- `GET /api/referral/:referralCode`: Sign up with a referral code.

### User Management

- `GET /api/user/:userId`: Retrieve user information by user ID.
- `PUT /api/user/:userId`: Update user information.
- `DELETE /api/user/:userId`: Delete a user account.

## Getting Started

1. Clone this repository.
2. Install the required dependencies using `npm install`.
3. Configure environment variables and database connection in `.env`.
4. Start the server with `npm start`.

## Authentication

User authentication is essential for accessing most API endpoints. To authenticate, include the obtained token in the `Authorization` header of your requests as follows:


## Usage

1. Register a new user using the `/api/signup` endpoint.
2. Log in with the registered user credentials using the `/api/signin` endpoint.
3. Generate referral links using the `/api/generate-referral-link` endpoint.
4. Share referral links with friends.
5. Track your referrals and earnings with the `/api/my-referrals` endpoint.

For detailed API documentation and usage examples, please refer to our [API Documentation](API_DOCUMENTATION.md).

## Contributing

Contributions are welcome! If you'd like to improve the API or add new features, please fork this repository and create a pull request.



