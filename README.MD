# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

---

## Using dotenv for Environment Variables

This project uses **dotenv** to securely load database configuration values from a `.env` file instead of hard-coding them.

### 1. Install dotenv
```bash
npm install dotenv
```

### 2. Create a `.env` File  
Add your database credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=berties_books
```

### 3. Load dotenv in `app.js`
At the very top of `app.js`, add:

```js
require('dotenv').config();
```

### 4. Use Environment Variables in the MySQL Connection

```js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
```

### 5. Why dotenv Is Used

- Keeps passwords and credentials **out of your code**  
- Prevents sensitive data from being committed to GitHub  
- Makes the project portable for different machines (different `.env` files)

---

## Audit Log Implementation

To track successful and failed login attempts, an **audit log** was implemented. This helps monitor user access and improves security by keeping a record of login activity.

### 1. Database Table

A table named `audit_log` was created with the following fields:

```sql
CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    success BOOLEAN NOT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- `username` stores the attempted username.  
- `success` records whether the login attempt was successful (`true`) or failed (`false`).  
- `attempt_time` automatically logs when the attempt occurred.

### 2. Logging Login Attempts

In the `/loggedin` route, every login attempt is recorded:

```js
router.post('/loggedin', function (req, res, next) {
    const username = req.body.username;

    let sqlquery = 'SELECT * FROM users WHERE username = ?';
    db.query(sqlquery, [username], (err, result) => {
        if (err) next(err);

        function logAttempt(username, success) {
            const logSql = 'INSERT INTO audit_log (username, success) VALUES (?, ?)';
            db.query(logSql, [username, success], (err) => {
                if (err) console.error('Error logging login attempt:', err);
            });
        }

        if (result.length === 0) {
            logAttempt(username, false);
            res.send('No such user found');
        } else {
            const hashedPassword = result[0].hashedPassword;
            bcrypt.compare(req.body.password, hashedPassword, function(err, passwordMatch) {
                if (err) next(err);

                if (passwordMatch) {
                    logAttempt(username, true);
                    res.send('Login successful! Welcome back, ' + result[0].firstName);
                } else {
                    logAttempt(username, false);
                    res.send('Incorrect password');
                }
            });
        }
    });
});
```

- **Failed attempts** are logged if the username does not exist or the password is incorrect.  
- **Successful attempts** are logged when the password matches.  

### 3. Viewing the Audit Log

A route `/audit` was created to display all login attempts:

```js
router.get('/audit', function (req, res, next) {
    let sqlquery = 'SELECT * FROM audit_log ORDER BY attempt_time DESC';
    db.query(sqlquery, (err, result) => {
        if (err) next(err);
        res.render('auditlog.ejs', { auditLog: result });
    });
});
```

### 4. Displaying in EJS

In `auditlog.ejs`, all records are displayed in a table:

```ejs
<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Username</th>
      <th>Success</th>
      <th>Attempt Time</th>
    </tr>
  </thead>
  <tbody>
    <% auditLog.forEach(function(entry) { %>
      <tr>
        <td><%= entry.id %></td>
        <td><%= entry.username %></td>
        <td><%= entry.success ? 'Yes' : 'No' %></td>
        <td><%= entry.attempt_time %></td>
      </tr>
    <% }); %>
  </tbody>
</table>
```

This allows administrators to **see all login activity**, including failed attempts, in a readable format.

---

## Authorisation

- Log in required to access bargain books route as it can be seen as an exclusive feature for members
- Log in required to see fellow registered users
- Log in required to view audit log

## Validation

I have added validation to:

- Every field in register form
- Search books field to make sure input is not empty
- Both fields in add book page to make sure values are inputted as expected

## Task 5

The script is run because the registration confirmation page is vulnerable to reflected XSS. My code takes the user input and sends it straight back into the HTML response without escaping. 

## Sanitisation

- Added to First Name, Last Name and Password as those inputs are displayed on the registration confirmation page
- Email field does not require sanitisation as express-validator only accepts email inputs
- Name of book in add book route as it displays the name of book you have chosen to add
- Price in add book route does not require sanitisation as validator only accepts float values anyways