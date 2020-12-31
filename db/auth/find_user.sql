SELECT * FROM users
WHERE email = $1 OR phone = $1;