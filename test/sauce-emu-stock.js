import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import wd from 'wd';
import {parse} from './helpers/creds';

let creds = parse();
let should = chai.should();
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

let browser = wd.promiseChainRemote(creds.HOST, creds.PORT, creds.USER, creds.KEY);

describe('On Sauce Labs', function() {
    this.timeout(240000);
    before(async () => {
        try {
            await browser.init({
                deviceName:'Samsung Galaxy S4 Emulator',
                platformVersion:'4.4',
                platformName:'Android',
                browserName:"browser",
                "browserium-version":"1.4.11",
                name:"Android Emulator test w stock browser"
            });
        } catch(err) {
            should.not.exist('Error connecting to browserium!', err);
        }
    });
    it('should load google.com', async () => {
        try {
            await browser.setImplicitWaitTimeout(5000);
            await browser.get('http://google.com');
            let title = await browser.title();
            console.log('Title on page is ', title);
        } catch (e) {
            should.not.exist('Error during test!', e);
        }
    });
    after(async () => {
        try {
            await browser.quit();
        } catch (e) {
            should.not.exist('Error quitting!', e);
        }
    });
});
