import getAccessToken from "./Authentication.js";
import clipCoupons from "./Coupons.js";
import log from "./Logger.js";
import config from "./Config.js";
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
        if (!accessToken) {
          throw new Error("Could not get access token")
        }
        const formattedCoupons = await clipCoupons(accessToken, storeId);
        sendEmail(
          emailRecipient || email,
          getEmailContentSuccess(formattedCoupons)
        );
      } catch (error) {
        log.error(error)
        sendEmail(emailRecipient || email, getEmailContentFailure(error));
      }
    }
  );
  await Promise.all(clipAccountPromises);
  log.info("ezforu2 finished.");
}

main();
