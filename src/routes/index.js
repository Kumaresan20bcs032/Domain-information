const express = require("express");
const router = express.Router();

const dnsLookUp = require("../controllers/dnsLookup");
const hostDetails = require("../controllers/getHostSSLDetails");

router.get("/dns-lookup", dnsLookUp.lookup);
router.get("/host-ssl-information", hostDetails.details);

module.exports = router;