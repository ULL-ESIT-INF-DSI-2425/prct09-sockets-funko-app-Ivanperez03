import net from 'net';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { RequestType } from './types.js';
import { Funko, FunkoType, FunkoGenre } from '../structure/funkoElements.js';

const client = net.connect({ port: 60300 });

function sendRequest(request: RequestType) {
  client.write(JSON.stringify(request) + '\n');
}

let wholeData = '';
client.on('data', (data) => {
  wholeData += data;

  let messageLimit = wholeData.indexOf('\n');
  while (messageLimit !== -1) {
    const message = wholeData.substring(0, messageLimit);
    wholeData = wholeData.substring(messageLimit + 1);
    const response = JSON.parse(message);
    if (response.success) {
      console.log(chalk.green(`✅ ${response.message}`));
      if (response.funkoPops) {
        response.funkoPops.forEach((funko: Funko) => {
          console.log(printFunko(funko));
        });
      }
    } else {
      console.log(chalk.red(`❌ ${response.message}`));
    }
    messageLimit = wholeData.indexOf('\n');
  }
  client.end();
});

client.on('error', (err) => {
  console.error(chalk.red('Error en el cliente:', err.message));
});

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
    const funko: Funko = new Funko(
      args.id, args.name, args.desc,
      args.type as FunkoType, args.genre as FunkoGenre,
      args.franchise, args.number, args.exclusive,
      args.special, args.value
    );
    const request: RequestType = { type: 'add', user: args.user, funkoPop: [funko] };
    sendRequest(request);
  })

  .command('list', 'List all funkos of a user', {
    user: { type: 'string', demandOption: true },
  }, (args) => {
    const request: RequestType = { type: 'list', user: args.user };
    sendRequest(request);
  })

  .command('read', 'Read a funko', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
  }, (args) => {
    const request: RequestType = { 
      type: 'read', 
      user: args.user, 
      funkoPop: [{ id: args.id, name: '', description: '', type: 'Pop!', genre: 'Videojuegos', franchise: '', number: 0, exclusive: false, specialFeatures: '', marketValue: 0 }] 
    };
    sendRequest(request);
  })
  
  .command('remove', 'Remove a funko', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
  }, (args) => {
    const request: RequestType = { 
      type: 'remove', 
      user: args.user, 
      funkoPop: [{ id: args.id, name: '', description: '', type: 'Pop!', genre: 'Videojuegos', franchise: '', number: 0, exclusive: false, specialFeatures: '', marketValue: 0 }] 
    };
    sendRequest(request);
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
    const funko: Funko = new Funko(
      args.id, args.name, args.desc,
      args.type as FunkoType, args.genre as FunkoGenre,
      args.franchise, args.number, args.exclusive,
      args.special, args.value
    );
    const request: RequestType = { type: 'update', user: args.user, funkoPop: [funko] };
    sendRequest(request);
  })

  .help()
  .parse();
