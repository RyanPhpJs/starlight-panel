const Server = require("./src/structures/server");

const app = new Server();
app.static();

app.middlewares();
app.basic();
app.routes();
app.listen();
