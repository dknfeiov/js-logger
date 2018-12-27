
import { ErrorLogger } from '../src/index';
import { expect } from 'chai';


let log;

let count = 0;
const errorMap = new Set()

describe('JS 代码错误', () => {

    before(() => {
        log = ErrorLogger.getInstance('TEST_ERROR_LOGGER', {
            handle: function (error) {
                errorMap.
            }
        });
    });

    it('常规代码错误', () => {
        throw new Error('normal error')

        expect(log.analy()).to.be.equal(PageStatusEnum.FIRST);
    });

});

