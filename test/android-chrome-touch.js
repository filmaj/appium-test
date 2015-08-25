/* global describe:true, before:true, after:true, it:true */
// transpile:mocha

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import wd from 'wd';
import {sleep} from './helpers/sleep';

let should = chai.should();
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

let port = 4723;
let browser = wd.promiseChainRemote('localhost', port);
browser.on('command', (direction, command, data) => { console.log(direction + ': ' + (data?data:command)); })

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
    it('load google, enter text, scroll down', async () => {
        try {
            await browser.setImplicitWaitTimeout(5000);
            await browser.get('http://google.com');
            let input_el = await browser.elementByName('q');
            await input_el.type('sauce labs');
            await input_el.type(wd.SPECIAL_KEYS.Enter);
            await sleep(1000);
            let link_el = await browser.elementByLinkText('Sauce Labs');
            let link_el_id = link_el.value;
            await browser.performTouchAction({"actions":[
                {action:"press",options:{x:"200",y:"100"}},
                {action:"wait"},
                {action:"moveTo"},
                {action:"release",options:{x:"200",y:"1200"}}
            ]});
            await sleep(1000);
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
