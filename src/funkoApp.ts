import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { Funko, FunkoGenre, FunkoType } from './funkoElements.js';
import { FunkoFunctions } from './funkoFunctions.js';

/**
 * Segun su valor de mercado, se imprime de un color u otro
 * @param funko - funko a imprimir la informacion
 */
export function printFunko(funko: Funko) {
  let valueColor = chalk.red;
  if (funko.marketValue > 100) {
    valueColor = chalk.green;
  } else if (funko.marketValue > 50) { 
    valueColor = chalk.yellow;
  } else if (funko.marketValue > 20) {
    valueColor = chalk.blue;
  }

  let output = '';
  output += chalk('----------FUNKO-----------') + '\n';
  output += `ID: ${funko.id}\n`;
  output += `Name: ${funko.name}\n`;
  output += `Description: ${funko.description}\n`;
  output += `Type: ${funko.type}\n`;
  output += `Genre: ${funko.genre}\n`;
  output += `Franchise: ${funko.franchise}\n`;
  output += `Number: ${funko.number}\n`;
  output += `Exclusive: ${funko.exclusive}\n`;
  output += `Special Features: ${funko.specialFeatures}\n`;
  output += `Market Value: ${valueColor(`${funko.marketValue}€`)}\n`;
  output += chalk.bold('------------------------------');
  return output;
}

/**
 * Obtencion de parametros por consola y funcionalidades
 */
yargs(hideBin(process.argv))
  .command('add', 'Add a funko', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
    name: { type: 'string', demandOption: true },
    desc: { type: 'string', demandOption: true },
    type: { type: 'string', demandOption: true },
    genre: { type: 'string', demandOption: true },
    franchise: { type: 'string', demandOption: true },
    number: { type: 'number', demandOption: true },
    exclusive: { type: 'boolean', demandOption: true },
    special: { type: 'string', demandOption: true },
    value: { type: 'number', demandOption: true },
  }, (args) => {
    const funko = new Funko(
      args.id, args.name, args.desc,
      args.type as FunkoType, args.genre as FunkoGenre,
      args.franchise, args.number, args.exclusive,
      args.special, args.value
    );

    const collection = new FunkoFunctions(args.user);
    collection.addFunko(funko, (success) => {
      if (success) {
        console.log(chalk.green(`Funko añadido a la colección de ${args.user}`));
      } else {
        console.log(chalk.red(`Ya existe un Funko con ID ${args.id} en la colección de ${args.user}`));
      }
    });
  })

  .command('update', 'Update a funko', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
    name: { type: 'string', demandOption: true },
    desc: { type: 'string', demandOption: true },
    type: { type: 'string', demandOption: true },
    genre: { type: 'string', demandOption: true },
    franchise: { type: 'string', demandOption: true },
    number: { type: 'number', demandOption: true },
    exclusive: { type: 'boolean', demandOption: true },
    special: { type: 'string', demandOption: true },
    value: { type: 'number', demandOption: true },
  }, (args) => {
    const funko = new Funko(
      args.id, args.name, args.desc,
      args.type as FunkoType, args.genre as FunkoGenre,
      args.franchise, args.number, args.exclusive,
      args.special, args.value
    );

    const collection = new FunkoFunctions(args.user);
    collection.updateFunko(funko, (success) => {
      if (success) {
        console.log(chalk.green(`Funko con ID ${args.id} actualizado`));
      } else {
        console.log(chalk.red(`No se encontró un Funko con ID ${args.id}`));
      }
    });
  })

  .command('remove', 'Remove a funko', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
  }, (args) => {
    const collection = new FunkoFunctions(args.user);
    collection.removeFunko(args.id, (success) => {
      if (success) {
        console.log(chalk.green(`Funko con ID ${args.id} eliminado correctamente`));
      } else {
        console.log(chalk.red(`No se encontró un Funko con ID ${args.id}`));
      }
    });
  })

  .command('read', 'Read a funko', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
  }, (args) => {
    const collection = new FunkoFunctions(args.user);
    collection.getFunko(args.id, (funko) => {
      if (funko) {
        console.log(printFunko(funko));
      } else {
        console.log(chalk.red(`No se encontró el Funko con ID ${args.id}`));
      }
    });
  })

  .command('list', 'List all funkos of a user', {
    user: { type: 'string', demandOption: true },
  }, (args) => {
    const collection = new FunkoFunctions(args.user);
    collection.listFunkos((funkos) => {
      if (funkos.length === 0) {
        console.log(chalk.red(`No se encontraron Funkos en la colección de ${args.user}`));
      } else {
        console.log(chalk.green(`Funkos de ${args.user}:`));
        funkos.forEach(f => console.log(printFunko(f)));
      }
    });
  })

  .help()
  .parse();