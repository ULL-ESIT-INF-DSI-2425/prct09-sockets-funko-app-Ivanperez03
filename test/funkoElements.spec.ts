import { describe, test, expect } from 'vitest';
import { Funko } from '../src/funkoElements.js';

describe('Funko class', () => {
  test('should create a Funko object correctly', () => {
    const funko = new Funko(1, 'Sonic', 'Fastest', 'Pop!', 'Videojuegos', 'Sonic', 22, true, 'HeadBoing', 100);
    expect(funko.id).toBe(1);
    expect(funko.name).toBe('Sonic');
    expect(funko.type).toBe('Pop!');
    expect(funko.genre).toBe('Videojuegos');
    expect(funko.franchise).toBe('Sonic');
    expect(funko.exclusive).toBeTruthy();
    expect(funko.specialFeatures).toBe('HeadBoing');
    expect(funko.marketValue).toBeGreaterThan(0);
  });
});
