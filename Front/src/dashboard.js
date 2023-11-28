//Dashboard.js
//----------------------------------
// Created By: Trent Fowler
// Created Date: 11/11/2023
// version 1.0
//----------------------------------
// """This file hosts public methods for
//    Dashboard """ 
//----------------------------------

//let userBookshelf = []; // Global variable to store bookshelf data
let searchResults = []; // Global variable to store search results

console.log('Dashboard.js loaded')

//Getting the userID from the URL parameters for following functions
var urlParams = new URLSearchParams(window.location.search);
userID = urlParams.get('userID');

/**
 * This function fetches the database for the requested book, and 
 * calls the displayResults() function with the fetched data.
 */
function searchBook() {
    const query = document.getElementById('bookSearch').value;
    const API_KEY = 'AIzaSyBASUxdn6U-raB77D5B5cp4KH5y90VIAMU'; // Replace with your Google Books API Key
    const endpoint = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            searchResults = data.items; // Store the search results in the global variable
            displayResults(data);
        })
        .catch(err => {
            console.error('Error fetching data:', err);
        });
}

/**
 * This Function displays the fetched data from the searchBook() function
 * @param {*} data The fetched data from the searchBook() function.
 */
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // clear previous results


    // POPULATE DROP-DOWN MENU
    PopulateBooklistDropdown(userID);
    data.items.forEach(item => {
        const bookTitle = item.volumeInfo.title;
        const bookAuthors = item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author';

        // Get book cover image
        const bookCover = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'path_to_default_image.jpg';

        // Get ISBN
            //Might make it so no repeats of the same book [i think diff types = diff isbn]
        let isbn10 = "N/A";
        if (item.volumeInfo.industryIdentifiers) 
        {
            for (let identifier of item.volumeInfo.industryIdentifiers) {
                if (identifier.type === 'ISBN_10') {
                    isbn10 = identifier.identifier;
                    break;
                }
            }
        }

        // Get preview link
        const previewLink = item.volumeInfo.previewLink;


        resultsDiv.innerHTML += `<div class="book-item">
                                    <img src="${bookCover}" alt="${bookTitle} cover" width="100">
                                    <h3>${bookTitle}</h3>
                                    <p>${bookAuthors}</p>
                                    <p>ISBN-10: ${isbn10}</p>
                                    <a href="${previewLink}" target="_blank">Preview Book</a>
                                    <button onclick="DynamicBooklistAdd(userID, '${isbn10}');">Add to Bookshelf</button>
                                    <button onclick="AddBook(userID, 'Reading', '${isbn10}')">Add to Reading List</button>
                                </div>`;
    }); 
        // Show the search results
    resultsDiv.style.display = 'grid'
}

function DynamicBooklistAdd(userID, ISBN){
    const selector = document.getElementById('slcBookLists');
    const value = selector.options[selector.selectedIndex].value;
    AddBook(userID, value, ISBN)
}

/**
 * Fetches  the user's bookshelves when the "Bookshelves" menu option is clicked, and
 * calls displayBookshelves function.
 * @param {int}
 */
function showBookshelves(userID) {
    FetchUserBookLists(userID)
        .then(bookshelves => {
            console.log(bookshelves);
            // Display the bookshelves
            displayBookshelves(bookshelves);
        })
        .catch(error => {
            console.error('Error fetching bookshelves:', error);
        });
}

/**
 * Displays the user's bookshelves in the "Bookshelves" section.
 * @param {object[]} bookshelves A collection of bookshelves for the user.
 */
function displayBookshelves(bookshelves) {


    const bookshelvesSection = document.getElementById('bookshelves-section');
    bookshelvesSection.innerHTML = ''; // clear previous results

    bookshelves.forEach(bookshelf => {
        // Display each bookshelf
        bookshelvesSection.innerHTML += `<div class="bookshelf-item">
                                            <h3>${bookshelf.BookListName}</h3>
                                            <div id=${bookshelf.BookListName}></div>
                                        </div>`;
        displayBookDetails(userID, bookshelf.BookListName, bookshelf.BookListName);
    });

    // Show the "Bookshelves" section
    bookshelvesSection.style.display = 'block';
}


