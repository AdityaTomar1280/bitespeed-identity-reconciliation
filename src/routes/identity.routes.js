const { Router } = require("express");
const identityController = require("../controllers/identity.controller");

const router = Router();

router.post("/identify", identityController.identify);

module.exports = router;
