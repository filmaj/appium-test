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
                deviceName:'Kindle Fire HD 8.9 Emulator',
                platform:'Linux',
                browserName:'Android',
                version:'4.0',
                name:"Android Emulator test for mobile web in Selendroid"
            });
        } catch(err) {
            should.not.exist('Error connecting to browserium!', err);
        }
    });
    it('should scroll down in contact view', async () => {
        try {
            await browser.setImplicitWaitTimeout(5000);
            await browser.get('http://cnn.com');
            let title = await browser.title();
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
