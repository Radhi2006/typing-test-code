# @codetype medium | Decorator that logs how long a function takes
import time
from functools import wraps


def timed(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            elapsed = (time.perf_counter() - start) * 1000
            print(f"{func.__name__} took {elapsed:.2f} ms")
    return wrapper


@timed
def slow_sum(n: int) -> int:
    return sum(range(n))
