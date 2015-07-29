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
    this.timeout(240000);
    before(async () => {
        try {
            await browser.init({
                deviceName:'iPhone 6 Device',
                platformName:'iOS',
                platformVersion:'8.0',
                browserName:'Safari',
                name:'Pinging MDM server'
            });
        } catch(err) {
            should.not.exist('Error connecting to Sauce Labs!', err);
        }
    });
    it('should get something by pinging MDM root goodness', async () => {
        try {
            await browser.get('https://172.22.3.1:12345');
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
