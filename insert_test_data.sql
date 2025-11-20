# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES
('gold', 'John', 'Doe', 'golds@gold.ac.uk', '$2b$10$WNbZw/gnrl6vnz2zs2vr7uBjzev0359dIlXHYUNgv8pBKhkaU1tWm') ;