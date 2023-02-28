const { Router } = require("express");

const {
  postDog,
  getDog,
  getRaza,
  patchDog,
  deleteDog,
} = require("../handlers");

const router = Router();
//ruta lista GET dogs/ __ dogs?name=
router.get("/", getDog);

router.get("/:dogId", getRaza);

router.post("/", postDog);

router.patch("/:dogId", patchDog);

router.delete("/:dogId", deleteDog);

module.exports = router;
