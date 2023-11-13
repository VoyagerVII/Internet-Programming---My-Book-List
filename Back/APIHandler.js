// -*- coding: utf-8 -*-
//APIHandler.js
//----------------------------------
// Created By: Matthew Kastl
// Created Date: 10/22/2023
// version 1.0
//----------------------------------
// """This file handles API requests.
//  """ 
//----------------------------------
// 
//Imports
const ORM = require('./ORM.js');
const SaltingAndHashing = require('./SaltingAndHashing.js');



class APIHandler {
    constructor() {
        this.salterAndHasher = new SaltingAndHashing(10);
        this.orm = new ORM();
    }

    async HandleGetRequest(request, callback) {
        let responseObj = {
            'result': null
        };

        try{
        
            let result = null;
            switch(request.query.action) {
                case 'qValidUser':
                    result = await this.ValidateUser(request.query.username, request.query.guess);
                    responseObj.result = result;
                    break;
                case 'qDistinctBookList':
                    result = await this.orm.getDistinctBookListByUser(request.query.userID);
                    responseObj.result = result;
                    break;
                case 'qBooks':
                    result = await this.orm.getBooks(request.query.userID, request.query.bookListID);
                    responseObj.result = result;
                    break;
                case 'pNewUser':
                    result = await this.AddNewUser(request.query.username, request.query.password);
                    responseObj.result = result;
                    break;
                case 'pNewBooklist':
                    result = await this.orm.insertNewBookList(request.query.bookListName, request.query.userID);
                    responseObj.result = result;
                    break;
                case 'pDeleteBookList':
                    result = await this.DeleteBookList(request.query.userID, request.query.BookListID);
                    break;
                case 'pNewBook':
                    result = await this.orm.insertNewBook(request.query.ISBN, request.query.userID, request.query.BookListID);
                    break;
                case 'pDeleteBook':
                    result = await this.orm.deleteBook(request.query.ISBN, request.query.userID, request.query.BookListID);
                    break;
                default:
                    let errStr = `Action received to API but not handled as was not understood. Action: ${request.query.action}`
                    console.error(errStr);
                    responseObj.result = errStr
                    break;
            }
        }
        catch (err) {
            let errStr = `An error occurred in the API but was not handled. Error: ${err}`
            console.error(errStr);
            responseObj.result = errStr
        }

        callback(responseObj);
    }

    /**
     * Generates a unique string of characters 60 characters long. The code will not already be in the db.
     * @returns {string} - A unique string of characters
     */
    async GenerateUniqueCode() {

        const MAX_ITER = 100;
        const CODE_LENGTH = 60;

        let iter = 0;
        let userResult = '';
        let friendResult = '';
        let code = '';
        do {
            //Prevents use being trapped infinitely if ive messed up!
            if(iter++ >= MAX_ITER) { console.error('iter Limit hit while trying to generate unique code!'); process.exit(1); }

            //Generate a unique code of 60 characters
            
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < CODE_LENGTH) {
                code += characters.charAt(Math.floor(Math.random() * charactersLength));
              counter += 1;
            }

            //validate that this code isn't being used already in the DB
            //Its ridiculously unlikely but possible.
            userResult = await this.orm.getUserByCode(code);
            friendResult = await this.orm.getFriendByCode(code);
        } while(userResult != -1 && friendResult != -1);

        return code;
    }

    /**
     * This method will verify if a username and password is a valid user, returning the users code if true.
     * @param {string} username The username provided
     * @param {string} guess The password guess
     * @returns {string | null} The users code if valid | null if not.
     */
    async ValidateUser(username, guess) {

        //Query the user data via username
        let user = await this.orm.getUserByUsername(username);

        //Check if the password guess is valid.
        let isValidUser = await this.salterAndHasher.ValidateHash(guess, user.hash);
        if(isValidUser) {
            return user.usercode; //Return the users code if so.
        }
        else {
            return null; //Return null if not.
        }

    }  

    /**
     * Adds a new user to the DB
     * @param {string} username The username of the new User
     * @param {string} password The password of the new User
     */
    async AddNewUser(username, password) {
        const hash = await this.salterAndHasher.GenerateSaltedHash(password);
        const userCode = await this.GenerateUniqueCode();
        const friendCode = await this.GenerateUniqueCode();

        //Add a new user
        await this.orm.insertNewUser(username, hash, userCode);

        //Get that user and its id
        const user = await this.orm.getUserByCode(userCode);
        if(user == -1) { console.error('User not found after being inserted into DB!'); process.exit(1); }

        //Add the new users friend code
        await this.orm.insertNewFriendCode(user.ID, friendCode);
        return userCode;
    }

    /**
     * Deletes a booklist and all the books that were in it.
     * @param {string} userID The ID of the user
     * @param {string} bookListID The ID of the booklist
     */
    async DeleteBookList(userID, bookListID) {
        await this.orm.deleteAllBooksFromBookList(bookListID, userID);
        await this.orm.deleteBookList(bookListID, userID);
    }
}

module.exports = APIHandler;