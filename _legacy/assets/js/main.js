document.addEventListener('DOMContentLoaded', () => {
    PulseApp.init();
});

const PulseApp = {
    async init() {
        this.initMobileNav();
        await this.loadSlider();
        await this.loadGrid();
        await this.loadRanking();
        await this.loadGlobalComments();
        this.initSliderEvents();
    },

    initMobileNav() {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu-dropdown');
        btn?.addEventListener('click', () => menu.classList.toggle('active'));
    },

    async loadGlobalComments() {
        const grid = document.getElementById('global-comments-grid');
        const mock = [
            { user: "ReaderX", text: "Finally a fast site with no annoying ads!" },
            { user: "MangaLover", text: "The AI Quiz recommended exactly what I was looking for." }
        ];
        grid.innerHTML = mock.map(c => `
            <div style="background:var(--bg-surface); padding:15px; border-radius:8px; border-left:3px solid var(--accent-blue);">
                <p style="font-weight:bold; color:var(--accent-orange);">${c.user}</p>
                <p style="font-size:13px; margin-top:5px;">"${c.text}"</p>
            </div>
        `).join('');
    },

    async loadSlider() {
        const container = document.getElementById('hot-slider');
        const result = await PulseAPI.getMangaList(1);
        container.innerHTML = result.data.map(m => `
            <div class="slider-item" style="min-width: 160px; text-align:center;">
                <a href="manga.html?slug=${m.slug}">
                    <img src="${m.thumbnail}" style="width:100%; border-radius:8px; aspect-ratio:2/3; object-fit:cover;">
                    <h4 style="font-size:12px; margin-top:8px;">${m.title}</h4>
                    <span style="color:var(--accent-blue); font-size:11px;">CH. ${m.latest_chapter || '1'}</span>
                </a>
            </div>
        `).join('');
    },

    async loadRanking() {
        const list = document.getElementById('ranking-list');
        const trending = await PulseAPI.getTrending();
        list.innerHTML = trending.map((m, i) => `
            <div class="ranking-item">
                <span class="rank-num ${i < 3 ? 'top-3' : ''}">${i + 1}</span>
                <img src="${m.thumbnail}">
                <div class="rank-info">
                    <a href="manga.html?slug=${m.slug}"><h5 style="font-size:14px;">${m.title}</h5></a>
                    <small style="color:var(--accent-blue);">CHAPTER ${m.latest_chapter || '1'}</small>
                </div>
            </div>
        `).join('');
    },

    async loadGrid() {
        const grid = document.getElementById('latest-manga-grid');
        const result = await PulseAPI.getMangaList(1);
        grid.innerHTML = result.data.map(m => `
            <div class="manga-card">
                <a href="manga.html?slug=${m.slug}">
                    <div class="card-thumb"><img src="${m.thumbnail}" style="width:100%; aspect-ratio:2/3; border-radius:8px 8px 0 0;"></div>
                    <div class="card-body" style="padding:12px;">
                        <h3 style="font-size:14px;">${m.title}</h3>
                        <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-secondary); margin-top:8px;">
                            <span>CH. 1</span><span>9 mins ago</span>
                        </div>
                    </div>
                </a>
            </div>
        `).join('');
    },

    initSliderEvents() {
        const slider = document.getElementById('hot-slider');
        document.getElementById('slide-right')?.addEventListener('click', () => slider.scrollBy({ left: 350, behavior: 'smooth' }));
        document.getElementById('slide-left')?.addEventListener('click', () => slider.scrollBy({ left: -350, behavior: 'smooth' }));
    }
};