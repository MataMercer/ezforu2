import fs from "fs/promises";
import getAccessToken from "./Authentication.js";
import clipCoupons from "./Coupons.js";
import log from "./Logger.js";
import config from "./config.json" assert { type: "json" };
import {
  sendEmail,
  getEmailContentFailure,
  getEmailContentSuccess,
} from "./Email.js";

async function main() {
  log.info("Starting ezforu2...");
  const accounts = config.accounts;
  const clipAccountPromises = accounts.map(
    async ({ loginData, storeId, emailRecipient }) => {
      const { email, password } = loginData;
      try {
        const accessToken = await getAccessToken(email, password);
        const formattedCoupons = await clipCoupons(accessToken, storeId);
        sendEmail(
          emailRecipient || email,
          getEmailContentSuccess(formattedCoupons)
        );
      } catch (error) {
        sendEmail(emailRecipient || email, getEmailContentFailure(error));
        throw error;
      }
    }
  );
  await Promise.all(clipAccountPromises);
  log.info("ezforu2 finished.");
}

main();
