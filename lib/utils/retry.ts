const RETRYABLE_ERRORS = ['rate_limit', 'timeout', 'api_connection_error', 'api_error'];

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (i === maxAttempts) throw err;
      if (!RETRYABLE_ERRORS.includes(err.code)) throw err;
      await new Promise(r => setTimeout(r, 500 * i));
    }
  }
  throw new Error('Retry failed');
}
