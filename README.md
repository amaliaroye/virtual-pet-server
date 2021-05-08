# Project 2: Virtual Pet Server

## Description
Express API Server for Virtual Pet application.

### Technologies Used
- Javascript
- Express
- Mongoose
- MongoDB
-
## Important Links
[Github Repository](https://github.com/amaliaroye/virtual-pet-server)
[Deployed Server](https://virtual-pet-server.herokuapp.com/)

## Entity Relationship Diagram
![Entity Relationship Diagram](https://i.imgur.com/jfBCUKA.jpg)

### Pets CRUD

| Verb   | URI Pattern      | Controller#Action |
|--------|------------------|-------------------|
| GET    | `/pets`          | `pets#index`      |
| GET    | `/pets/:id`      | `pets#show`       |
| POST   | `/pets`          | `pets#create`     |
| PATCH  | `/pets/:id/`     | `pets#update`     |
| DELETE | `/pets/:id/`     | `pets#release`    |


### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/`    | `users#changepw`  |
| DELETE | `/sign-out/`           | `users#signout`   |
