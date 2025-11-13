# Bertie’s Books Shop

Bertie’s Books Shop is a simple Node.js and Express web application that allows users to browse and manage a collection of books stored in a MySQL database. It includes features such as adding new books, advanced searching, registering users, viewing all available books, and browsing bargain books under £20.

---

## Features

### Add Book
Users can add new books by providing the title and price. The book is then stored in the SQL database and shown in the book list.

### Advanced Search
Users can search for books by title using partial matches.

For example:
- Searching for “World” returns:
  - Brave New World
  - Atlas of the World

### Register
New users can register an account by filling in their details.

### List All Books
Displays every book stored in the database with:
- Book ID
- Title
- Price

### Bargain Books
Shows all books with a price below £20.

---

## Database Structure

The app uses a single `books` table with the following structure:

```sql
CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  price DECIMAL(5,2)
);
```

---

## Technologies Used

- Node.js  
- Express.js  
- EJS template engine  
- MySQL database  
- Body-parser  
- CSS / Bootstrap  

---

## Routes Overview

| Route | Method | Description |
|-------|---------|-------------|
| `/` | GET | Home page |
| `/about` | GET | About page |
| `/books/search` | GET | Displays the search form |
| `/books/search_result` | POST | Returns search results (advanced partial search) |
| `/books/list` | GET | Displays all books |
| `/books/addbook` | GET | Displays form to add a new book |
| `/books/bookadded` | POST | Adds a new book to the database |
| `/books/bargainbooks` | GET | Displays books priced under £20 |
| `/users/register` | GET | Displays user registration form |
| `/users/registered` | POST | Stores user registration data |

---

## Future Improvements

- Add user authentication/login  
- Add author and description fields to books  
- Add sorting/filtering options  
- Add pagination for large book lists  

---

## License

This project is for educational use and is open for modification or extension.
