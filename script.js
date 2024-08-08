const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const savedQuotesContainer = document.getElementById('saved-quotes');

// Function to fetch a random quote from the API
async function getNewQuote() {
    const apiUrl = 'https://type.fit/api/quotes';
    try {
        const response = await fetch(apiUrl);
        const quotes = await response.json();
        // Select a random quote
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        
        // Clean the author field if it contains "type.fit"
        let author = randomQuote.author;
        if (author && author.includes("type.fit")) {
            author = author.replace(", type.fit", "").trim();
        }

        // Update the page content with the quote and author
        quoteText.textContent = `"${randomQuote.text}"`;
        authorText.textContent = `- ${author || 'Anonymous'}`;
    } catch (error) {
        quoteText.textContent = 'An error occurred. Please try again later.';
        authorText.textContent = '';
    }
}

// Function to save a favorite quote
function saveFavorite() {
    const quote = quoteText.textContent;
    const author = authorText.textContent;
    // Fetch existing favorites from local storage or initialize an empty array if none exist
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // Add the new favorite quote and author
    favorites.push({ quote, author });
    // Update the favorites in local storage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    // Display the updated list of saved quotes
    displaySavedQuotes();
}

// Function to display saved quotes
function displaySavedQuotes() {
    // Clear the existing quotes
    savedQuotesContainer.innerHTML = '';
    // Fetch existing favorites from local storage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach((favorite, index) => {
        const quoteElement = document.createElement('div');
        quoteElement.className = 'saved-quote';
        quoteElement.innerHTML = `
            <span>${favorite.quote} - ${favorite.author}</span>
            <button class="delete-button" onclick="deleteQuote(${index})">Delete</button>
        `;
        savedQuotesContainer.appendChild(quoteElement);
    });
}

// Function to delete a quote
function deleteQuote(index) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displaySavedQuotes();
}

// Call getNewQuote when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getNewQuote();
    displaySavedQuotes();
});
