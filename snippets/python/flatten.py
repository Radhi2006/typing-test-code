# @codetype easy | Flatten nested lists lazily with a generator
from collections.abc import Iterable, Iterator


def flatten(items: Iterable) -> Iterator:
    for item in items:
        if isinstance(item, Iterable) and not isinstance(item, (str, bytes)):
            yield from flatten(item)
        else:
            yield item


print(list(flatten([1, [2, [3, 4]], (5, 6)])))
