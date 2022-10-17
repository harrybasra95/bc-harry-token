import fs from 'fs';
import path from 'path';
import solc from 'solc';

const contractName = 'HarryToken';
const contractPath = path.resolve(
    __dirname,
    'contracts',
    `${contractName}.sol`
);
const content = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        [contractName]: {
            content,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

/**
 * @typedef {Object} Output
 * @property {any} abi
 * @property {any} devdoc
 * @property {any} evm
 * @property {any} ewasm
 * @property {any} metadata
 * @property {any} storageLayout
 * @property {any} userdoc
 */

/**
 * @type {Output}
 */
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    contractName
][contractName];

export default output;
