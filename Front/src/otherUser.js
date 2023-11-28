// otherUser.js
//----------------------------------
// Created By: Jose Soliz
// Date of Delivery: 10/20/2023
//----------------------------------

//note for self: dashboard <--> otheruser <--> serverComs 

/**
 * This method fetches information about another user and displays it on the dashboard.
 * @param {string} otherUserID The ID of the other user.
 */
function showOtherUserInformation(otherUserID) {
    //To Fetch and display the other user's username
    fetchOtherUsername(otherUserID)
        .then(username => {
            displayOtherUsername(username);
        })
        .catch(error => {
            console.error('Error fetching username:', error);
        });

    //Show the toher bookshelves
    fetchOtherUserBookshelves(otherUserID)
        .then(bookshelves => {
            displayOtherUserBookshelves(bookshelves);
        })
        .catch(error => {
            console.error('Error fetching bookshelves:', error);
        });

    //To fetch and display the other user's reading list
    fetchOtherUserReadingList(otherUserID)
        .then(readingList => {
            displayOtherUserReadingList(readingList);
        })
        .catch(error => {
            console.error('Error fetching reading list(s):', error);
        });
}

/**
 * Fetches the username of another user.
 * @param {string} otherUserID The ID of the other user.
 * @returns {Promise<string>} A promise that resolves to the other user's username.
 */
async function fetchOtherUsername(otherUserID) {
    //Use the ServerComs module to fetch the other user's username
    const response = await FetchOtherUsername(otherUserID);
    return response.result;
}

/**
 * Display the other user's username on the dashboard.
 * @param {string} username The other user's username.
 */
function displayOtherUsername(username) {
    //Updating the HTML to display the other user's username.
    const otherUserUsernameElement = document.getElementById('otherUserUsername');
    otherUserUsernameElement.textContent = username;
}

/**
 * Fetches the bookshelves of another user.
 * @param {string} otherUserID The ID of the other user.
 * @returns {Promise<object[]>} Promise that resolves to an array of bookshelves.
 */
async function fetchOtherUserBookshelves(otherUserID) {
    //Use the ServerComs module to fetch the other user's bookshelves.
    const bookshelves = await FetchOtherUserBookshelves(otherUserID);
    return bookshelves.result;
}

/**
 * Display the other user's bookshelves on the dashboard module.
 * @param {object[]} bookshelves An array of bookshelves for the other user.
 */
function displayOtherUserBookshelves(bookshelves) {
    //Updating the HTML to display the other user's bookshelves.
    const otherUserBookshelvesElement = document.getElementById('otherUserBookshelves');
    otherUserBookshelvesElement.innerHTML = ''; //clear the previous view

    bookshelves.forEach(bookshelf => {
        otherUserBookshelvesElement.innerHTML += `<div class="bookshelf-item">
                                                    <h3>${bookshelf.BookListName}</h3>
                                                    </div>`;
    });
}

/**
 * Fetches the reading list of another user.
 * @param {string} otherUserID The ID of the other user.
 * @returns {Promise<object[]>} A promise that resolves to an array of books in the reading list.
 */
async function fetchOtherUserReadingList(otherUserID) {
    //Use ServerComs.js to fetch the other user's reading list
    const readingList = await FetchOtherUserReadingList(otherUserID);
    return readingList.result;
}

/**
 * Displays the other user's reading list on the dashboard.
 * @param {object[]} readingList An array of books in the other user's reading list.
 */
function displayOtherUserReadingList(readingList) {
    //Update the innerHTML element to display the otherUser's reading list
    const otherUserReadingListElement = document.getElementById('otherUserReadingList');
    otherUserReadingListElement.innerHTML = ''; // clear the previous view

    readingList.forEach(book => {
        //Allow the viewing user to add someone else's book to their own shelf or reading list.
        otherUserReadingListElement.innerHTML += `<div class="book-item">
                                                    <img src="${bookCover}" alt="${bookTitle} cover" width="100">
                                                    <h3>${bookTitle}</h3>
                                                    <p>${bookAuthors}</p>
                                                    <p>ISBN-10: ${isbn10}</p>
                                                    <a href="${previewLink}" target="_blank">Preview Book</a>
                                                    <button onclick="AddBook(userID, booklistID, ${isbn10})">Add to Bookshelf</button>
                                                    <button onclick="AddBook(userID, 'Reading', ${isbn10})">Add to Reading List</button>
                                                    </div>`;
    });
}
