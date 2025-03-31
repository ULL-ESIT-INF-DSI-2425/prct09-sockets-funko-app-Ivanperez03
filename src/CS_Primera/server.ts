import net from 'net';
import { FunkoFunctions } from '../structure/funkoFunctions.js';
import { RequestType, ResponseType } from './types.js';
import { Funko } from '../structure/funkoElements.js';

net.createServer((connection) => {
  console.log('Cliente conectado.');
  let wholeData = '';
  connection.on('data', (data) => {
    wholeData += data.toString(); 
    let messageLimit = wholeData.indexOf('\n');
    while (messageLimit !== -1) {
      const message = wholeData.substring(0, messageLimit);
      wholeData = wholeData.substring(messageLimit + 1);

      let request: RequestType;
      try {
        request = JSON.parse(message);
        console.log('Petición recibida:', request);

        const collection = new FunkoFunctions(request.user);

        switch (request.type) {
          case 'add':
            if (request.funkoPop && request.funkoPop.length > 0) {
              collection.addFunko(request.funkoPop[0], (success: boolean) => {
                const response: ResponseType = success
                  ? { type: 'add', success: true, funkoPops: [request.funkoPop?.[0] as Funko] }
                  : { type: 'add', success: false };
                connection.write(JSON.stringify(response) + '\n');
                connection.end();
              });
            }
            break;

          case 'update':
            if (request.funkoPop && request.funkoPop.length > 0) {
              collection.updateFunko(request.funkoPop[0], (success: boolean) => {
                const response: ResponseType = success
                  ? { type: 'update', success: true, funkoPops: [request.funkoPop?.[0] as Funko] }
                  : { type: 'update', success: false };
                connection.write(JSON.stringify(response) + '\n');
                connection.end();
              });
            }
            break;

          case 'list':
            collection.listFunkos((funkos: any[]) => {
              const response: ResponseType = {
                type: 'list',
                success: true,
                funkoPops: funkos,
              };
              connection.write(JSON.stringify(response) + '\n');
              connection.end();
            });
            break;

          case 'read':
            if (request.funkoPop && request.funkoPop[0].id) {
              collection.getFunko(request.funkoPop[0].id, (funko: any) => {
                const response: ResponseType = funko
                  ? { type: 'read', success: true, funkoPops: [funko] }
                  : { type: 'read', success: false };
                connection.write(JSON.stringify(response) + '\n');
                connection.end();
              });
            }
            break;

          case 'remove':
            if (request.funkoPop && request.funkoPop[0].id) {
              collection.removeFunko(request.funkoPop[0].id, (success: boolean) => {
                const response: ResponseType = success
                  ? { type: 'remove', success: true }
                  : { type: 'remove', success: false };
                connection.write(JSON.stringify(response) + '\n');
                connection.end();
              });
            }
            break;

          default:
            const errorResponse: ResponseType = {
              type: request.type || 'add',
              success: false,
            };
            connection.write(JSON.stringify(errorResponse) + '\n');
            connection.end();
            break;
        }
      } catch (err) {
        const errorResponse: ResponseType = {
          type: 'add',  // Valor por defecto en caso de error inesperado
          success: false,
        };
        connection.write(JSON.stringify(errorResponse) + '\n');
        connection.end();
      }

      messageLimit = wholeData.indexOf('\n');
    }
  });

  connection.on('end', () => {
    console.log('Conexión cerrada por el cliente.');
  });

}).listen(60300, () => {
  console.log('Servidor escuchando en el puerto 60300');
});
