# @codetype medium | Bank account class with validation
class InsufficientFunds(Exception):
    pass


class BankAccount:
    def __init__(self, owner: str, balance: float = 0.0) -> None:
        self.owner = owner
        self._balance = balance

    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self._balance += amount

    def withdraw(self, amount: float) -> None:
        if amount > self._balance:
            raise InsufficientFunds(f"{self.owner} has only {self._balance}")
        self._balance -= amount

    def __repr__(self) -> str:
        return f"BankAccount({self.owner!r}, {self._balance:.2f})"
