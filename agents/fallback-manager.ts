/**
 * Model Fallback Manager
 * 
 * Handles automatic model switching when primary model fails.
 * Supports health checks, tool validation, and seamless conversation continuity.
 */

import * as fs from 'fs';
import * as path from 'path';

// Types
interface ModelConfig {
  id: string;
  model: string;
  provider: string;
  reason: string;
  description: string;
  costPerMTokens: number;
  toolSupport: 'confirmed' | 'assumed' | 'unsupported';
  maxRetries: number;
  notes?: string;
}

interface FallbackTrigger {
  code?: number;
  messageContains?: string;
  action: string;
  maxRetries?: number;
  waitSeconds?: number;
  description: string;
}

interface HealthCheckConfig {
  enabled: boolean;
  intervalMinutes: number;
  failureThreshold: number;
  recoveryThreshold: number;
  testTool: {
    name: string;
    description: string;
    command: string;
  };
}

interface FallbackConfig {
  fallbackChain: ModelConfig[];
  fallbackTriggers: FallbackTrigger[];
  healthCheck: HealthCheckConfig;
  userPreferences: {
    defaultMode: string;
    strictMode: { fallback: boolean };
    autoMode: { fallback: boolean; notifyOnSwitch: boolean };
    manualMode: { fallback: boolean; confirmBeforeSwitch: boolean };
    excludedModels: string[];
  };
  conversation: {
    preserveContext: boolean;
    preserveSystemPrompt: boolean;
    notifyOnSwitch: boolean;
    notificationTemplate: string;
  };
}

interface HealthStatus {
  model: string;
  healthy: boolean;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  lastChecked: Date | null;
  lastError: string | null;
  toolSupportVerified: boolean;
}

interface FallbackState {
  currentModelIndex: number;
  originalModel: string;
  switchCount: number;
  switchHistory: Array<{
    from: string;
    to: string;
    reason: string;
    timestamp: Date;
  }>;
}

/**
 * ModelFallbackManager - Core fallback system
 */
