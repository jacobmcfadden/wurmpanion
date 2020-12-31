UPDATE users SET
password = $2, updated_at = $3
WHERE id = $1
RETURNING *;