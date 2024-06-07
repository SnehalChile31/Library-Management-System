
# Library Management System
Develop a RESTful API for a library management system using Node.js, Express, and SQLite.

When you run the application using  `npm start` then `library.sqlite` file gets created. 

Download SQLite vs code extension. So that you can see databases, tables and columns in vs code.

Right click on `library.sqlite` -> Open Database


## Run Locally

Clone the project

```bash
  git clone git@github.com:SnehalChile31/Library-Management-System.git
```

Install dependencies

```bash
  npm install
```
Create .env file and add env variables
```bash
  PORT=3000
  JWT_SECRET=jwtsecretkey
```
Start the server

```bash
  npm start
```
To run the test case
```bash
  npm test
```
## API Reference :

#### Regiseter as a 'admin'

```http
  POST /auth/register/admin
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`    | `string` | **Required**.  |
| `password` | `string` | **Required**.  |

#### Regiseter as a 'user'

```http
  POST /auth/register/user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`    | `string` | **Required**.  |
| `password` | `string` | **Required**.  |


#### Login as a 'user'/admin 

```http
  POST /auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`    | `string` | **Required**.  |
| `password` | `string` | **Required**.  |
| `isAdmin` | `string` | **Required**. pass true for admin, false for user |


#### Add Book : only admin user can add book. pass Authorization token of admin in headers

```http
  POST /books/addBook
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title`    | `string` | **Required**.  |
| `author` | `string` | **Required**.  |
| `isbn` | `string` | **Required**.  |
| `publicationYear` | `number` | **Required**.  |
| `actualQuantity` | `number` | **Required**.  |
| `currentQuantity` | `number` | **Required**.  |


#### Update Book : only admin user can update book. pass Authorization token of admin in headers

```http
  POST /books/update/:id
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title`    | `string` | **Required**.  |
| `author` | `string` | **Required**.  |
| `isbn` | `string` | **Required**.  |
| `publicationYear` | `number` | **Required**.  |
| `actualQuantity` | `number` | **Required**.  |
| `currentQuantity` | `number` | **Required**.  |


#### Delete Book : only admin user can delete book. pass Authorization token of admin in headers

```http
  POST /books/delete/:id
```


#### Borrow Book : only users can add book. pass Authorization token of user in headers

```http
  POST /borrow
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `bookId`    | `string` | **Required**.  |
| `dueDate` | `string` | **Required**.  |



#### Return Book : only users can return book. pass Authorization token of user in headers

```http
  POST /borrow/return/6
```


#### Check Overdue Book : Admin user can see Overdue books list. pass Authorization token of admin in headers

```http
  POST /admin/overdueBooks
```
