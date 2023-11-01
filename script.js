const owner = 'TWOJA_NAZWA_UZYTKOWNIKA';
const repo = 'NAZWA_REPOZYTORIUM';
const filename = 'link.txt';
const token = 'TWÓJ_PERSONALNY_ACCESS_TOKEN';

// Funkcja do dodawania linku
function addLink() {
    const linkInput = document.getElementById('link-input');
    const url = linkInput.value.trim();

    if (url) {
        // Pobieranie aktualnych linków
        fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filename}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const content = atob(data.content); // Dekodowanie z base64
            const newContent = content + "\n" + url; // Dodawanie nowego linku

            // Aktualizacja pliku
            fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filename}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`
                },
                body: JSON.stringify({
                    message: 'Dodano nowy link',
                    content: btoa(newContent), // Kodowanie do base64
                    sha: data.sha
                })
            })
            .then(() => {
                // Aktualizacja wyświetlania linków na stronie
                displayLinks();
            });
        });
    }

    // Wyczyść pole wprowadzania
    linkInput.value = '';
}

// Funkcja do wyświetlania linków
function displayLinks() {
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filename}`)
    .then(response => response.json())
    .then(data => {
        const content = atob(data.content); // Dekodowanie z base64
        const links = content.trim().split("\n");

        const linkContainer = document.getElementById('link-container');
        linkContainer.innerHTML = '';

        links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link;
            linkElement.target = '_blank';
            linkElement.textContent = link;
            linkContainer.appendChild(linkElement);
            linkContainer.appendChild(document.createElement('br')); // Nowa linia
        });
    });
}

// Wywołanie funkcji podczas ładowania strony
window.onload = displayLinks;
