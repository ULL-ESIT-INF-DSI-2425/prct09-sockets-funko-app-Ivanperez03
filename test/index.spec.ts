import { describe, test, expect } from 'vitest';
import { testss } from '../src/index.js';

describe('testss function', () => {
  test('debe devolver el nombre pasado como argumento', () => {
    const nombre = 'Juan';
    const resultado = testss(nombre);
    expect(resultado).toBe(nombre);
  });
});