import fs from 'fs';
import https from 'https';
import next from 'next';

const app = next({ dev: true, hostname: 'shopcode.localtest.com', port: 3001 });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    https
        .createServer(
            {
                // the certificates are generated on the same directory where you run mkcert
                key: fs.readFileSync('./certs/_wildcard.localtest.com-key.pem'),
                cert: fs.readFileSync('./certs/_wildcard.localtest.com.pem'),
            },
            (req, res) => handle(req, res),
        )
        .listen(3001, () => console.log('https://shopcode.localtest.com:3001'));
});
