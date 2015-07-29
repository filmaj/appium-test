/* global describe:true, before:true, after:true, it:true */
// transpile:mocha

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mochawait';
import wd from 'wd';

let should = chai.should();
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

let port = 4723;
let browser = wd.promiseChainRemote('localhost', port);

describe('Local Appium instance', function() {
    this.timeout(60000);
    before(async () => {
        try {
            await browser.init({
                deviceName:'Samsung Galaxy Device',
                platformName:'Android',
                browserName:'Chrome'
            });
        } catch(err) {
            should.not.exist('Error connecting to Appium!', err);
        }
    });
    it('load google maps', async () => {
        try {
            await browser.setImplicitWaitTimeout(5000);
            await browser.get('http://maps.google.com');
            let contexts = await browser.contexts();
            console.log('Many contexts, oh my', contexts);
            await browser.context(contexts[0]);
            var allow_button = await browser.elementByAndroidUIAutomator('new UiSelector().text("Allow")');
            await allow_button.click();
            await browser.context(contexts[1]);
            let input_els = await browser.elementsByTagName('input');
            console.log('Found input elements:', input_els);
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
