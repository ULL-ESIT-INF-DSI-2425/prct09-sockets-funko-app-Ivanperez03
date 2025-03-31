/**
 * Tipo de funko
 */
export type FunkoType = 'Pop!' | 'Pop! Rides' | 'Vynil Soda' | 'Vynil Gold';

/**
 * Genero del funko
 */
export type FunkoGenre = 'Animación' | 'Películas y TV' | 'Videojuegos' | 'Deportes' | 'Música' | 'Ánime';

/**
 * Clase que inicializa al objeto Funko
 */
export class Funko {
  /**
   * 
   * @param id - id del funko unico
   * @param name - nombre del funko
   * @param description - descripcion del funko
   * @param type - tipo de funko
   * @param genre - genero del funko
   * @param franchise - franquicia del funko
   * @param number - numero identificativo del funko en la franquicia
   * @param exclusive - si es exclusivo o no
   * @param specialFeatures - caracteristicas especiales
   * @param marketValue - valor de mercado
   */
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public type: FunkoType,
    public genre: FunkoGenre,
    public franchise: string,
    public number: number,
    public exclusive: boolean,
    public specialFeatures: string,
    public marketValue: number
  ) {}
}