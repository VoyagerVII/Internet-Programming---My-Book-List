// -*- coding: utf-8 -*-
//ORM.js
//----------------------------------
// Created By: Matthew Kastl
// Created Date: 10/22/2023
// version 1.0
//----------------------------------
// """This file is an ORM for sqlite
// built for the MY-BOOK-LIST
//  """ 
//----------------------------------
//Imports
const sqlite3 = require('sqlite3');
const dotenv = require('dotenv');
const { readlink } = require('fs');
dotenv.config();

class ORM {
    constructor(){
        this.DB_PATH = process.env.DB_PATH
        this.conn = new sqlite3.Database(this.DB_PATH, (err) => {
            if(err) { 
                console.error(err.message);
                exit(1);
            }
            else console.log('DB connection established...');
        });
    }


    /**
     * Generates the MY BOOK LIST DB on the loaded connection
     */
    CreateDB() {
        this.conn.exec(`
        CREATE TABLE User (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            usercode varchar(60) NOT NULL,
            username varchar(30) NOT NULL,
            hash varchar(60) NOT NULL
        );
        
        CREATE TABLE FriendCodes (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            UserID INTEGER NOT NULL,
            FriendCode varchar(60) NOT NULL
            );
        
        CREATE TABLE BookList (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            BookListName varchar(30) NOT NULL,
            UserID varchar(60) NOT NULL
        );
        
        CREATE TABLE Books (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            ISBN varchar(10) NOT NULL,
            UserID varchar(60) NOT NULL,
            bookListID INT NOT NULL
        ); `);
    }

