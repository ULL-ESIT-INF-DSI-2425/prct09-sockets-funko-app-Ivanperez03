import net from 'net';

const clients: net.Socket[] = [];

net.createServer((connection) => {
  clients.push(connection);
  console.log(`Usuario conectado`); 
  let wholeData = ''; 
  connection.on('data', (data) => {
    wholeData += data.toString(); 
    let messageLimit = wholeData.indexOf('\n');
    while (messageLimit !== -1) {
      const message = wholeData.substring(0, messageLimit);
      wholeData = wholeData.substring(messageLimit + 1);
      for (const client of clients) {
        let number = clients.indexOf(client); 
        if (client !== connection) {
          client.write(`Usuario ${number}: ${message}\n`);
        }
      }
      messageLimit = wholeData.indexOf('\n');
    }
  });
  connection.on('close', () => {
    let number_ = clients.indexOf(connection); 
    console.log(`Usuario ${number_} desconectado`);
  });
}).listen(60300, () => {
  console.log('Servidor escuchando en el puerto 60300');
});  