import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import wd from 'wd';

let should = chai.should();
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

let port = 4723;
let app = wd.promiseChainRemote('localhost', port);

describe('Local Appium instance', function() {
    this.timeout(60000);
    before(async () => {
        try {
            await app.init({
                deviceName:'Samsung Galaxy Device',
                platformName:'Android',
                "appActivity": ".ContactManager",
                "appPackage": "com.example.android.contactmanager",
            });
        } catch(err) {
            should.not.exist('Error connecting to Appium!', err);
        }
    });
    it('should scroll down in contact view', async () => {
        try {
            await app.setImplicitWaitTimeout(5000);
            await app.performTouchAction({"actions":[
                {action:"press",options:{x:"200",y:"1200"}},
                {action:"wait",options:{}},
                {action:"moveTo",options:{x:"200",y:"100"}},
                {action:"release"}
            ]});

        } catch (e) {
            should.not.exist('Error during test!', e);
        }
    });
    after(async () => {
        try {
            app.quit();
        } catch (e) {
            should.not.exist('Error quitting!', e);
        }
    });
});
