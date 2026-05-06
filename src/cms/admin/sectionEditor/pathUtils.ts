/**
 * Get/set a value at a dot-notation path in a nested object.
 * Used by the section editor to update arbitrary fields inside the
 * section's data object.
 */

export function getAtPath(obj: unknown, path: string): unknown {
  if (!path) return obj;
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function setAtPath<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown,
): T {
  if (!path) return value as T;
  const parts = path.split('.');
  const next: Record<string, unknown> = { ...obj };
  let cursor: Record<string, unknown> = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const existing = cursor[key];
    cursor[key] = existing && typeof existing === 'object' && !Array.isArray(existing)
      ? { ...(existing as Record<string, unknown>) }
      : {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
  return next as T;
}
