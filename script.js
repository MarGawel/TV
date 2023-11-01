// Funkcja do zapisywania linku w pliku link.txt na GitHubie
function saveLink() {
    const token = document.getElementById("tokenInput").value;
    const link = document.getElementById("linkInput").value;

    if (!token || !link) {
        alert("Please enter both the token and the link.");
        return;
    }

    // Pobierz aktualną zawartość pliku link.txt
    fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME/contents/link.txt', {
        headers: {
            'Authorization': 'token ' + token
        }
    })
    .then(response => response.json())
    .then(data => {
        // Dodaj nowy link do zawartości pliku i zaktualizuj plik na GitHubie
        const currentContent = atob(data.content);
        const newContent = currentContent + "\n" + link;
        
        return fetch('https://api.github.com/repos/MArGawel/TV/contents/link.txt', {
            method: 'PUT',
            headers: {
                'Authorization': 'token ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Add new link',
                content: btoa(newContent),
                sha: data.sha
            })
        });
    })
    .then(() => {
        alert("Link saved successfully!");
        document.getElementById("linkInput").value = ""; // Clear the link input field
    })
    .catch(error => {
        console.error('There was an error saving the link:', error);
    });
}

// Funkcja do wyświetlania linków z pliku link.txt podczas ładowania strony viewlinks.html
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.endsWith("viewlinks.html")) {
        fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME/contents/link.txt')
        .then(response => response.json())
        .then(data => {
            const content = atob(data.content);
            const links = content.split('\n').filter(link => link.trim() !== ''); // Filter out any empty links
            const linkList = document.getElementById('linkList');
            linkList.innerHTML = '';

            links.forEach(link => {
                const linkElement = document.createElement('p');
                linkElement.innerText = link;
                linkList.appendChild(linkElement);
            });
        })
        .catch(error => {
            console.error('There was an error fetching the links:', error);
        });
    }
});





