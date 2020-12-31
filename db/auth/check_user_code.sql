SELECT * FROM info_verifications 
WHERE user_id = $1 AND info = $2 AND expiration_date = $3
ORDER BY id DESC LIMIT 1;