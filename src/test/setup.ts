import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';


// useWorkspace() caches the workspace across components; drop it between tests so one test's
// mocked workspace never leaks into the next. Imported lazily, after the test file's mocks apply.
afterEach(async () => {
  const { invalidateWorkspace } = await import('@/hooks/useWorkspace');
  invalidateWorkspace();
});
