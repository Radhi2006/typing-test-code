# @codetype hard | Concurrent async tasks limited by a semaphore
import asyncio
import random


async def download(url: str, limit: asyncio.Semaphore) -> tuple[str, int]:
    async with limit:
        await asyncio.sleep(random.uniform(0.1, 0.5))
        size = random.randint(1_000, 50_000)
        print(f"downloaded {url} ({size} bytes)")
        return url, size


async def main() -> None:
    limit = asyncio.Semaphore(3)
    urls = [f"https://example.com/file/{i}" for i in range(10)]
    results = await asyncio.gather(*(download(u, limit) for u in urls))
    total = sum(size for _, size in results)
    print(f"total: {total:,} bytes")


if __name__ == "__main__":
    asyncio.run(main())
