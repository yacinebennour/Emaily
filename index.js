// ******************
// YBENN
// EMAILY
// 
// HAVE FUN! 
//
// ALWAYS DOUBLE CHECK THAT THE SELECTOR ARE CORRECT AS THEY DO GET UPDATED FREQUENTLY ON GOOGLE.
// ******************
const puppeteer = require('puppeteer');
const defaultLink = 'https://www.google.com/';

const searchQuerys = ['site:facebook.com “online” "@gmail.com”',
  'site:facebook.com “read” "@gmail.com”',
  'site:instagram.com “book” "@gmail.com”',
  'site:facebook.com “emails” "@gmail.com”',
  'site:instagram.com “twitter” "@gmail.com”',
  'site:instagram.com “follow” "@gmail.com”',
  'site:instagram.com “technology” "@gmail.com”',
  'site:instagram.com “end” "@gmail.com"'];

const fs = require('fs');

// Variables
var pageNext = 2;
var pageNextAfter = 8;

// for (var q = 0; q < searchQuerys.length; q++) {
startProcess(searchQuerys[0]);
// }


function startProcess(theSearchQuery) {
  (async () => {

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-dev-shm-usage']
    });

    const page = await browser.newPage();

    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36');

    await page.goto(defaultLink, { waitUntil: 'networkidle2' });

    await page.type('#tsf > div:nth-child(2) > div > div.RNNXgb > div > div.a4bIc > input', theSearchQuery);
    await page.keyboard.press('Enter');


    var i;
    async function scrape() {
      for (i = 1; i < 12; i++) {
        await page.waitForTimeout(1000);
        var e = i;
        if (await page.$("#rso > div > div > div:nth-child(" + i + ") > div > div > div.s > div > span") != null) {
          console.log("Found Selector " + i);
          await page.waitForTimeout(500);
          const result = await page.evaluate(x => {
            const test = document.querySelector("#rso > div > div > div:nth-child(" + x + ") > div > div > div.s > div > span").innerText;
            console.log(x);

            return test;
          }, i);


          fs.appendFile('ScrapedEmails.txt', extractEmails(result).toString() + "\n", function (err) {
            if (err) throw err;
          });


        } else {
          console.log("Selector at " + i + " Not Found");
        }

        if (i == 11) {
          await page.waitFor(4000);
          console.log("PAGE NEXT IS AT + " + pageNext);
          if (pageNext < 8) {
            pageNext++;
            goToNextPage(pageNext);
          } else {
            pageNext = 8;
            goToNextPage(pageNextAfter);
          }
        }

      }
    }

    scrape();

    async function goToNextPage(pageNumber) {
      console.log("-------------------------------------------------------")
      console.log("Got it +  " + pageNumber);
      await page.waitFor(1000);
      await page.click('#nav > tbody > tr > td:nth-child(' + pageNumber + ') > a');
      scrape();
    }

    await browser.close();
  })();
}

// email extraction
function extractEmails(text) {
  var test = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

  if (test != null) {
    return test
  } else {
    return "";
  }
}
