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


/**
 * This function asks the server if this pair of usernames and passwords is valid.
 * @param {string} username The username of the user. Must be less than 30 characters.
 * @param {string} passwordGuess The password. Must be less than 30 characters.
 * @returns {int | null} userId | null
 */
export function IsValidUser(username, passwordGuess) {
    return undefined;
}

/**
 * This password tells the db to create a new user.
 * @param {string} username The username for the new user. Must be less than 30 characters.
 * @param {string} password The password for the new user. Must be less than 30 characters.
 * @returns {int | null} The new userID or null. 
 */
export function CreateNewUser(username, password) {
    return undefined;
} 

/**
 * Asks the server for all the booklists for the user.
 * @param {int} userID The userID to fetch the booklists for.
 * @returns {object[]} A collection of booklists for the user.
 */
export function FetchUserBookLists(userID) {
    return undefined;
}

/**
 * This function asks the server for the books in a givin booklist for a givin user.
 * @param {int} userID The ID of the user.
 * @param {int} BookListID The id of the booklist to get the books for.
 * @returns {object[]} A collections of books in the booklist.
 */
export function FetchUserBookListBooks(userID, BookListID) {
    return undefined;
}

/**
 * This function asks the server to create a new booklist for a user.
 * @param {int} userID The id of the user.
 * @param {string} bookListName The name for the new booklist. Must be less than 30 characters.
 * @returns {int | null} The id of the new booklist | null
 */
export function CreateNewBookList(userID, bookListName){
    return undefined;
}

/**
 * This function asks the server to delete a book from the booklist.
 * @param {int} userID The id of the user.
 * @param {int} BookListID The id of the booklist to delete.
 * @returns {boolean} If the operation was successful
 */
export function DeleteBookList(userID, BookListID) {
    return undefined;
}

/**
 * This function adds a book to a booklist.
 * @param {int} userID The id of the user.
 * @param {int} BookListID The id of the booklist to add the book to.
 * @param {int} ISBN The ISBN (10 digit ISBN)
 * @returns {boolean} If the operation was successful.
 */
export function AddBook(userID, BookListID, ISBN) {
    return undefined;
}

/**
 * This function asks the server to delete a book from a booklist
 * @param {int} userID The id of the user.
 * @param {int} BookListID The id of the booklist to remove the book from.
 * @param {int} ISBN The ISBN to remove (10 digit ISBN)
 * @returns {boolean} If the operation was successful
 */
export function DeleteBook(userID, BookListID, ISBN) {
    return undefined;
}

