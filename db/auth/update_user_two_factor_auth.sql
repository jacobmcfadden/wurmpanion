UPDATE users SET
two_factor_auth = $3, updated_at = $2
WHERE id = $1
RETURNING *;