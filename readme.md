# Vons ForU Coupon Clipper

## Overview

This script logs into your Vons account via email and password and clips every Just 4 U coupon. It is
intended to run as a Cron job that runs regularly but can be ran manually.

## ⚠️ Important

The Vons coupon website recently added ReCaptcha v2 to deter botters. This script relies on [2Captcha](https://2captcha.com/pricing), an image analysis service, to provide a Captcha solution on every script run. It is about $3 for 1000 Captcha solutions. It is just $3 one-time, NOT per month, so this would last a normal person running it a few times per week several years without having to pay any money. A fair trade for those who are lazy.

## Requirements Before You Begin

You will need:

1. A computer.
2. NodeJS version >18. Use the node --version to check your version.
3. A 2Captcha account with a balance of around $3.

Nice to haves:

- A computer that is a cheap low cost server such as a Raspberry Pi or a cheap VPC.
- A computer with crontab.
- A Yahoo email account to alert you on the status on the script.

## Usage

1. Once you clone the repo to your computer or server of your choice, navigate to the root project directory.
2. Open the command line and run `npm install` to install the project's dependencies.

3. Create a file named config.json and copy the following Json code into it. Fill in the fields with < >'s with your information.
   Fields marked with a \* symbol are required!

```
{
  "_2CaptchaApiKey": "<*YOUR 2CAPTCHA API KEY*>",
  "accounts": [
    {
      "name": "<A NAME FOR THE ACCOUNT. CAN BE ANYTHING.>",
      "loginData": {
        "email": "<*YOUR VONS LOGIN EMAIL GOES HERE*>",
        "password": "<*YOUR VONS LOGIN PASSWORD GOES HERE* >"
      },
      "storeId": "<*FIND YOUR STORE ID. Mine is 2090. Can be Googled.*>",
      "emailRecipient": "<EMAIL TO RECEIVE STATUS UPDATES>"
    }
  ],
  "emailLoginData": {
    "email": "<EMAIL TO SEND STATUS UPDATES FROM>",
    "password": "<PASSWORD TO EMAIL ABOVE>",
    "host": "<EMAIL SERVICE HOST. Yahoo is smtp.mail.yahoo.com>",
    "port": <EMAIL SERVICE PORT. Yahoo is 587>,
    "secure": <Depends on Service. Yahoo is false>
  }
}
```

Email notifications are for sending whether the script ran successfully to your personal email.

Note for Notifications: Most email providers, such as Gmail, do not support email and password login due to security.
One method I've found is using a Yahoo email account with a generated password found in settings.

3. Run `npm run start` to start the script.
4. Use [crontabguru](https://crontab.guru/) to help you write a crontab for this script. The rest is outside of the scope of the tutorial.
