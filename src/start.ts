import { runServer } from './app';
import { connect } from './config/typeorm';


async function main() {
    connect();
    const port: number = 4000;
    const app = await runServer();
    app.listen(port);

    console.log("estoy escuchando en => ", port);
}

main();
//console.log("hola");