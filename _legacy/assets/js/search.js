/**
 * PULSE MANGA - Real-time Search System
 * Responsibility: Interactive Header Search & Suggestions
 * Version: Final 1.0
 */

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    
    let debounceTimer;
    let selectedIndex = -1;

    /**
     * Executes the search and renders suggestions
     */
    const performSearch = async (query) => {
        if (query.length < 2) {
            searchDropdown.style.display = 'none';
            return;
        }

        // Fetch results using the API module
        const result = await PulseAPI.getMangaList(1, query);
        const results = result.data.slice(0, 8); // Limit to 8 results per requirement

        if (results.length === 0) {
            searchDropdown.innerHTML = '<div class="search-result-item">No manga found.</div>';
        } else {
            searchDropdown.innerHTML = results.map((manga, index) => `
                <a href="manga.html?slug=${manga.slug}" class="search-result-item" data-index="${index}">
                    <img src="${manga.thumbnail || 'assets/img/placeholder.jpg'}" alt="">
                    <div class="result-info">
                        <h4>${manga.title}</h4>
                        <span class="status-badge">${manga.status || 'Ongoing'}</span>
                    </div>
                </a>
            `).join('');
        }

        searchDropdown.style.display = 'block';
        selectedIndex = -1;
    };

    /**
     * Input listener with 300ms Debounce
     */
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    /**
     * Keyboard Navigation (↑, ↓, Enter)
     */
    searchInput.addEventListener('keydown', (e) => {
        const items = searchDropdown.querySelectorAll('.search-result-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateHighlight(items);
        } else if (e.key === 'Enter') {
            if (selectedIndex > -1) {
                e.preventDefault();
                items[selectedIndex].click();
            }
        }
    });

    /**
     * Updates visual highlight for keyboard navigation
     */
    const updateHighlight = (items) => {
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.style.background = '#1e293b'; // Highlight color
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.style.background = 'transparent';
            }
        });
    };

    /**
     * Close dropdown when clicking outside
     */
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.style.display = 'none';
        }
    });

    /**
     * Focus listener to reopen if query exists
     */
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2 && searchDropdown.innerHTML !== '') {
            searchDropdown.style.display = 'block';
        }
    });
});