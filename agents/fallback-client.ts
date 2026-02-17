/**
 * Model Client with Automatic Fallback
 * 
 * Wrapper for model API calls that handles failures and switches models automatically.
 */

import { ModelFallbackManager, fallbackManager } from './fallback-manager';
import { HealthChecker, healthChecker } from './health-checker';

interface ModelRequest {
  messages: Array<{ role: string; content: string }>;
  tools?: Array<{
    type: string;
    function: {
      name: string;
      description: string;
      parameters: Record<string, unknown>;
    };
  }>;
  temperature?: number;
  maxTokens?: number;
}

interface ModelResponse {
  content?: string;
  toolCalls?: Array<{
    id: string;
    type: string;
    function: {
      name: string;
      arguments: string;
    };
  }>;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface FallbackClientOptions {
  mode?: 'strict' | 'auto' | 'manual';
  maxSwitches?: number;
  notifyOnSwitch?: boolean;
}

/**
 * FallbackModelClient - Automatic fallback wrapper for model calls
 */
export class FallbackModelClient {
  private manager: ModelFallbackManager;
  private healthChecker: HealthChecker;
  private options: FallbackClientOptions;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  constructor(
    manager: ModelFallbackManager = fallbackManager,
    healthChecker: HealthChecker = healthChecker,
    options: FallbackClientOptions = {}
  ) {
    this.manager = manager;
    this.healthChecker = healthChecker;
    this.options = {
      mode: 'auto',
      maxSwitches: 3,
      notifyOnSwitch: true,
      ...options
    };
  }

  /**
   * Send request with automatic fallback
   */
  async sendRequest(request: ModelRequest): Promise<{
    response: ModelResponse;
    switches: number;
    notifications: string[];
  }> {
    const notifications: string[] = [];
    let switches = 0;

    // Add to conversation history
    this.conversationHistory.push(...request.messages);

    while (switches <= (this.options.maxSwitches || 3)) {
      const currentModel = this.manager.getCurrentModel();
      
      if (!currentModel) {
        throw new Error('No available models in fallback chain');
      }

      try {
        console.log(`[FallbackClient] Trying model: ${currentModel.model}`);
        
        const response = await this.callModel(currentModel.model, request);
        
        // Success - update health and return
        this.manager.updateHealth(currentModel.model, true);
        
        // Add response to history
        if (response.content) {
          this.conversationHistory.push({
            role: 'assistant',
            content: response.content
          });
        }

        return {
          response: { ...response, model: currentModel.model },
          switches,
          notifications
        };

      } catch (error) {
        const errorInfo = this.parseError(error);
        console.error(`[FallbackClient] Error with ${currentModel.model}:`, errorInfo);

        // Update health status
        this.manager.updateHealth(currentModel.model, false, errorInfo.message);

        // Determine action
        const action = this.manager.determineAction(errorInfo);

        // Handle rate limit
        if (action.action === 'rate_limit_wait' && action.waitSeconds) {
          console.log(`[FallbackClient] Rate limited. Waiting ${action.waitSeconds}s...`);
          await this.sleep(action.waitSeconds * 1000);
          continue; // Retry same model
        }

        // Handle auth retry
        if (action.action === 'refresh_key_then_retry' && action.maxRetries) {
          // In production, would refresh API key here
          console.log('[FallbackClient] Auth error - would refresh key');
        }

        // Execute fallback
        if (action.action === 'switch_immediately' || action.action === 'retry_then_switch') {
          const fallback = await this.manager.executeFallback(errorInfo.message || 'Unknown error');
          
          if (!fallback.success) {
            throw new Error('Fallback failed: No more models available');
          }

          switches++;
          
          if (fallback.notification && this.options.notifyOnSwitch) {
            notifications.push(fallback.notification);
            console.log(fallback.notification);
          }
        }
      }
    }

    throw new Error(`Max switches (${this.options.maxSwitches}) exceeded`);
  }

  /**
   * Call model API (placeholder - integrate with actual API)
   */
  private async callModel(model: string, request: ModelRequest): Promise<ModelResponse> {
    // This is a placeholder - integrate with actual OpenRouter/Moonshot/Groq clients
    
    // Example integration points:
    // - OpenRouter: Use @openrouter/sdk or direct fetch
    // - Moonshot: Use moonshot SDK
    // - Groq: Use groq SDK
    // - KiloCode: Use kilo CLI

    throw new Error(`Model API not implemented for ${model}. Integrate with actual API client.`);
  }

  /**
   * Parse error into structured format
   */
  private parseError(error: unknown): { code?: number; message: string } {
    if (error instanceof Error) {
      // Try to extract HTTP status code
      const codeMatch = error.message.match(/(\d{3})/);
      const code = codeMatch ? parseInt(codeMatch[1]) : undefined;
      
      return {
        code,
        message: error.message
      };
    }
    
    return {
      message: String(error)
    };
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): Array<{ role: string; content: string }> {
    return [...this.conversationHistory];
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Reset to primary model
   */
  resetToPrimary(): void {
    this.manager.resetToPrimary();
    this.clearHistory();
  }

  /**
   * Get current model info
   */
  getCurrentModel() {
    return this.manager.getCurrentModel();
  }

  /**
   * Start health monitoring
   */
  startHealthChecks(intervalMinutes?: number): void {
    this.healthChecker.start(intervalMinutes);
  }

  /**
   * Stop health monitoring
   */
  stopHealthChecks(): void {
    this.healthChecker.stop();
  }
}

// Export singleton
export const fallbackClient = new FallbackModelClient();

// Default export
export default FallbackModelClient;
