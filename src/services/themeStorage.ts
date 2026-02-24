/**
 * Theme Storage Service
 * 
 * Provides localStorage-based persistence for theme preferences.
 * Handles serialization, deserialization, and error handling for storage operations.
 * Includes retry logic with exponential backoff for transient failures.
 * 
 * Requirements: 8.1, 8.2, 8.4, 1.3, 1.4, 8.3
 */

import { ThemeType, ThemeStorageData } from '../types/theme';

/**
 * Storage key for theme data in localStorage
 */
const THEME_STORAGE_KEY = 'cargowarex_theme';

/**
 * Current version of the theme storage format
 * Used for future migration support
 */
const STORAGE_VERSION = '1.0.0';

/**
 * Retry configuration for storage operations
 * Requirement: 1.3, 1.4 - Add retry logic for transient storage failures
 */
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 100; // milliseconds
const MAX_RETRY_DELAY = 2000; // milliseconds

/**
 * Custom error class for storage-related errors
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly operation: 'save' | 'load' | 'clear',
    public readonly isRetryable: boolean = true,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Theme Storage Service Interface
 * Defines the contract for theme persistence operations
 */
export interface ThemeStorageService {
  saveTheme(themeId: ThemeType): Promise<void>;
  loadTheme(): Promise<ThemeType | null>;
  clearTheme(): Promise<void>;
}

/**
 * Implementation of the Theme Storage Service
 * Uses localStorage for persistence with comprehensive error handling and retry logic
 */
class ThemeStorageServiceImpl implements ThemeStorageService {
  /**
   * Sleep utility for retry delays
   * Requirement: 1.3 - Implement exponential backoff for retries
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Calculate exponential backoff delay
   * Requirement: 1.3 - Implement exponential backoff for retries
   */
  private getRetryDelay(attempt: number): number {
    const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
    return Math.min(delay, MAX_RETRY_DELAY);
  }

  /**
   * Retry wrapper for storage operations
   * Requirement: 1.3 - Add retry logic for transient storage failures
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    operationName: 'save' | 'load' | 'clear'
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Check if error is retryable
        const isRetryable = this.isRetryableError(error);
        
        if (!isRetryable || attempt === MAX_RETRIES - 1) {
          // Don't retry if error is not retryable or we've exhausted retries
          throw new StorageError(
            `Failed to ${operationName} theme after ${attempt + 1} attempt(s): ${lastError.message}`,
            operationName,
            isRetryable,
            lastError
          );
        }

        // Wait before retrying with exponential backoff
        const delay = this.getRetryDelay(attempt);
        console.warn(
          `Storage ${operationName} failed (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delay}ms...`,
          error
        );
        await this.sleep(delay);
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new StorageError(
      `Failed to ${operationName} theme after ${MAX_RETRIES} attempts`,
      operationName,
      false,
      lastError || undefined
    );
  }

  /**
   * Determine if an error is retryable
   * Requirement: 1.3 - Add retry logic for transient storage failures
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      // QuotaExceededError is not retryable
      if (message.includes('quota') || message.includes('exceeded')) {
        return false;
      }
      
      // Invalid theme ID is not retryable
      if (message.includes('invalid theme')) {
        return false;
      }
      
      // Most other errors (network issues, temporary locks, etc.) are retryable
      return true;
    }
    
    return true; // Unknown errors are considered retryable
  }

  /**
   * Save theme selection to persistent storage with retry logic
   * 
   * @param themeId - The theme identifier to save
   * @throws StorageError if storage is unavailable or write fails after retries
   * 
   * Requirements: 8.1, 1.3 - Theme save triggers storage with retry logic
   */
  async saveTheme(themeId: ThemeType): Promise<void> {
    return this.retryOperation(async () => {
      // Validate theme ID before saving
      if (!this.isValidThemeId(themeId)) {
        throw new StorageError(
          `Invalid theme ID: ${themeId}`,
          'save',
          false // Not retryable
        );
      }

      // Create storage data object with metadata
      const storageData: ThemeStorageData = {
        themeId,
        timestamp: Date.now(),
        version: STORAGE_VERSION
      };

      // Serialize data to JSON
      const serializedData = JSON.stringify(storageData);

      // Write to localStorage
      try {
        localStorage.setItem(THEME_STORAGE_KEY, serializedData);
      } catch (error) {
        if (error instanceof Error) {
          throw new StorageError(
            error.message,
            'save',
            true,
            error
          );
        }
        throw new StorageError(
          'Unknown error during save',
          'save',
          true
        );
      }
    }, 'save');
  }

