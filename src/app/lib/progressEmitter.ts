// Real-time progress event emitter for web search
export interface ProgressEvent {
  type: 'log' | 'result' | 'complete' | 'error' | 'sources';
  message: string;
  data?: Record<string, unknown> | Record<string, unknown>[] | string | null;
  timestamp: number;
}

export class ProgressEventEmitter {
  private listeners: ((event: ProgressEvent) => void)[] = [];
  private isEnabled = false;

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
    this.listeners = [];
  }

  public subscribe(listener: (event: ProgressEvent) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public emit(event: ProgressEvent): void {
    if (!this.isEnabled) return;
    
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Progress event listener error:', error);
      }
    });
  }

  public emitLog(message: string, data?: Record<string, unknown> | string): void {
    this.emit({
      type: 'log',
      message,
      data,
      timestamp: Date.now()
    });
  }

  public emitResult(message: string, data?: Record<string, unknown> | string): void {
    this.emit({
      type: 'result',
      message,
      data,
      timestamp: Date.now()
    });
  }

  public emitComplete(message: string = 'Process completed'): void {
    this.emit({
      type: 'complete',
      message,
      timestamp: Date.now()
    });
  }

  public emitError(message: string, error?: Record<string, unknown> | string): void {
    this.emit({
      type: 'error',
      message,
      data: error,
      timestamp: Date.now()
    });
  }

  public emitSources(sources: Record<string, unknown>[]): void {
    this.emit({
      type: 'sources',
      message: `Found ${sources.length} sources`,
      data: sources,
      timestamp: Date.now()
    });
  }
}

// Global progress emitter instance
export const progressEmitter = new ProgressEventEmitter();
