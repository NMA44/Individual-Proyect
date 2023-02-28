const { Router } = require("express");

const { getTemperaments } = require("../handlers");

const router = Router();
// ruta que toma temperamentos y almacena en DB
router.get("/", getTemperaments);

module.exports = router;