export class ModelFallbackManager {
  private config: FallbackConfig;
  private healthStatus: Map<string, HealthStatus> = new Map();
  private state: FallbackState;
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || path.join(process.cwd(), 'config', 'fallback-models.json');
    this.loadConfig();
    this.initializeHealthStatus();
    this.resetState();
  }

  /**
   * Load configuration from JSON file
   */
  private loadConfig(): void {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf-8');
      this.config = JSON.parse(configData);
      console.log(`[FallbackManager] Loaded config with ${this.config.fallbackChain.length} models`);
    } catch (error) {
      console.error('[FallbackManager] Failed to load config:', error);
      this.config = this.getDefaultConfig();
    }
  }

  /**
   * Default configuration if file loading fails
   */
  private getDefaultConfig(): FallbackConfig {
    return {
      fallbackChain: [
        { id: 'primary', model: 'moonshot/kimi-k2.5', provider: 'moonshot', reason: 'primary', description: 'Primary model', costPerMTokens: 1.5, toolSupport: 'confirmed', maxRetries: 2 },
        { id: 'backup', model: 'openrouter/minimax/minimax-m2.5', provider: 'openrouter', reason: 'quality_backup', description: 'Backup model', costPerMTokens: 0, toolSupport: 'confirmed', maxRetries: 1 }
      ],
      fallbackTriggers: [
        { code: 404, action: 'switch_immediately', description: 'Not found' },
        { code: 401, action: 'refresh_key_then_retry', maxRetries: 2, description: 'Auth error' }
      ],
      healthCheck: {
        enabled: true,
        intervalMinutes: 30,
        failureThreshold: 3,
        recoveryThreshold: 2,
        testTool: { name: 'health_check_echo', description: 'Health check', command: 'echo health_check' }
      },
      userPreferences: {
        defaultMode: 'auto',
        strictMode: { fallback: false },
        autoMode: { fallback: true, notifyOnSwitch: true },
        manualMode: { fallback: true, confirmBeforeSwitch: true },
        excludedModels: []
      },
      conversation: {
        preserveContext: true,
        preserveSystemPrompt: true,
        notifyOnSwitch: true,
        notificationTemplate: '⚠️  Switched to {model} ({reason})'
      }
    };
  }

  /**
   * Initialize health tracking for all models
   */
  private initializeHealthStatus(): void {
    for (const model of this.config.fallbackChain) {
      this.healthStatus.set(model.model, {
        model: model.model,
        healthy: true,
        consecutiveFailures: 0,
        consecutiveSuccesses: 0,
        lastChecked: null,
        lastError: null,
        toolSupportVerified: model.toolSupport === 'confirmed'
      });
    }
  }

  /**
   * Reset fallback state
   */
  private resetState(): void {
    this.state = {
      currentModelIndex: 0,
      originalModel: this.config.fallbackChain[0]?.model || '',
      switchCount: 0,
      switchHistory: []
    };
  }

  /**
   * Get current active model
   */
  getCurrentModel(): ModelConfig | null {
    return this.config.fallbackChain[this.state.currentModelIndex] || null;
  }

  /**
   * Get next model in fallback chain
   */
  getNextModel(): ModelConfig | null {
    // Skip excluded models and unhealthy models
    for (let i = this.state.currentModelIndex + 1; i < this.config.fallbackChain.length; i++) {
      const model = this.config.fallbackChain[i];
      const status = this.healthStatus.get(model.model);
      
      if (this.config.userPreferences.excludedModels.includes(model.model)) {
        continue;
      }
      
      if (status && !status.healthy && status.consecutiveFailures >= this.config.healthCheck.failureThreshold) {
        continue;
      }
      
      return model;
    }
    return null;
  }

  /**
   * Determine action based on error
   */
  determineAction(error: { code?: number; message?: string }): { action: string; waitSeconds?: number; maxRetries?: number } {
    // Check code-based triggers
    if (error.code) {
      const codeTrigger = this.config.fallbackTriggers.find(t => t.code === error.code);
      if (codeTrigger) {
        return {
          action: codeTrigger.action,
          waitSeconds: codeTrigger.waitSeconds,
          maxRetries: codeTrigger.maxRetries
        };
      }
    }

    // Check message-based triggers
    if (error.message) {
      const messageTrigger = this.config.fallbackTriggers.find(t => 
        t.messageContains && error.message?.toLowerCase().includes(t.messageContains.toLowerCase())
      );
      if (messageTrigger) {
        return {
          action: messageTrigger.action,
          waitSeconds: messageTrigger.waitSeconds,
          maxRetries: messageTrigger.maxRetries
        };
      }
    }

    // Default: switch immediately
    return { action: 'switch_immediately' };
  }

  /**
   * Execute fallback to next available model
   */
  async executeFallback(reason: string): Promise<{ success: boolean; newModel: ModelConfig | null; notification?: string }> {
    const currentModel = this.getCurrentModel();
    const nextModel = this.getNextModel();

    if (!nextModel) {
      console.error('[FallbackManager] No more models in fallback chain');
      return { success: false, newModel: null };
    }

    // Record the switch
    this.state.currentModelIndex = this.config.fallbackChain.findIndex(m => m.model === nextModel.model);
    this.state.switchCount++;
    this.state.switchHistory.push({
      from: currentModel?.model || 'unknown',
      to: nextModel.model,
      reason,
      timestamp: new Date()
    });

    // Generate notification
    let notification: string | undefined;
    if (this.config.conversation.notifyOnSwitch) {
      notification = this.config.conversation.notificationTemplate
        .replace('{model}', nextModel.model)
        .replace('{reason}', nextModel.reason);
    }

    console.log(`[FallbackManager] Switched from ${currentModel?.model} to ${nextModel.model} (${reason})`);

    return { success: true, newModel: nextModel, notification };
  }

  /**
   * Update health status for a model
   */
  updateHealth(model: string, success: boolean, error?: string): void {
    const status = this.healthStatus.get(model);
    if (!status) return;

    status.lastChecked = new Date();

    if (success) {
      status.consecutiveFailures = 0;
      status.consecutiveSuccesses++;
      status.lastError = null;
      
      if (status.consecutiveSuccesses >= this.config.healthCheck.recoveryThreshold) {
        status.healthy = true;
      }
    } else {
      status.consecutiveSuccesses = 0;
      status.consecutiveFailures++;
      status.lastError = error || 'Unknown error';
      
      if (status.consecutiveFailures >= this.config.healthCheck.failureThreshold) {
        status.healthy = false;
        console.warn(`[FallbackManager] Model ${model} marked unhealthy after ${status.consecutiveFailures} failures`);
      }
    }

    this.healthStatus.set(model, status);
  }

  /**
   * Mark model as not supporting tools
   */
  markToolUnsupported(model: string): void {
    const status = this.healthStatus.get(model);
    if (status) {
      status.toolSupportVerified = false;
      this.healthStatus.set(model, status);
      console.warn(`[FallbackManager] Model ${model} marked as tool-unsupported`);
    }

    // Update config
    const modelConfig = this.config.fallbackChain.find(m => m.model === model);
    if (modelConfig) {
      modelConfig.toolSupport = 'unsupported';
    }
  }

  /**
   * Get health status for all models
   */
  getHealthStatus(): Map<string, HealthStatus> {
    return new Map(this.healthStatus);
  }

  /**
   * Get current fallback state
   */
  getState(): FallbackState {
    return { ...this.state };
  }

  /**
   * Reset to original model
   */
  resetToPrimary(): void {
    this.state.currentModelIndex = 0;
    this.state.switchCount = 0;
    this.state.switchHistory = [];
    console.log('[FallbackManager] Reset to primary model');
  }

  /**
   * Get available models (not excluded, healthy)
   */
  getAvailableModels(): ModelConfig[] {
    return this.config.fallbackChain.filter(model => {
      const status = this.healthStatus.get(model.model);
      const excluded = this.config.userPreferences.excludedModels.includes(model.model);
      const unhealthy = status && !status.healthy && status.consecutiveFailures >= this.config.healthCheck.failureThreshold;
      return !excluded && !unhealthy;
    });
  }

  /**
   * Save current configuration
   */
  saveConfig(): void {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      console.log('[FallbackManager] Configuration saved');
    } catch (error) {
      console.error('[FallbackManager] Failed to save config:', error);
    }
  }
}

// Export singleton instance
export const fallbackManager = new ModelFallbackManager();

// Default export
export default ModelFallbackManager;
