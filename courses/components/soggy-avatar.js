/**
 * SoggyAvatar — fixed cultural guide mascot (top-right)
 */
class SoggyAvatar extends HTMLElement {
    connectedCallback() {
        const src = localStorage.getItem('soggyAvatar')
            || localStorage.getItem('guna_profile_avatar')
            || '../Images/Soged/Newturttle.png';
        this.innerHTML = `
            <div class="soggy-avatar-wrap" title="Soggy — your cultural guide" role="img" aria-label="Soggy avatar">
                <img src="${src}" alt="Soggy">
            </div>
        `;
    }
}

customElements.define('soggy-avatar', SoggyAvatar);
