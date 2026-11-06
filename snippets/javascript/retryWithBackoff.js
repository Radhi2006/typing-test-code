// @codetype hard | Retry an async task with exponential backoff
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function retry(task, { retries = 4, baseDelay = 250 } = {}) {
  let attempt = 0;

  while (true) {
    try {
      return await task(attempt);
    } catch (error) {
      if (attempt >= retries) {
        throw new Error(`Failed after ${attempt + 1} attempts`, {
          cause: error,
        });
      }
      const jitter = Math.random() * baseDelay;
      const delay = baseDelay * 2 ** attempt + jitter;
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms`);
      await sleep(delay);
      attempt++;
    }
  }
}
