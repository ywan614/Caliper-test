/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
*/

'use strict';

module.exports.info  = 'small_bank_operations';

let bc, contx;
let no_accounts = 0;
let account_array = [];
let accounts, txnPerBatch;
const initial_balance = 1000000;
const operation_type = ['transact_savings','deposit_checking','send_payment','write_check', 'amalgamate'];
let prefix;

/**
 * Get account index
 * @return {Number} index
 */
function getAccount() {
    return Math.floor(Math.random()*Math.floor(account_array.length));
}

/**
 * Get two accounts
 * @return {Array} index of two accounts
 */
function get2Accounts() {
    let idx1 = getAccount();
    let idx2 = getAccount();
    if(idx2 === idx1) {
        idx2 = getAccount();
    }
    return [idx1, idx2];
}

/**
 * Generate unique account key for the transaction
 * @returns {Number} account key
 **/
function generateAccount() {
    // should be [a-z]{1,9}
    if(typeof prefix === 'undefined') {
        prefix = process.pid;
    }
    let count = account_array.length+1;
    let num = prefix.toString() + count.toString();
    return parseInt(num);
}

/**
 * Generates random string.
 * @returns {string} random string from possible characters
 **/
function random_string() {
    let text = '';
    const possible = 'ABCDEFGHIJKL MNOPQRSTUVWXYZ abcdefghij klmnopqrstuvwxyz';

    for (let i = 0; i < 12; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 * Generates small bank workload with specified number of accounts
 * and operations.
 * @returns {Object} array of json objects and each denotes
 * one operations
 **/
//let acc_index1 = getAccount();
let count = 0;
function generateWorkload() {
    let workload = [];
    if(count == 0){
        let acc_id = generateAccount();
        account_array.push(1);
        let acc = {
            'customer_id': 1,
            'customer_name': random_string(),
            'initial_checking_balance': initial_balance,
            'initial_savings_balance': initial_balance,
            'transaction_type': 'create_account'
        };
        workload.push(acc);  
        console.log("创建账户");
    }
    
    console.log(workload);
    
    return workload;
    
}

module.exports.init = function(blockchain, context, args) {
    if(!args.hasOwnProperty('accounts')) {
        return Promise.reject(new Error('smallbank.operations - \'accounts\' is missed in the arguments'));
    }
    if(!args.hasOwnProperty('txnPerBatch')) {
        return Promise.reject(new Error('smallbank.operations - \'txnPerBatch\' is missed in the arguments'));
    }
    accounts = args.accounts;
    /*
    if(accounts <= 3) {
        return Promise.reject(new Error('smallbank.operations - number accounts should be more than 3'));
    }
    */
    txnPerBatch = args.txnPerBatch;
    bc = blockchain;
    contx = context;
    return Promise.resolve();
};
//let count1 = 0;
module.exports.run = function() {   
    let args = generateWorkload();
    
    return bc.invokeSmartContract(contx, 'smallbank', '1.0', args, 120);
};

module.exports.end = function() {
    return Promise.resolve();
};


module.exports.account_array = account_array;
