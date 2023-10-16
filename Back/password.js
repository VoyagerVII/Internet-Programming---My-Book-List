// -*- coding: utf-8 -*-
//password.js
//----------------------------------
// Created By: Matthew Kastl
// Created Date: 1/16/2023
// version 1.0
//----------------------------------
// """The file holds methods to 
//handle password and security operations.
//  """ 
//----------------------------------
// 
//@source https://www.npmjs.com/package/bcrypt
//NOTE::The fucntions are async as hashing can take a fair amount of time.
//The server should remain responsive while calculating hashes.
//Imports
const bcrypt = require('bcrypt');
const SALTROUNDS = 10;

/**
 * This method salts and hashes a string into a 60 character hash.
 * @param {string} stringToHash The string (password) to generate the hash for.
 * @returns Returns a salted hash of the string.
 */
async function GenerateSaltedHash(stringToHash) {
    const salt = await bcrypt.genSalt(SALTROUNDS);
    const hash = await bcrypt.hash(stringToHash, salt);
    return hash;
}

/**
 * This method validates a string guess against a known hash.
 * @param {string} hashGuess A string to hash and compare.
 * @param {string} hashKnown The 60 character hash to compare against.
 * @returns {boolean} Weather the guess equivilates to the hash or not.
 */
async function ValidateHash(hashGuess, hashKnown) {
    return await bcrypt.compare(hashGuess, hashKnown);
}


