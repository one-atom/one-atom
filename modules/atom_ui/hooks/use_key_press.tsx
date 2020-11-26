import { useState, useEffect } from 'react';

export function useKeyPress(targetKey: string): boolean {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  function handle_key_down({ key }: KeyboardEvent): void {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // If released key is our target key then set to false
  function handle_key_up({ key }: KeyboardEvent): void {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  }

  // Add event listeners
  useEffect(() => {
    addEventListener('keydown', handle_key_down);
    addEventListener('keyup', handle_key_up);

    // Remove event listeners on cleanup
    return () => {
      removeEventListener('keydown', handle_key_down);
      removeEventListener('keyup', handle_key_up);
    };
  }); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}
