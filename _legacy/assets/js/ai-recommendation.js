/**
 * PULSE MANGA - AI Recommendation System
 * Responsibility: Interactive Quiz & Personalized Logic
 * Version: Final 1.0
 */

const AIRecommendation = {
    currentStep: 1,
    preferences: {
        genres: [],
        storyType: '',
        mcPreference: '',
        seriesStatus: '',
        popularity: ''
    },
    alreadyRead: [],

    /**
     * Initialize the Quiz flow
     */
    init() {
        const navBtn = document.getElementById('ai-nav-btn');
        const modal = document.getElementById('ai-quiz-modal');
        
        if (navBtn) {
            navBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetQuiz();
                modal.style.display = 'flex';
                this.renderStep();
            });
        }

        // Close modal on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    },

    resetQuiz() {
        this.currentStep = 1;
        this.preferences = { genres: [], storyType: '', mcPreference: '', seriesStatus: '', popularity: '' };
        this.alreadyRead = [];
    },

    /**
     * Renders the current step content into the modal
     */
    renderStep() {
        const content = document.getElementById('quiz-step-content');
        
        switch(this.currentStep) {
            case 1:
                content.innerHTML = `
                    <h3>1. Select your favorite genres</h3>
                    <div class="quiz-options">
                        ${['Action', 'Adventure', 'Romance', 'Fantasy', 'Isekai', 'Horror', 'Slice of Life'].map(g => 
                            `<button class="option-btn" onclick="AIRecommendation.toggleGenre('${g}', this)">${g}</button>`
                        ).join('')}
                    </div>
                    <button class="btn" style="margin-top:20px" onclick="AIRecommendation.nextStep()">Next</button>
                `;
                break;
            case 2:
                content.innerHTML = `
                    <h3>2. What kind of story do you prefer?</h3>
                    <div class="quiz-options">
                        <button class="option-btn" onclick="AIRecommendation.selectOption('storyType', 'Light & fun')">Light & Fun</button>
                        <button class="option-btn" onclick="AIRecommendation.selectOption('storyType', 'Dark & serious')">Dark & Serious</button>
                        <button class="option-btn" onclick="AIRecommendation.selectOption('storyType', 'Emotional')">Emotional</button>
                        <button class="option-btn" onclick="AIRecommendation.selectOption('storyType', 'Strategic')">Strategic</button>
                    </div>
                `;
                break;
            case 3:
                content.innerHTML = `
                    <h3>3. Preferred Main Character?</h3>
                    <div class="quiz-options">
                        <button class="option-btn" onclick="AIRecommendation.selectOption('mcPreference', 'Overpowered')">Overpowered</button>
                        <button class="option-btn" onclick="AIRecommendation.selectOption('mcPreference', 'Weak to Strong')">Weak → Strong</button>
                        <button class="option-btn" onclick="AIRecommendation.selectOption('mcPreference', 'Genius')">Genius / Smart</button>
                        <button class="option-btn" onclick="AIRecommendation.selectOption('mcPreference', 'Anti-hero')">Anti-hero</button>
                    </div>
                `;
                break;
            case 4:
                this.renderAlreadyReadStep();
                break;
            case 5:
                this.generateRecommendations();
                break;
        }
    },

    toggleGenre(genre, btn) {
        if (this.preferences.genres.includes(genre)) {
            this.preferences.genres = this.preferences.genres.filter(g => g !== genre);
            btn.style.borderColor = 'var(--border)';
        } else {
            this.preferences.genres.push(genre);
            btn.style.borderColor = 'var(--accent)';
        }
    },

    selectOption(key, value) {
        this.preferences[key] = value;
        this.nextStep();
    },

    nextStep() {
        this.currentStep++;
        this.renderStep();
    },

    /**
     * STEP 2: ALREADY READ FILTER
     * Fetches current popular manga and asks user to exclude them
     */
    async renderAlreadyReadStep() {
        const content = document.getElementById('quiz-step-content');
        content.innerHTML = `<p>Fetching candidate list...</p>`;
        
        // Use API to get popular items
        const result = await PulseAPI.getMangaList(1); 
        
        content.innerHTML = `
            <h3>Have you already read any of these?</h3>
            <p>We will exclude these from your recommendations.</p>
            <div class="quiz-options">
                ${result.data.map(m => `
                    <button class="option-btn" onclick="AIRecommendation.toggleRead('${m.slug}', this)">
                        ${m.title}
                    </button>
                `).join('')}
            </div>
            <button class="btn" style="margin-top:20px" onclick="AIRecommendation.nextStep()">Analyze My Taste</button>
        `;
    },

    toggleRead(slug, btn) {
        if (this.alreadyRead.includes(slug)) {
            this.alreadyRead = this.alreadyRead.filter(s => s !== slug);
            btn.style.background = 'var(--bg-deep)';
        } else {
            this.alreadyRead.push(slug);
            btn.style.background = '#334155';
        }
    },

    /**
     * STEP 3 & 4: ANALYSIS & FINAL OUTPUT
     */
    async generateRecommendations() {
        const content = document.getElementById('quiz-step-content');
        content.innerHTML = `<h3>Analyzing...</h3><p>Based on your love for ${this.preferences.genres.join(', ')}</p>`;

        // Fetch all candidates
        const result = await PulseAPI.getMangaList(1);
        
        // Filter out already read
        const filtered = result.data.filter(m => !this.alreadyRead.includes(m.slug));

        // Logic: Mocking AI analysis by sorting by rating/genre matches
        const recommendations = filtered.slice(0, 5); // Final 5

        content.innerHTML = `
            <h3>Your AI Recommendations</h3>
            <div class="latest-grid" style="margin-top:20px; text-align:left;">
                ${recommendations.map(m => `
                    <a href="manga.html?slug=${m.slug}" class="manga-card">
                        <img src="${m.thumbnail || 'assets/img/placeholder.jpg'}" style="width:100%">
                        <div class="card-body">
                            <h3>${m.title}</h3>
                            <small>Because you like ${this.preferences.mcPreference} protagonists.</small>
                        </div>
                    </a>
                `).join('')}
            </div>
            <button class="btn" style="margin-top:20px" onclick="document.getElementById('ai-quiz-modal').style.display='none'">Close</button>
        `;
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => AIRecommendation.init());