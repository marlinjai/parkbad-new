// src/lib/retry.ts
/**
 * Retry utility function with exponential backoff
 * Useful for handling unstable network connections
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  operationName: string = 'operation'
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`${operationName} - Attempt ${attempt}/${maxRetries}`);
      const result = await operation();
      if (attempt > 1) {
        console.log(`${operationName} - Success after ${attempt} attempts`);
      }
      return result;
    } catch (error) {
      lastError = error as Error;
      console.log(`${operationName} - Attempt ${attempt}/${maxRetries} failed:`, error);
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        console.log(`${operationName} - All ${maxRetries} attempts failed`);
        break;
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`${operationName} - Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Check if an error is a timeout/connection error that should be retried
 */
export function isRetryableError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.code;
  
  return (
    errorCode === 'UND_ERR_CONNECT_TIMEOUT' ||
    errorCode === 'ECONNRESET' ||
    errorCode === 'ENOTFOUND' ||
    errorCode === 'ECONNREFUSED' ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('connect') ||
    errorMessage.includes('network') ||
    errorMessage.includes('fetch failed')
  );
}
