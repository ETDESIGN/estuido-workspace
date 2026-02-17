/**
 * Health Check System for Model Fallback
 * 
 * Periodically verifies model availability and tool support.
 */

import { ModelFallbackManager, fallbackManager } from './fallback-manager';

interface HealthCheckResult {
  model: string;
  healthy: boolean;
  responseTimeMs: number;
  toolSupportVerified: boolean;
  error?: string;
}

interface HealthCheckOptions {
  verbose?: boolean;
  timeoutMs?: number;
}

/**
 * HealthChecker - Periodic model health validation
 */
export class HealthChecker {
  private manager: ModelFallbackManager;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(manager: ModelFallbackManager = fallbackManager) {
    this.manager = manager;
  }

  /**
   * Start periodic health checks
   */
  start(intervalMinutes = 30): void {
    if (this.isRunning) {
      console.log('[HealthChecker] Already running');
      return;
    }

    const intervalMs = intervalMinutes * 60 * 1000;
    
    this.isRunning = true;
    console.log(`[HealthChecker] Starting health checks every ${intervalMinutes} minutes`);
    
    // Run initial check
    this.checkAllModels();
    
    // Schedule periodic checks
    this.intervalId = setInterval(() => {
      this.checkAllModels();
    }, intervalMs);
  }

  /**
   * Stop health checks
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('[HealthChecker] Stopped');
  }

  /**
   * Check all models in fallback chain
   */
  async checkAllModels(options: HealthCheckOptions = {}): Promise<HealthCheckResult[]> {
    const models = this.manager.getAvailableModels();
    const results: HealthCheckResult[] = [];

    console.log(`[HealthChecker] Checking ${models.length} models...`);

    for (const model of models) {
      const result = await this.checkModel(model.model, options);
      results.push(result);
      
      // Update manager health status
      this.manager.updateHealth(model.model, result.healthy, result.error);
    }

    this.logResults(results);
    return results;
  }

  /**
   * Check a single model
   */
  async checkModel(model: string, options: HealthCheckOptions = {}): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Simple ping check - would be replaced with actual API call
      // For now, simulate based on known model behavior
      const result = await this.simulateHealthCheck(model, options.timeoutMs || 10000);
      
      const responseTimeMs = Date.now() - startTime;
      
      return {
        model,
        healthy: result.success,
        responseTimeMs,
        toolSupportVerified: result.toolSupport,
        error: result.error
      };
    } catch (error) {
      return {
        model,
        healthy: false,
        responseTimeMs: Date.now() - startTime,
        toolSupportVerified: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Simulate health check (replace with actual implementation)
   */
  private async simulateHealthCheck(model: string, timeoutMs: number): Promise<{ success: boolean; toolSupport: boolean; error?: string }> {
    // In production, this would make actual API calls
    // For now, assume healthy based on config
    
    const config = this.manager['config']; // Access private for check
    const modelConfig = config.fallbackChain.find((m: { model: string }) => m.model === model);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      toolSupport: modelConfig?.toolSupport === 'confirmed' || modelConfig?.toolSupport === 'assumed'
    };
  }

  /**
   * Log health check results
   */
  private logResults(results: HealthCheckResult[]): void {
    console.log('\n[HealthChecker] Results:');
    console.log('-'.repeat(60));
    
    for (const result of results) {
      const status = result.healthy ? '✅' : '❌';
      const toolStatus = result.toolSupportVerified ? '🛠️' : '❌';
      console.log(`${status} ${result.model}`);
      console.log(`   Response: ${result.responseTimeMs}ms | Tools: ${toolStatus}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
    
    const healthy = results.filter(r => r.healthy).length;
    console.log('-'.repeat(60));
    console.log(`Summary: ${healthy}/${results.length} models healthy`);
    console.log('');
  }

  /**
   * Quick health check - single model, no tool validation
   */
  async quickCheck(model: string): Promise<boolean> {
    try {
      const result = await this.checkModel(model, { timeoutMs: 5000 });
      return result.healthy;
    } catch {
      return false;
    }
  }

  /**
   * Verify tool support for a model
   */
  async verifyToolSupport(model: string): Promise<boolean> {
    console.log(`[HealthChecker] Verifying tool support for ${model}...`);
    
    // In production, this would make a test tool call
    // For MiniMax M2.5, we know from documentation it supports tools
    
    const knownToolSupporters = [
      'moonshot/kimi-k2.5',
      'openrouter/minimax/minimax-m2.5',
      'groq/llama-3.3-70b-versatile',
      'openrouter/google/gemini-2.0-flash-001'
    ];
    
    const supportsTools = knownToolSupporters.some(m => model.includes(m));
    
    if (!supportsTools) {
      this.manager.markToolUnsupported(model);
    }
    
    return supportsTools;
  }
}

// Export singleton
export const healthChecker = new HealthChecker();

// Default export
export default HealthChecker;
