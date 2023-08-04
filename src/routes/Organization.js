const express = require("express");
const router = express.Router();
const vrp = require("../vrp");
const { sql } = require("../mysql");
const {
  tables,
  base_creative,
  notify,
  columns,
  actives,
  framework_network,
} = require("../config");
const { lua } = require("../lua");
const creative = require("../creative");

function getMoneyUser(id, callback) {
  if (base_creative && framework_network) {
    emit("getMoney_network", id, callback);
  } else if (base_creative) {
    emit("getMoney_summerz", id, callback);
  } else {
    emit("getMoney", id, callback);
  }
}

function updateMoneyUser(id, wallet, bank, callback) {
  if (base_creative && framework_network) {
    emit("updadeVidaJogador_network", id, wallet, bank, callback);
  } else if (base_creative) {
    emit("updadeVidaJogador_summerz", id, wallet, bank, callback);
  } else {
    emit("updateMoney", id, wallet, bank, callback);
  }
}

function messageSuccess(id, message) {
  if (base_creative && framework_network) {
    emit(
      "emitirNotifyNetwork",
      id,
      notify.success,
      message,
      true,
      notify.use_source,
      notify.time
    );
  } else if (base_creative) {
    emit(
      "emitirNotifySummerz",
      id,
      notify.success,
      message,
      true,
      notify.use_source,
      notify.time
    );
  } else {
    emit(
      "emitirNotify",
      id,
      notify.success,
      message,
      true,
      notify.use_source,
      notify.time
    );
  }
}

function messageFail(id, message) {
  new Promise(() => {
    emit("emitirNotify", id, notify.negado, message, false);
  });
}

router.post("/create/:id", async (req, res) => {
  const { id } = req.params;
  const { money } = req.body;

  if (base_creative) {
    if (await creative.isOnline(id)) {
      const response = await creative.removeBank(id, money);

      if (response) {
        res.status(204).send();
      } else {
        res.status(401).send();
      }
    }
  } else {
    const response = await vrp.removeBank(id, money);
    if (response) {
      res.status(204).send();
    } else {
      res.status(401).send();
    }
  }
});

router.post("/banco", async (req, res) => {
  const { id, value } = req.body;

  if (value > 0) {
    base_creative
      ? await creative.addBank(id, value)
      : await vrp.addBank(id, value);

    messageSuccess(id, `Foi adicionado <b>R$ ${value} </b> na sua conta.`);

    res.json({
      mensagem: "bank Add",
    });
  } else {
    messageFail(id, "A quantidade é inválida.");
    res.status(400).json({
      mensagem: "Not bank Add",
    });
  }
});

router.post("/removeBanco", async (req, res) => {
  const { id, value } = req.body;

  if (value > 0) {
    const response = base_creative
      ? await creative.removeBank(id, value)
      : await vrp.removeBank(id, value);

    if (response) {
      messageFail(
        id,
        `Administração removeu <b>R$ ${value} </b> da sua conta.`
      );
      res.json({
        info: true,
      });
    } else {
      res.json({
        info: false,
      });
    }
  } else {
    messageFail(id, "A quantidade é inválida.");
    res.status(400).json({
      mensagem: "Not bank Add",
    });
  }
});

router.get("/identities/:id", async (req, res) => {
  const { id } = req.params;

  const identities = await sql(
    `SELECT * FROM ${
      base_creative ? tables.characters : "vrp_user_identities"
    } WHERE ${
      base_creative ? columns.campo_identificador_characters : "user_id"
    }=?`,
    [id]
  );

  res.json(...identities);
});

router.get("/getMoney/:id", async (req, res) => {
  const { id } = req.params;

  if (await vrp.isOnline(id)) {
    getMoneyUser(id, (callback) => {
      res.json(callback);
    });
  } else {
    const money = await sql(
      `SELECT * FROM ${
        base_creative ? tables.characters : "vrp_user_moneys"
      } WHERE ${
        base_creative ? columns.campo_identificador_characters : "user_id"
      }=?`,
      [id]
    );

    res.json(...money);
  }
});

module.exports = router;
