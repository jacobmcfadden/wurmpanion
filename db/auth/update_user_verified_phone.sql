UPDATE users SET
verify_phone = $2, updated_at = $2
WHERE id = $1
RETURNING *;