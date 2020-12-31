DELETE FROM info_verifications WHERE expiration_date != $2;
INSERT INTO info_verifications
(hash_string, expiration_date, is_email, info, user_id)
VALUES
($1, $2, $3, $4, $5)
RETURNING *;