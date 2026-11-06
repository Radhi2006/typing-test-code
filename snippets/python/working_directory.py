# @codetype medium | Context manager that temporarily changes directory
import os
from contextlib import contextmanager
from pathlib import Path


@contextmanager
def working_directory(path: str | Path):
    previous = Path.cwd()
    os.chdir(path)
    try:
        yield Path(path)
    finally:
        os.chdir(previous)


with working_directory("/tmp") as cwd:
    print(f"Now in {cwd}")
