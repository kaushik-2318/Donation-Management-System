const express = require("express");
const router = express.Router();
const { getNGOs, getTrengingNGOs, getNGOById } = require("../controllers/ngoController");

router.get("/", getNGOs);
router.get("/trending", getTrengingNGOs);
router.get("/:id", getNGOById);

module.exports = router;
