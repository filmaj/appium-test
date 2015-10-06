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
    this.timeout(120000);
    before(async () => {
        try {
            await browser.init({
                deviceName:'Samsung Galaxy S5 Device',
                platformName:'Android',
                platformVersion:'4.4',
                browserName:'Chrome',
                name:'S5 real device google.com'
            });
        } catch(err) {
            should.not.exist('Error connecting to Sauce Labs!', err);
        }
    });
    it('should get something on google.com', async () => {
        try {
            await browser.get('https://google.com');
            let title = await browser.title();
        } catch (err) {
            should.not.exist('Error during test!', err);
        }
    });
    after(async () => {
        try {
            await browser.quit();
        } catch(err) {
            should.not.exist('Error quitting?', err);
        }
    });
});
