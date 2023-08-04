const { connect, ping, sql, after, ...database } = require("./src/mysql");

const utils = require("./src/utils");
const config = require("./config.json");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

const corsOptions = {
  origin: [
    config.production ? "http://189.127.165.179:5173" : "http://localhost:5173",
  ], // Não remova esse IP, pois caso o faça, seu servidor ficará vulnerável a solicitações.
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

async function start() {
  console.log("Conectando no banco de dados...");

  let error = undefined;
  while ((error = await connect())) {
    console.error("Falha ao conectar no banco de dados, tentando novamente...");
    utils.printError(error);
  }

  setInterval(
    () =>
      ping((err) => {
        if (err) {
          connect().then((err) =>
            console.log(
              err ? "Falha ao reconectar..." : "Conexão estabelecida novamente!"
            )
          );
        }
      }),
    10000
  );
}

const orgRouter = require("./src/routes/Organization");
const { columns, base_creative } = require("./src/config");

app.use("/org", orgRouter);

// Natives
app.get("/connection", (req, res) => {
  res.json({
    connection: true,
  });
});

app.get("/getToken", (req, res) => {
  res.json({ token: config.token });
});

start().catch(utils.printError);

app.listen(port, "0.0.0.0", () => {
  console.log(`[REDSTORE-ORGANIZATION] iniciado na porta ${port}`);
});
