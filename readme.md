# Vons ForU Coupon Clipper

## Overview

This script logs into your Vons account with your email and password and clips every Just 4 U coupon. Upon finishing, it will email you a report. It is intended to run as a Cron job. 

Due to botting detectors on Vons' website, this script uses a headless Chrome browser to pretend to be a real user. 

Why I made this? I have a very old raspberry pi server that doesn't play nice with
Docker or Python.


## Requirements

You will need:

1. A **Linux** computer or Windows with **WSL2**.
2. NodeJS version >19. Use the node --version to check your version. If you don't have it, I highly suggest using [NVM](https://github.com/nvm-sh/nvm).
3. Chrome/Chromium installed. ```sudo apt-get install chromium-browser```
4. xvfb installed for headless Chrome. ```sudo apt-get install xvfb```

## Usage

1. Clone this repo to your computer and go to the repo's root directory in the CLI.
2. Run `npm install` 
3. Create a file named config.json and copy the following Json code into it. Replace the fields with <> with your information. Make sure you remove the <>'s.
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
4. Run `mkdir log` to create a folder to logging.
5. Run `npm run start` to start the script.
6. Use [crontabguru](https://crontab.guru/) to help you write a crontab for this script.

## Email Notifications
Email notifications are for sending whether the script ran successfully to your personal email. 

It is important to note that most email providers, such as Gmail, do not support email and password login due to security.
One method I've found is using a Yahoo email account with a generated password found in settings.

## Troubleshooting

- Make sure the Puppeteer version matches your installed Chromium/Chrome version. [See here for matching versions](https://pptr.dev/chromium-support)
- Make sure the Chrome execution path when initializing Puppeteer is correct. By default it uses Chromium's default linux installation path.
- If on WSL2, make sure ```whereis npm``` shows npm is installed on Linux not Windows.
- If you have any questions setting it up, you can make a new issue. It would be much appreciated.

## Plans

- Docker version to ease the complication.
