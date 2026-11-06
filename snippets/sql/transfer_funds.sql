-- @codetype medium | Move money between accounts inside a transaction
BEGIN TRANSACTION;

UPDATE accounts
SET balance = balance - 250
WHERE id = 1 AND balance >= 250;

UPDATE accounts
SET balance = balance + 250
WHERE id = 2;

INSERT INTO transfers (from_account, to_account, amount)
VALUES (1, 2, 250);

COMMIT;
