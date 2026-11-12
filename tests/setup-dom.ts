import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// O jsdom não tem pointer capture, que o swipe do Toast do Radix usa no pointerdown.
for (const method of ['hasPointerCapture', 'setPointerCapture', 'releasePointerCapture'] as const) {
  if (!(method in Element.prototype)) {
    Object.defineProperty(Element.prototype, method, {
      configurable: true,
      value: method === 'hasPointerCapture' ? () => false : () => {},
    });
  }
}

afterEach(() => {
  cleanup();
});
