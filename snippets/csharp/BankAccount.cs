// @codetype medium | Properties, guard clauses and exceptions
using System;

public class BankAccount
{
    public string Owner { get; }
    public decimal Balance { get; private set; }

    public BankAccount(string owner, decimal initial = 0m)
    {
        Owner = owner ?? throw new ArgumentNullException(nameof(owner));
        Balance = initial;
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentOutOfRangeException(nameof(amount), "Must be positive");
        Balance += amount;
    }

    public void Withdraw(decimal amount)
    {
        if (amount > Balance)
            throw new InvalidOperationException($"{Owner} has insufficient funds");
        Balance -= amount;
    }
}
