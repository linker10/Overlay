import { TextElement } from "@/types/index.type";

// Maximum number of history items to store (including initial state)
const MAX_HISTORY_LENGTH = 20;

/**
 * Utility class to manage the history of text layer states.
 *
 * Stores snapshots of the full `TextElement[]` to support undo/redo and
 * initialization to an empty state. Keeps a fixed-size history to limit memory.
 */
export class HistoryManager {
  // The changes will be done on the text layers. So, to manage the history, we just need to store the text layers states at a given point in time.
  private history: TextElement[][] = []; // Start with empty history
  // The current index of the history. What's the current state of the text layers?
  private currentIndex: number = -1; // -1 means no history yet
  // Flag to track if we have an initial state
  private hasInitialState: boolean = false;

  /**
   * Initialize the history with an initial state
   * This should be called when the app loads with empty layers
   * @param initialTextLayers The initial text layers state (usually empty array)
   */
  initialize(initialTextLayers: TextElement[] = []) {
    if (!this.hasInitialState) {
      this.history = [initialTextLayers];
      this.hasInitialState = true;
      this.currentIndex = 0;
    }
  }

  /**
   * Add a new state to the history
   * @param textLayers The text layers state to add
   */
  add(textLayers: TextElement[]) {
    // If we don't have an initial state yet, create one with empty array
    if (!this.hasInitialState) {
      this.initialize([]);
    }

    // Add the new state
    this.history.push(textLayers);
    this.currentIndex = this.history.length - 1;

    // Ensure we don't exceed the maximum history length
    // When we exceed, remove the oldest non-initial state
    if (this.history.length > MAX_HISTORY_LENGTH) {
      // Remove from index 1 (oldest non-initial state), not 0 (initial state)
      this.history.splice(1, 1);
      this.currentIndex = Math.max(0, this.currentIndex - 1);
    }
  }

  /**
   * Undo the last change
   * @returns The previous state or undefined if undo is not possible
   */
  undo() {
    if (this.isUndoDisabled()) {
      return undefined;
    }

    this.currentIndex--;
    return this.history[this.currentIndex];
  }

  /**
   * Redo the last change
   * @returns The next state or undefined if redo is not possible
   */
  redo() {
    if (this.isRedoDisabled()) {
      return undefined;
    }

    this.currentIndex++;
    return this.history[this.currentIndex];
  }

  /**
   * Get the current index of the history
   * @returns The current index (0-based, where 0 is the initial state)
   */
  getCurrentIndex() {
    return Math.max(0, this.currentIndex);
  }

  /**
   * Get the length of the history
   * @returns The total number of history states
   */
  getHistoryLength() {
    return this.history.length;
  }

  /**
   * Check if undo is disabled
   * @returns True if undo is not possible
   */
  isUndoDisabled() {
    return this.currentIndex <= 0;
  }

  /**
   * Check if redo is disabled
   * @returns True if redo is not possible
   */
  isRedoDisabled() {
    return this.currentIndex >= this.history.length - 1;
  }

  /**
   * Check if we're at the initial state
   * @returns True if we're at the initial empty state
   */
  isAtInitialState() {
    return this.currentIndex === 0;
  }

  /**
   * Get the initial state
   * @returns The initial state (empty array)
   */
  getInitialState() {
    return this.history[0] || [];
  }

  /**
   * Clear all history except the initial state
   */
  clearHistory() {
    if (this.hasInitialState) {
      this.history = [this.history[0]];
      this.currentIndex = 0;
    } else {
      this.history = [];
      this.currentIndex = -1;
    }
  }

  /**
   * Reset to initial state
   * @returns The initial state
   */
  resetToInitial() {
    if (this.hasInitialState) {
      this.currentIndex = 0;
      return this.history[0];
    }
    return [];
  }

  /**
   * Get the maximum number of history items allowed
   * @returns The MAX_HISTORY_LENGTH constant
   */
  getMaxHistoryLength() {
    return MAX_HISTORY_LENGTH;
  }
}
