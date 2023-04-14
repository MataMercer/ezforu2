import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import Captcha from "2captcha";
import config from "./config.json" assert { type: "json" };
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

async function getCaptchaPageUrl(sessionToken) {
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

async function getCaptchaSolution(pageUrl) {
  try {
    //found by inspecting recaptcha in the HTML page for 'sitekey'.
    const captchaSiteKey = "6Ld38BkUAAAAAPATwit3FXvga1PI6iVTb6zgXw62";
    const solver = new Captcha.Solver(config._2CaptchaApiKey);
    const solverResponse = await solver.recaptcha(captchaSiteKey, pageUrl);
    const captchaSolution = solverResponse.data.replace(/['"]+/g, "");
    log.info(
      `2Captcha Done: ${solverResponse.status} ${solverResponse.statusText}`
    );
    return captchaSolution;
  } catch (error) {
    log.error(error);
    throw new Error("Error getting captcha solution");
  }
}

export default async function getAccessToken(email, password) {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: false,
    slowMo: 10,
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920 + Math.floor(Math.random() * 100),
    height: 1080 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });
  await page.setJavaScriptEnabled(true);
  await page.setDefaultNavigationTimeout(0);

  const sessionToken = await getSessionToken(email, password);
  const captchaPageUrl = await getCaptchaPageUrl(sessionToken);
  await page.goto(captchaPageUrl);

  const captchaSolution = await getCaptchaSolution(page.url());

  await new Promise((r) => setTimeout(r, 2000));
  const frame = await page.$("#main-iframe");
  const frame1stContentFrame = await frame.contentFrame();

  await frame1stContentFrame.$eval(
    "#g-recaptcha-response",
    (el, solution) => (el.innerText = solution),
    captchaSolution
  );

  await new Promise((r) => setTimeout(r, 2000));

  await frame1stContentFrame.evaluate((captchaSolution) => {
    try {
      window.onCaptchaFinished(captchaSolution);
    } catch (error) {
      log.error(error);
      throw new Error("Error submitting captcha solution");
    }
  }, captchaSolution);

  await page.waitForNavigation();
  const cookies = await page.cookies();
  const accessToken = getAccessTokenFromCookies(cookies);
  await browser.close();
  return accessToken;
}
