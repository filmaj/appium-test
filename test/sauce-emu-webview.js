import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import wd from 'wd';
import {parse} from './helpers/creds';

let creds = parse();
let should = chai.should();
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

let app = wd.promiseChainRemote(creds.HOST, creds.PORT, creds.USER, creds.KEY);

describe('On Sauce Labs', function() {
    this.timeout(240000);
    before(async () => {
        try {
            await app.init({
                deviceName:'Android Emulator',
                platformVersion:'4.4',
                platformName:'Android',
                "appium-version":"1.4.11",
                app:"http://appium.s3.amazonaws.com/selendroid-test-app-0.7.0.apk",
                name:"Android Emulator webview test"
            });
        } catch(err) {
            should.not.exist('Error connecting to Appium!', err);
        }
    });
    it('should scroll down in contact view', async () => {
        try {
            await app.setImplicitWaitTimeout(30000);
            let webview_btn = await app.elementByClassName("android.widget.ImageButton");
            await webview_btn.click();
            let cs = await app.contexts();
            console.log('contexts:', cs);
            await app.context("WEBVIEW_io.selendroid.testapp");
            let current_context = await app.currentContext();
            console.log('current context is ', current_context);
        } catch (e) {
            should.not.exist('Error during test!', e);
        }
    });
    after(async () => {
        try {
            await app.quit();
        } catch (e) {
            should.not.exist('Error quitting!', e);
        }
    });
});
