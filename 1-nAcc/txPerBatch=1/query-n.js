/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
*/

'use strict';

module.exports.info  = 'querying accounts';


let bc, contx;
let accounts;
module.exports.init = function(blockchain, context, args) {
    let acc = require('./smallbankOperations-createNAcc.js');
    bc       = blockchain;
    contx    = context;
    accounts = acc.account_array;
    //console.log("init value");
    //console.log(accounts);
    return Promise.resolve();
};

module.exports.run = function() {
    let acc_num  = accounts[Math.floor(Math.random()*(accounts.length))];
    //console.log(acc_num);
    
    return bc.queryState(contx, 'smallbank', 'v0', acc_num);
};

module.exports.end = function() {
    // do nothing
    return Promise.resolve();
};
