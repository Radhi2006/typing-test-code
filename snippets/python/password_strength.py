# @codetype easy | Score a password by the rules it satisfies
import string


def password_score(password: str) -> int:
    checks = [
        len(password) >= 12,
        any(c in string.ascii_lowercase for c in password),
        any(c in string.ascii_uppercase for c in password),
        any(c in string.digits for c in password),
        any(c in string.punctuation for c in password),
    ]
    return sum(checks)


print(password_score("Typing-Test-2024"))
