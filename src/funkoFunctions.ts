import fs from 'fs';
import { Funko } from './funkoElements.js';

export class FunkoFunctions {
  /**
   * @param user - usuario del funko
   */
  constructor(private user: string) {}

  private getUserPath(): string {
    return process.cwd() + '/usuarios/' + this.user;
  }

  private getFunkoPath(id: number): string {
    return this.getUserPath() + '/' + id + '.json';
  }

  private checkUserDir(callback: () => void): void {
    const userPath = this.getUserPath();
    fs.mkdir(userPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error al crear el directorio:", err);
        return;
      }
      callback();
    });
  }
  
  addFunko(funko: Funko, callback: (success: boolean) => void): void {
    this.checkUserDir(() => {
      const funkoPath = this.getFunkoPath(funko.id);
      fs.access(funkoPath, (err) => {
        if (!err) {
          return callback(false);
        }
        fs.writeFile(funkoPath, JSON.stringify(funko, null, 2), (err) => {
          if (err) return callback(false);
          return callback(true);
        });
      });
    });
  }
  
  updateFunko(funko: Funko, callback: (success: boolean) => void): void {
    this.checkUserDir(() => {
      const funkoPath = this.getFunkoPath(funko.id);
      fs.access(funkoPath, (err) => {
        if (err) {
          return callback(false);
        }
        fs.writeFile(funkoPath, JSON.stringify(funko, null, 2), (err) => {
          if (err) return callback(false);
          return callback(true);
        });
      });
    });
  }
  
  removeFunko(id: number, callback: (success: boolean) => void): void {
    this.checkUserDir(() => {
      const funkoPath = this.getFunkoPath(id);
      fs.access(funkoPath, (err) => {
        if (err) {
          return callback(false);
        }
        fs.unlink(funkoPath, (err) => {
          if (err) return callback(false);
          return callback(true);
        });
      });
    });
  }
  
  listFunkos(callback: (funkos: Funko[]) => void): void {
    this.checkUserDir(() => {
      const userPath = this.getUserPath();
      fs.readdir(userPath, (err, files) => {
        if (err) return callback([]);
        const funkos: Funko[] = [];
        let pending = files.length;
        if (pending === 0) return callback(funkos);
        files.forEach((file) => {
          const funkoPath = `${userPath}/${file}`;
          fs.readFile(funkoPath, 'utf-8', (err, content) => {
            if (!err) {
              try {
                const obj = JSON.parse(content);
                funkos.push(new Funko(
                  obj.id, obj.name, obj.description, obj.type,
                  obj.genre, obj.franchise, obj.number,
                  obj.exclusive, obj.specialFeatures, obj.marketValue
                ));
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            }
            if (--pending === 0) callback(funkos);
          });
        });
      });
    });
  }
  
  getFunko(id: number, callback: (funko: Funko | undefined) => void): void {
    this.checkUserDir(() => {
      const funkoPath = this.getFunkoPath(id);
      fs.readFile(funkoPath, 'utf-8', (err, content) => {
        if (err) return callback(undefined);
        try {
          const obj = JSON.parse(content);
          return callback(new Funko(
            obj.id, obj.name, obj.description, obj.type,
            obj.genre, obj.franchise, obj.number,
            obj.exclusive, obj.specialFeatures, obj.marketValue
          ));
        } catch (error) {
          console.error("Error parsing JSON:", error);
          return callback(undefined);
        }
      });
    });
  }  
}
