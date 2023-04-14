import fs from "fs/promises";
import getAccessToken from "./Authentication.js";
import clipCoupons from "./Coupons.js";
import log from "./Logger.js";
import config from "./config.json" assert { type: "json" };

async function main() {
  log.info("Starting ezforu2...");
  const accounts = config.accounts;
  const clipAccountPromises = accounts.map(async ({ loginData, storeId }) => {
    const { email, password } = loginData;
    const accessToken = await getAccessToken(email, password);
    await clipCoupons(accessToken, storeId);
  });
  await Promise.all(clipAccountPromises);
  log.info("ezforu2 finished.");
}

main();
