# @codetype hard | Retry decorator with exponential backoff
import random
import time
from functools import wraps


def retry(times: int = 3, base_delay: float = 0.5, exceptions=(Exception,)):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except exceptions as error:
                    if attempt == times - 1:
                        raise
                    delay = base_delay * 2 ** attempt + random.random() / 10
                    print(f"{error!r}, retrying in {delay:.2f}s")
                    time.sleep(delay)
        return wrapper
    return decorator


@retry(times=5, exceptions=(ConnectionError,))
def fetch_data() -> str:
    return "ok"
