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
                                <button onclick="AddBook(userID, booklistID, ${isbn10})">Add to Bookshelf</button>
                                <button onclick="AddBook(userID, 'Reading', ${isbn10})">Add to Reading List</button>
                            </div>`;
    });

        // Show the search results
    resultsDiv.style.display = 'grid'
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
                                            <h3>${bookshelf.name}</h3>
                                            <!-- Add other bookshelf details as needed -->
                                        </div>`;
    });

    // Show the "Bookshelves" section
    bookshelvesSection.style.display = 'block';
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
    resultsDiv.style.display = 'none';


    //Show the selected section
    var selectSection = document.getElementById(sectionID);
    selectSection.style.display = 'block';
}