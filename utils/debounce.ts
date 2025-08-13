// Utility function for debouncing frequent updates
/**
 * Create a debounced wrapper around a function.
 * The function will execute after `wait` ms have elapsed since the last call.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Specialized debounce for layer updates
/**
 * Debouncer keyed by layerId to coalesce frequent updates per text layer.
 */
export function createLayerUpdateDebouncer() {
  const debouncedUpdates = new Map<string, NodeJS.Timeout>();
  
  return function debounceLayerUpdate(
    layerId: string,
    updateFn: () => void,
    delay: number = 100
  ) {
    // Clear existing timeout for this layer
    const existingTimeout = debouncedUpdates.get(layerId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Set new timeout
    const newTimeout = setTimeout(() => {
      updateFn();
      debouncedUpdates.delete(layerId);
    }, delay);
    
    debouncedUpdates.set(layerId, newTimeout);
  };
}
