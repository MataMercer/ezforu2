import fs from "fs/promises";
import getAccessToken from "./Authentication.js";
import clipCoupons from "./Coupons.js";
import log from "./Logger.js";
import config from "./config.json" assert { type: "json" };

async function main() {
  log.info("Starting ezforu2...");
  const accounts = config.accounts;
  accounts.forEach(({ loginData, storeId }) => {
    const { email, password } = loginData;
    getAccessToken(email, password).then((accessToken) => {
      clipCoupons(accessToken, storeId);
    });
  });
  // log.info("ezforu2 finished.");
}

main();
