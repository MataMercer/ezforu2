import config from "./Config.js";
import { connect } from 'puppeteer-real-browser'
import log from "./Logger.js";

async function getSessionToken(email, password) {
  try {
    const signInResponse = await fetch(
      "https://albertsons.okta.com/api/v1/authn",
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9,es-419;q=0.8,es;q=0.7",
          "cache-control": "no-cache",
          "content-type": "application/json",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "x-okta-user-agent-extended": "okta-auth-js-1.15.0",
          "x-requested-with": "XMLHttpRequest",
          cookie: "DT=DI0GH5xKNShSbqI5AgTpiEoUA",
          Referer: "https://www.vons.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `{"username":"${email}","password":"${password}"}`,
        method: "POST",
      }
    );
    log.info(
      `Sign In Response: ${signInResponse.status} ${signInResponse.statusText}`
    );
    const signInResponseJson = await signInResponse.json();
    return signInResponseJson.sessionToken;
  } catch (error) {
    log.error(error);
    throw new Error("Error getting session token");
  }
}

async function getAccessTokenFromSession(sessionToken) {
  const params = {
    client_id: "0oap6ku01XJqIRdl42p6",
    redirect_uri: "https://www.vons.com/bin/safeway/unified/sso/authorize",
    response_type: "code",
    response_mode: "query",
    state: "mucho-religion-hermon-girish",
    nonce: "UXjlnZSbw9JhbLc5uy3A9KieH8USBOL58UlJzaAKIMQjyx48nWrK7TOnRl1C2q8e",
    prompt: "none",
    sessionToken: sessionToken,
    scope: "openid profile email offline_access used_credentials",
  };
  return (
    "https://albertsons.okta.com/oauth2/ausp6soxrIyPrm8rS2p6/v1/authorize?" +
    new URLSearchParams(params)
  );
}

function getAccessTokenFromCookies(cookies) {
  try {
    const accessTokenCookie = cookies.find(
      (cookie) => cookie.name === "SWY_SHARED_SESSION"
    );
    const decryptedCookieString = decodeURIComponent(accessTokenCookie.value);
    const accessToken = JSON.parse(decryptedCookieString).accessToken;
    log.info(`Access token obtained from cookies.`);
    return accessToken;
  } catch (error) {
    log.error(error);
    throw new Error("Access token not found in cookies.");
  }
}

export default async function getAccessToken(email, password){
  log.info("Connecting to headless browser...")
  const response = await connect({
    headless: 'auto',
    args: [],
    fingerprint: false,
    customConfig:{
    executablePath: "/usr/bin/chromium-browser",
    }
  })
  const {browser, page} = response;
  log.info("Browser connection succeeded.")

  const sessionToken = await getSessionToken(email, password);

const params = {
    client_id: "0oap6ku01XJqIRdl42p6",
    redirect_uri: "https://www.vons.com/bin/safeway/unified/sso/authorize",
    response_type: "code",
    response_mode: "query",
    state: "mucho-religion-hermon-girish",
    nonce: "UXjlnZSbw9JhbLc5uy3A9KieH8USBOL58UlJzaAKIMQjyx48nWrK7TOnRl1C2q8e",
    prompt: "none",
    sessionToken: sessionToken,
    scope: "openid profile email offline_access used_credentials",
  };
  const accessTokenUrl = "https://albertsons.okta.com/oauth2/ausp6soxrIyPrm8rS2p6/v1/authorize?" + new URLSearchParams(params)
  page.goto(accessTokenUrl)


  //wait for page to load with cookies.
  await new Promise((r) => setTimeout(r, 10000));
  const cookies = await page.cookies()
  const accessToken = getAccessTokenFromCookies(cookies);
  log.info("Access token obtained.")
  await browser.close();
  log.info("Browser closed.")
  return accessToken

}