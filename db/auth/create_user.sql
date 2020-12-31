INSERT INTO users
(email, password, first_name, last_name, phone, created_at, is_admin)
VALUES
($1, $2, $3, $4, $5, $6, $7);

SELECT * FROM users
WHERE email = $1;