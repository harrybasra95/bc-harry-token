import Web3 from 'web3';
import ganache from 'ganache';
import assert from 'assert';
import { beforeEach, describe, it } from 'mocha';
import output from '../compile';

const web3 = new Web3(ganache.provider());

let accounts;
let contract;
let managerAccount;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    [managerAccount] = accounts;
    contract = await new web3.eth.Contract(output.abi)
        .deploy({
            data: output.evm.bytecode.object,
        })
        .send({ from: managerAccount, gas: '1000000' });
});

describe('Harry Token', () => {
    it('Contract gets deployed', async () => {
        assert.ok(contract.options.address);
    });

    it('Total supply check', async () => {
        const totalSupply = await contract.methods.totalSupply().call();
        assert(totalSupply, 1000000);
    });
});
