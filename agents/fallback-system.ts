/**
 * Model Fallback System - Main Entry Point
 * 
 * Provides automatic model switching when primary models fail.
 * 
 * Usage:
 *   import { fallbackClient, fallbackManager, healthChecker } from './fallback-system';
 *   
 *   // Send request with automatic fallback
 *   const result = await fallbackClient.sendRequest({
 *     messages: [{ role: 'user', content: 'Hello' }]
 *   });
 * 
 *   // Start health monitoring
 *   healthChecker.start(30); // Check every 30 minutes
 */

export { ModelFallbackManager, fallbackManager } from './fallback-manager';
export { HealthChecker, healthChecker } from './health-checker';
export { FallbackModelClient, fallbackClient } from './fallback-client';

// Re-export types
export type { 
  FallbackConfig, 
  ModelConfig, 
  FallbackTrigger, 
  HealthStatus, 
  FallbackState 
} from './fallback-manager';

export type { 
  HealthCheckResult, 
  HealthCheckOptions 
} from './health-checker';

export type { 
  ModelRequest, 
  ModelResponse, 
  FallbackClientOptions 
} from './fallback-client';
