import log from "./Logger.js";

async function getAllCoupons(accessToken, storeId) {
  const headers = {
    authority: "www.vons.com",
    "sec-ch-ua":
      '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
    "x-swy_version": "1.1",
    dnt: "1",
    "x-swy_banner": "vons",
    "x-swy-application-type": "web",
    "sec-ch-ua-mobile": "?0",
    authorization: `Bearer ${accessToken}`,
    "content-type": "application/vnd.safeway.v2+json",
    accept: "application/json",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
    "x-swy_api_key": "emjou",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    referer: "https://www.vons.com/justforu/coupons-deals.html",
    "accept-language": "en-US,en;q=0.9,es-419;q=0.8,es;q=0.7",
  };

  const params = {
    storeId,
    rand: "589376",
  };

  try {
    const allCouponsResponse = await fetch(
      `https://www.vons.com/abs/pub/xapi/offers/companiongalleryoffer?${new URLSearchParams(
        params
      )}`,
      {
        headers,
        method: "GET",
      }
    );
    log.info(
      `All Coupons Fetched: ${allCouponsResponse.status} ${allCouponsResponse.statusText}`
    );
    const allCoupons = await allCouponsResponse.json();
    return allCoupons.companionGalleryOffer;
  } catch (error) {
    log.error(error);
    throw new Error("Error fetching all coupons");
  }
}

function checkCouponClipped(coupon) {
  return coupon.status === "C";
}

export default async function clipCoupons(accessToken, storeId) {
  async function clipCoupon(accessToken, couponId, storeId, couponType) {
    await new Promise((r) => setTimeout(r, 1000));
    const headers = {
      accept: "application/json, text/plain, */*",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      "sec-ch-ua":
        '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-swy_banner": "vons",
      swy_sso_token: accessToken,
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
      referer:
        "https://www.vons.com/justforu/coupons-deals.html?r=https%3A%2F%2Fwww.vons.com%2Fjustforu%2Fcoupons-deals.html",
      "accept-language": "en-US,en;q=0.9,es-419;q=0.8,es;q=0.7",
    };

    const params = {
      storeId,
    };

    const json_data = {
      items: [
        {
          clipType: "C",
          itemId: couponId,
          itemType: couponType,
        },
        {
          clipType: "L",
          itemId: couponId,
          itemType: couponType,
        },
      ],
    };
    try {
      const couponClipResponse = await fetch(
        `https://www.vons.com/abs/pub/web/j4u/api/offers/clip?${new URLSearchParams(
          params
        )}`,
        {
          headers,
          body: JSON.stringify(json_data),
          method: "POST",
        }
      );
      console.log(couponClipResponse.status);
      console.log("Coupon clipped: " + couponId);
      log.info(
        `Coupon Clipped with ID ${couponId}: ${couponClipResponse.status} ${couponClipResponse.statusText}`
      );
    } catch (error) {
      log.error(error);
      throw new Error("Error clipping coupon");
    }
  }
  const allCoupons = await getAllCoupons(accessToken, storeId);
  console.log(allCoupons);

  const unclippedCoupons = Object.entries(allCoupons).filter(
    ([key, coupon]) => !checkCouponClipped(coupon)
  );

  unclippedCoupons.forEach(([key, coupon]) => {
    clipCoupon(accessToken, coupon.offerId, storeId, coupon.offerPgm);
  });

  const formattedCoupons = unclippedCoupons.map(([key, coupon]) => {
    return {
      image: coupon.image,
      name: coupon.name,
      description: coupon.description,
      offerPrice: coupon.offerPrice,
    };
  });

  return formattedCoupons;
}
