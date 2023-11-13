// -*- coding: utf-8 -*-
//ServerComs.js
//----------------------------------
// Created By: Matthew Kastl
// Created Date: 1/15/2023
// version 1.0
//----------------------------------
// """This file hosts public methods for
//client server communication
//  """ 
//----------------------------------

const ServerAddress = "http://localhost:8000"; //Hit loopback for testing

/**
 * This function asks the server if this pair of usernames and passwords is valid.
 * @param {string} username The username of the user. Must be less than 30 characters.
 * @param {string} passwordGuess The password. Must be less than 30 characters.
 * @returns {string | null} userId | null
 */
export async function IsValidUser(username, passwordGuess) {

    if(typeof(username) != 'string' || typeof(passwordGuess) != 'string') { 
        console.error('In IsValidUser call, password or username not string!'); 
        return null; 
    }
    if(username.length > 30 || passwordGuess.length > 30) {
        console.error('In IsvalidUser call username or password greater than 30 characters!');
        return null;
    }

    const response = await fetch(`${ServerAddress}/api?action=qValidUser&username=${username}&guess=${passwordGuess}`)
    return await response.json();
}


/**
 * This password tells the db to create a new user.
 * @param {string} username The username for the new user. Must be less than 30 characters.
 * @param {string} password The password for the new user. Must be less than 30 characters. 
 */
export async function CreateNewUser(username, password) {
    if(typeof(username) != 'string' || typeof(password) != 'string') { 
        console.error('In CreateNewUser call, password or username not string!'); 
        return null; 
    }
    if(username.length > 30 || password.length > 30) {
        console.error('In CreateNewUser call username or password greater than 30 characters!');
        return null;
    }

    const response = await fetch(`${ServerAddress}/api?action=pNewUser&username=${username}&password=${password}`)
    const resultJSON = await response.json();
    return resultJSON.result;
}

/**
 * Asks the server for all the booklists for the user.
 * @param {string} userID The userID to fetch the booklists for.
 * @returns {object[]} A collection of booklists for the user.
 */
export async function FetchUserBookLists(userID) {
    const response = await fetch(`${ServerAddress}/api?action=qDistinctBookList&userID=${userID}`)
    const resultJSON = await response.json();
    return resultJSON.result;
}

/**
 * This function asks the server for the books in a givin booklist for a givin user.
 * @param {string} userID The ID of the user.
 * @param {string} BookListID The id of the booklist to get the books for.
 * @returns {object} A collections of books in the booklist.
 */
export async function FetchUserBookListBooks(userID, BookListID) {
    const response = await fetch(`${ServerAddress}/api?action=qBooks&bookListID=${BookListID}&userID=${userID}`)
    const resultJSON = await response.json();
    return resultJSON.result;
}

/**
 * This function asks the server to create a new booklist for a user.
 * @param {string} userID The id of the user.
 * @param {string} bookListName The name for the new booklist. Must be less than 30 characters.
 * @returns {string | null} The id of the new booklist | null
 */
export async function CreateNewBookList(userID, bookListName){
   
    const response = await fetch(`${ServerAddress}/api?action=pNewBooklist&bookListName=${bookListName}&userID=${userID}`)
    const resultJSON = await response.json();
    return resultJSON.result;
}

/**
 * This function asks the server to delete a book from the booklist.
 * @param {string} userID The id of the user.
 * @param {string} BookListID The id of the booklist to delete.
 */
export async function DeleteBookList(userID, BookListID) {
    await fetch(`${ServerAddress}/api?action=pDeleteBookList&userID=${userID}&BookListID=${BookListID}`)
}

/**
 * This function adds a book to a booklist.
 * @param {int} userID The id of the user.
 * @param {int} BookListID The id of the booklist to add the book to.
 * @param {int} ISBN The ISBN (10 digit ISBN)
 * @returns {boolean} If the operation was successful.
 */
export async function AddBook(userID, BookListID, ISBN) {
    await fetch(`${ServerAddress}/api?action=pNewBook&ISBN=${ISBN}&userID=${userID}&BookListID=${BookListID}`)
}

/**
 * This function asks the server to delete a book from a booklist
 * @param {int} userID The id of the user.
 * @param {int} BookListID The id of the booklist to remove the book from.
 * @param {int} ISBN The ISBN to remove (10 digit ISBN)
 * @returns {boolean} If the operation was successful
 */
export async function DeleteBook(userID, BookListID, ISBN) { 
    await fetch(`${ServerAddress}/api?action=pDeleteBook&ISBN=${ISBN}&userID=${userID}&BookListID=${BookListID}`)
}


test();

