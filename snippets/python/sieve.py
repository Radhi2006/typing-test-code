# @codetype easy | Sieve of Eratosthenes prime generator
def primes_up_to(limit: int) -> list[int]:
    is_prime = [True] * (limit + 1)
    is_prime[0:2] = [False, False]
    for n in range(2, int(limit ** 0.5) + 1):
        if is_prime[n]:
            for multiple in range(n * n, limit + 1, n):
                is_prime[multiple] = False
    return [n for n, prime in enumerate(is_prime) if prime]


print(primes_up_to(50))
