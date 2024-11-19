import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/jwt", (req, res) => {
  let header = {
    alg: "ES256",
    typ: "JWT",
    kid: "K57V2P363C",
  };
  let payload = {
    iss: "Y87KYGF75M",
    iat: Date.now() / 1000,
    exp: Date.now() / 1000 + 15778800,
  };

  let cert = fs.readFileSync("./AuthKey_K57V2P363C.p8");
  let token = jwt.sign(payload, cert, { header: header });
  res.json({ token });
});

export default router;