// DISPLAY BOOKS FROM A BOOKLIST (DO NOT USE TWICE IN THE SAME INSTANCE)
async function displayBookDetails(userID, booklistID, target='results') {
    try {
        let books = await FetchUserBookListBooks(userID, booklistID);
        
        if (!Array.isArray(books)) {
            throw new Error('Expected an array of books');
        }

        for (let book of books) {
            // Check if the book object has an 'ISBN' property in uppercase
            if (!book || !book.ISBN) {
                console.log('Book object is missing the ISBN property or is undefined', book);
                continue; // Skip this iteration as we cannot proceed without ISBN
            }
            let isbn = book.ISBN;
            let isbnType = isbn.length === 10 ? 'ISBN-10' : isbn.length === 13 ? 'ISBN-13' : 'Unknown ISBN format';


            let bookDetails = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
                .then(response => response.json())
                .then(data => data.items ? data.items[0] : null)
                .catch(err => console.error('Error fetching book details:', err));

            // Display book details
            if (bookDetails) {
                let bookInfo = bookDetails.volumeInfo;
                let title = bookInfo.title;
                let authors = bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown';
                let description = bookInfo.description ? bookInfo.description : 'No description available';
                let bookCover = bookInfo.imageLinks && bookInfo.imageLinks.thumbnail ? bookInfo.imageLinks.thumbnail : 'default-cover.jpg';
                let previewLink = bookInfo.previewLink ? bookInfo.previewLink : '#';

                // Now, update the HTML content with these details
                let resultsDiv = document.getElementById(target);
                resultsDiv.innerHTML += `<div class="book-item">
                                            <img src="${bookCover}" alt="${title} cover" width="100">
                                            <h3>${title}</h3>
                                            <p>${authors}</p>
                                            <p>${isbnType}: ${isbn}</p>
                                            <a href="${previewLink}" target="_blank">Preview Book</a>
                                            </div>`;
            } else {
                console.log(`No details found for ISBN: ${isbn}`);
            }
        }
    } catch (error) {
        console.error('Error displaying book details:', error);
    }
}

// POPULATES DROP-DOWN MENU FOR OPTIONS
async function PopulateBooklistDropdown(userID) {
    const booklists = await FetchUserBookLists(userID);
    const dropdown = document.getElementById('slcBookLists');
    dropdown.innerHTML = '';
    booklists.forEach((booklist) => {
        const option = document.createElement('option');
        option.value = booklist.ID;
        option.textContent = booklist.BookListName; // Assuming each booklist has a 'Name' property
        dropdown.appendChild(option);
    });
}

// ADD TO BOOKSHELF FUNCTION
async function addToBookshelf(index) {
    const bookToAdd = searchResults[index]; // Use the global searchResults array
    const bookTitle = bookToAdd.volumeInfo.title;
    let isbn10 = "N/A";
    let isbn13 = "N/A";

    if (bookToAdd.volumeInfo.industryIdentifiers) {
        for (let identifier of bookToAdd.volumeInfo.industryIdentifiers) {
            if (identifier.type === 'ISBN_10') {
                isbn10 = identifier.identifier;
            } else if (identifier.type === 'ISBN_13') {
                isbn13 = identifier.identifier;
            }
        }
    }

    // Prefer ISBN-10 if available, otherwise use ISBN-13
    const isbn = isbn10 !== "N/A" ? isbn10 : isbn13;

    // GETS BOOKLIST ID FROM DROP-LIST
    const booklistID = document.getElementById('booklistDropdown').value;

    // Use the AddBook function from ServerComs.js
    try {
        await AddBook(userID, booklistID, isbn);
        userBookshelf.push(bookToAdd); // Add the selected book to the bookshelf
    } catch (err) {
        console.error('Error adding book to bookshelf:', err);
    }
}

/**
 * This Function will clear the screen and show the section chosen with by the 
 * sectionID
 * @param {*} sectionID 
 */
function showSection(sectionID)
{
    console.log(`showing section: ${sectionID}`);

    //Hide all sections
    var sections = document.getElementsByClassName('dashboard-hide');
    for(var i = 0; i < sections.length; i++)
        sections[i].style.display = 'none';

    // Hide the search results
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';


    //Show the selected section
    var selectSection = document.getElementById(sectionID);
    selectSection.style.display = 'block';
}