  /**
   * Load theme selection from persistent storage with retry logic
   * 
   * @returns The stored theme ID, or null if no theme is stored
   * @throws StorageError if storage is unavailable after retries
   * 
   * Requirements: 8.2, 1.3 - Theme load before render with retry logic
   */
  async loadTheme(): Promise<ThemeType | null> {
    try {
      return await this.retryOperation(async () => {
        // Read from localStorage
        let serializedData: string | null;
        try {
          serializedData = localStorage.getItem(THEME_STORAGE_KEY);
        } catch (error) {
          if (error instanceof Error) {
            throw new StorageError(
              error.message,
              'load',
              true,
              error
            );
          }
          throw new StorageError(
            'Unknown error during load',
            'load',
            true
          );
        }

        // Return null if no data is stored
        if (!serializedData) {
          return null;
        }

        // Deserialize JSON data
        let storageData: ThemeStorageData;
        try {
          storageData = JSON.parse(serializedData) as ThemeStorageData;
        } catch (error) {
          console.warn('Failed to parse theme storage data, clearing storage');
          await this.clearTheme();
          return null;
        }

        // Validate the deserialized data structure
        if (!this.isValidStorageData(storageData)) {
          console.warn('Invalid theme storage data structure, clearing storage');
          await this.clearTheme();
          return null;
        }

        // Validate the theme ID
        if (!this.isValidThemeId(storageData.themeId)) {
          console.warn(`Invalid theme ID in storage: ${storageData.themeId}, clearing storage`);
          await this.clearTheme();
          return null;
        }

        return storageData.themeId;
      }, 'load');
    } catch (error) {
      // Log error but don't throw - allow fallback to default theme
      console.error('Failed to load theme from storage after retries:', error);
      
      // Attempt to clear corrupted data (without retry to avoid infinite loops)
      try {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } catch (clearError) {
        console.error('Failed to clear corrupted theme data:', clearError);
      }
      
      return null;
    }
  }

  /**
   * Clear theme selection from persistent storage with retry logic
   * 
   * @throws StorageError if storage is unavailable after retries
   * 
   * Requirements: 8.4, 1.3 - Handle storage failures with fallback and retry logic
   */
  async clearTheme(): Promise<void> {
    return this.retryOperation(async () => {
      try {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } catch (error) {
        if (error instanceof Error) {
          throw new StorageError(
            error.message,
            'clear',
            true,
            error
          );
        }
        throw new StorageError(
          'Unknown error during clear',
          'clear',
          true
        );
      }
    }, 'clear');
  }

  /**
   * Validate that a theme ID is one of the allowed values
   * 
   * @param themeId - The theme ID to validate
   * @returns true if valid, false otherwise
   */
  private isValidThemeId(themeId: string): themeId is ThemeType {
    const validThemes: ThemeType[] = ['business', 'premium', 'fresh', 'tech'];
    return validThemes.includes(themeId as ThemeType);
  }

  /**
   * Validate that storage data has the expected structure
   * 
   * @param data - The data to validate
   * @returns true if valid, false otherwise
   */
  private isValidStorageData(data: any): data is ThemeStorageData {
    return (
      data !== null &&
      typeof data === 'object' &&
      typeof data.themeId === 'string' &&
      typeof data.timestamp === 'number' &&
      typeof data.version === 'string'
    );
  }
}

/**
 * Singleton instance of the theme storage service
 * Export this instance for use throughout the application
 */
export const themeStorage: ThemeStorageService = new ThemeStorageServiceImpl();