    /**
     * Queries a user from the DB from a username
     * @param {string} username The username of the user to get.
     * @returns A user object (ID, username, hash, usercode)
     */
    getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            this.conn.all(`
                SELECT * FROM User 
                WHERE username = ?`, 
                username, 
                (err, rows) => {
                    if(err) {
                        console.err(err.message);
                        reject('err.message');
                    }
                    else if ( rows.length > 1) { //More than one user.
                        console.error('Too many rows returned from User table!');
                        reject('Too many rows returned from User table!');
                    }
                    else if (rows.length <= 0) { //No user
                        return resolve(-1);
                    }
                    else return resolve(rows[0]); //A single user
                }
            )
        });
    }


    /**
     * Queries a frindCode row DB from a friendCode
     * @param {string} friendCode The friendCode of the row to get.
     * @returns A user object (ID, UserID, FriendCode)
     */
    getFriendByCode(friendCode) {
        return new Promise((resolve, reject) => {
            this.conn.all(`
                SELECT * FROM FriendCodes 
                WHERE FriendCode = ?`, 
                friendCode, 
                (err, rows) => {
                    if(err) {
                        console.err(err.message);
                        reject('err.message');
                    }
                    else if ( rows.length > 1) { //More than one result
                        console.err('Too many rows returned from FriendCodes table!');
                        reject('Too many rows returned from FriendCodes table!');
                    }
                    else if (rows.length <= 0) { //No result
                        return resolve(-1);
                    }
                    else return resolve(rows[0]); //One good result
                }
            )
        });
    }


    /**
     * Queries a user from the DB from a userCode
     * @param {string} userCode The userCode of the user to get.
     * @returns A user object (ID, username, hash, usercode)
     */
    getUserByCode(userCode) {
        return new Promise((resolve, reject) => {
            this.conn.all(`
                SELECT * FROM User 
                WHERE usercode = ?`, 
                userCode, 
                (err, rows) => {
                    if(err) {
                        console.err(err.message);
                        reject('err.message');
                    }
                    else if ( rows.length > 1) {
                        console.err('Too many rows returned from User table!');
                        reject('Too many rows returned from User table!');
                    }
                    else if (rows.length <= 0) {
                        return resolve(-1);
                    }
                    else return resolve(rows[0]);
                }
            )
        });
    }

    /**
     * Queries a user from the DB from a userCode
     * @param {string} userCode The userCode of the user to get.
     * @returns A user object (ID, BookListName, UserID)
     */
    getDistinctBookListByUser(userCode) {
        return new Promise((resolve, reject) => {
            this.conn.all(`
            SELECT DISTINCT * FROM BookList
            WHERE UserID = ?`, 
                userCode, 
                (err, rows) => {
                    if(err) {
                        console.err(err.message);
                        reject('err.message');
                    }
                    else if (rows.length <= 0) {
                        return resolve(null);
                    }
                    else return resolve(rows);
                }
            )
        });
    }


    /**
     * Queries all the books in a booklist
     * @param {string} userCode The userCode of the user to get the booklist from.
     * @param {string} bookListID The bookListID the books are in.
     * @returns A collection of book objects (ID, ISBN, UserID, bookListID)
     */
    getBooks(userCode, bookListID) {
        return new Promise((resolve, reject) => {
            this.conn.all(`
            SELECT * FROM Books
            WHERE UserID = ? AND bookListID = ?`, 
                [userCode, bookListID], 
                (err, rows) => {
                    if(err) {
                        console.err(err.message);
                        reject('err.message');
                    }
                    else if (rows.length <= 0) {
                        return resolve(null);
                    }
                    else return resolve(rows);
                }
            )
        });
    }



    


    /**
     * Inserts a new user into the users table.
     * @param {string} username 
     * @param {string} hash salted and hashed password
     * @param {string} usercode unique 60 char code
     * @returns null
     */
    insertNewUser(username, hash, usercode) {
        return new Promise((resolve, reject) => {
            try{
                this.conn.run(`
                    INSERT INTO User (username, hash, usercode)
                    VALUES (?, ?, ?)
                    `,
                    [username, hash, usercode],
                    () => {
                        resolve(usercode);
                    }
                );
            }
            catch(err) {
                reject(null);
            }
        });
    }


    /**
     * Inserts a new friend code into the friend code table.
     * @param {string} userID The ID of the user in the user table 
     * @param {string} friendCode The unique friend code
     * @returns null
     */
    insertNewFriendCode(userID, friendCode) {
        return new Promise((resolve, reject) => {
            this.conn.run(`
                INSERT INTO FriendCodes (UserID, FriendCode)
                VALUES (?, ?)
                `,
                [userID, friendCode],
                () => {
                    resolve();
                }
            );
        });
    }

    
    /**
     * Inserts a new BookList into the BookList table.
     * @param {string} bookListName The name of the Booklist
     * @param {string} userID The ID of the user in the user table 
     * @returns {Promise} A promise that resolves to the last ID entered
     */
    insertNewBookList(bookListName, userID) {
        return new Promise((resolve, reject) => {
                this.conn.run(`
                INSERT INTO BookList (BookListName, userID)
                VALUES (?, ?)
                `,
                [bookListName, userID],
                function() {
                    resolve(this.lastID);
                }
            );
        });
    }


    /**
     * Inserts a new BookList into the BookList table.
     * @param {string} BookListID The ID of the Booklist
     * @param {string} userID The ID of the user in the user table 
     * @returns null
     */
    deleteBookList(BookListID, userID) {
        return new Promise((resolve, reject) => {
                this.conn.run(`
                DELETE FROM BookList
                WHERE ID = ? AND UserID = ?
                `,
                [BookListID, userID],
                () => {
                    resolve();
                }
            );
        });
    }


    
    /**
     * Deletes every book from a bookList
     * @param {string} BookListID The ID of the Booklist
     * @param {string} userID The ID of the user in the user table 
     * @returns null
     */
    deleteAllBooksFromBookList(BookListID, userID) {
        return new Promise((resolve, reject) => {
                this.conn.run(`
                DELETE FROM Books
                WHERE BookListID = ? AND UserID = ?
                `,
                [BookListID, userID],
                () => {
                    resolve();
                }
            );
        });
    }


    /**
     * Inserts a new book into the book table.
     * @param {string} ISBN The ISBN of the book
     * @param {string} userID The ID of the user in the user table 
     * @param {string} bookListID The ID of the booklist
     * @returns null
     */
    insertNewBook(ISBN, userID, bookListID) {
        return new Promise((resolve, reject) => {
                this.conn.run(`
                INSERT INTO Books (ISBN, UserID, bookListID) 
                VALUES(?, ?, ?)
                `,
                [ISBN, userID, bookListID],
                (err) => 
                {
                    resolve();
                }
            );
        });
    }

    /**
     * Deletes a Book from the Book table.
     * @param {string} ISBN The ISBN of the book
     * @param {string} userID The ID of the user in the user table 
     * @param {string} bookListID The ID of the booklist
     * @returns null
     */
    deleteBook(ISBN, userID, bookListID) {
        return new Promise((resolve, reject) => {
                this.conn.run(`
                DELETE FROM Books 
                WHERE ISBN= ? AND UserID = ? AND bookListID = ?
                `,
                [ISBN, userID, bookListID],
                () => {
                    resolve();
                }
            );
        });
    }

    
    





}


module.exports = ORM;