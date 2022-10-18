/* eslint-disable no-console */
import Web3 from 'web3';
import ganache from 'ganache';
import assert from 'assert';
import { beforeEach, describe, it } from 'mocha';
import output from '../compile';

const INITIAL_SUPPLY = 1000000;
const web3 = new Web3(ganache.provider());

let accounts;
let contract;
let managerAccount;
let lastTransferEvent;
let lastApprovalEvent;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    [managerAccount] = accounts;
    contract = await new web3.eth.Contract(output.abi)
        .deploy({
            data: output.evm.bytecode.object,
            arguments: [INITIAL_SUPPLY],
        })
        .send({ from: managerAccount, gas: '1000000' });
    contract.events.Transfer({}, (error, event) => {
        lastTransferEvent = event;
    });
    contract.events.Approval({}, (error, event) => {
        lastApprovalEvent = event;
    });
});

describe('Harry Token', () => {
    it('Contract gets deployed with correct values', async () => {
        assert.ok(contract.options.address);
        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        assert(name, 'Harry Token');
        assert(symbol, 'HT');
    });

    it('Total supply check', async () => {
        const totalSupply = await contract.methods.totalSupply().call();
        assert(totalSupply, INITIAL_SUPPLY);
    });

    it('Check balance for owner account', async () => {
        const balanceOfManager = await contract.methods
            .balanceOf(managerAccount)
            .call();
        assert(balanceOfManager, INITIAL_SUPPLY);
    });

    it('checks transfer function and transfer event', async () => {
        const [, secondAccount] = accounts;
        const transferAmount = 100000;
        await contract.methods
            .transfer(secondAccount, transferAmount)
            .send({ from: managerAccount });
        const firstAccountBal = await contract.methods
            .balanceOf(managerAccount)
            .call();
        const secondAccountBal = await contract.methods
            .balanceOf(secondAccount)
            .call();
        assert(firstAccountBal, INITIAL_SUPPLY - transferAmount);
        assert(secondAccountBal, transferAmount);
        assert(lastTransferEvent.returnValues['0'], managerAccount);
        assert(lastTransferEvent.returnValues['1'], secondAccount);
        assert(lastTransferEvent.returnValues['2'], transferAmount);
    });

    it('checks approval for tokens for delegated transfer', async () => {
        const [, secondAccount] = accounts;
        const approvedAmount = 10000;
        await contract.methods
            .approve(managerAccount, approvedAmount)
            .send({ from: secondAccount });
        const updatedAmount = await contract.methods
            .allowance(secondAccount, managerAccount)
            .call();
        assert.equal(updatedAmount, approvedAmount);
        assert.equal(lastApprovalEvent.returnValues['0'], secondAccount);
        assert.equal(lastApprovalEvent.returnValues['1'], managerAccount);
        assert.equal(lastApprovalEvent.returnValues['2'], approvedAmount);
    });

    it('checks for transfer for function', async () => {
        const [, secondAccount, thirdAccount] = accounts;
        const approvedAmount = 10000;
        await contract.methods.transfer(secondAccount, approvedAmount).send({
            from: managerAccount,
        });
        await contract.methods
            .approve(managerAccount, approvedAmount)
            .send({ from: secondAccount });
        await contract.methods
            .transferFrom(secondAccount, thirdAccount, approvedAmount)
            .send({ from: managerAccount });
        assert(lastTransferEvent.returnValues['0'], secondAccount);
        assert(lastTransferEvent.returnValues['1'], thirdAccount);
        assert(lastTransferEvent.returnValues['2'], approvedAmount);
    });
});
