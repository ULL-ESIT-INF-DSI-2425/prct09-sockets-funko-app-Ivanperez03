	import net from 'net';
	import readline from 'readline';

	const client = net.connect({ port: 60300 }, () => {
		console.log('Conectado al chat');
	});

	const entrada = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	entrada.on('line', (input) => {
		if (input) {
			client.write(input + '\n');
		}
	});

	client.on('data', (data) => {
		console.log(data.toString());
	});

	client.on('end', () => {
		console.log('Desconectado del servidor de chat.');
		entrada.close();
	});
