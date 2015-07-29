import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import wd from 'wd';
import {parse} from './helpers/creds';

let creds = parse();
let should = chai.should();
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

let browser = wd.promiseChainRemote(creds.HOST, creds.PORT, creds.USER, creds.KEY);

describe('On Sauce Labs, ', function() {
    this.timeout(300000);
    before(async () => {
        try {
            browser.on('command', (way, data) => {
                console.log(way, data);
            });
            await browser.init({
                deviceName:'Samsung Galaxy S5 Device',
                platformName:'Android',
                platformVersion:'4.4',
                browserName:'Chrome',
                name:'S5 RDC SpeedTest via speedof.me/m'
            });
            await browser.setImplicitWaitTimeout(2000);
            await browser.setAsyncScriptTimeout(60000);
        } catch(err) {
            should.not.exist('Error connecting to Sauce Labs!', err);
        }
    });
    it('should load a speedtest and get results.', async () => {
        try {
            await browser.get('http://speedof.me/m');
            let start_button = await browser.elementById('btnStart');
            await start_button.click();
            let speedtest_worked = await browser.waitForConditionInBrowser('testCompleted', 60000, 2000);
            if (speedtest_worked) {
                let download_element = await browser.elementByCssSelector('#rightCol .down');
                let download_text = await download_element.text();
                let download_speed = download_text.split(' ')[0];
                let upload_element = await browser.elementByCssSelector('#rightCol .up');
                let upload_text = await upload_element.text();
                let upload_speed = upload_text.split(' ')[0];
                let latency_element = await browser.elementByCssSelector('#rightCol h4');
                let latency = await latency_element.text();
                let latency_ms = latency.split(' ')[0];
                await browser.sauceJobUpdate({
                    "custom-data":{
                        "latency":latency_ms,
                        "upload":upload_speed,
                        "download":download_speed
                    }
                });
            } else {
                should.not.exist(true, 'waitForConditionInBrowser returned false!');
            }
        } catch (err) {
            should.not.exist('Error during test!', err);
            console.error(err);
        }
    });
    after(async () => {
        try {
            await browser.quit();
        } catch(err) {
            should.not.exist('Error quitting?', err);
            console.error(err);
        }
    });
});
