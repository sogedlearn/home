// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        let html = await response.text();

        const path = window.location.pathname;
        const isPagesFolder = path.includes('/pages/') || window.location.href.includes('/pages/');
        const isAuthPage = path.includes('/auth/') || window.location.href.includes('/auth/');
        const isCoursesFolder = path.includes('/courses/') || window.location.href.includes('/courses/');
        const isDashboardPage = path.includes('/dashboard/') || window.location.href.includes('/dashboard/');
        const isSubfolder = isPagesFolder || isAuthPage || isCoursesFolder || isDashboardPage;

        if (elementId === 'footer-component') {
            if (isSubfolder) {
                html = html.replace(/href="(?!https?:|#|mailto:|tel:|\.\.\/)([^"]+\.html[^"]*)"/g, 'href="../$1"');
            } else {
                html = html.replace(/href="\.\.\/css\/footer\.css"/g, 'href="css/footer.css"');
                html = html.replace(/src="\.\.\/Multimedia/g, 'src="Multimedia');
            }
        }

        const container = document.getElementById(elementId);
        container.innerHTML = html;

        container.querySelectorAll('script').forEach(function (oldScript) {
            const newScript = document.createElement('script');
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
            oldScript.remove();
        });
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on
    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('register.html');
            const isDashboardPage = path.includes('dashboard.html') || path.includes('dashboard-new.html') || path.includes('learning-hub.html');
    const isPagesFolder = path.includes('/pages/') || window.location.href.includes('/pages/');
    const isCoursesFolder = path.includes('/courses/') || window.location.href.includes('/courses/');
    
    // Determine the base path for components
    let basePath = '';
    if (isPagesFolder || isAuthPage || isDashboardPage || isCoursesFolder) {
        basePath = '../components/';
    } else {
        basePath = 'components/';
    }

    if (isAuthPage) {
        // Load auth header for login and register pages
        loadComponent('auth-header-component', basePath + 'auth-header.html');
    } else if (isDashboardPage) {
        // Load dashboard header for dashboard page
        loadComponent('header-component', basePath + 'dashboard-header.html');
    } else {
        // Load regular header and footer for other pages
        // Use Web Component header.js for non-logged users
        const headerScript = document.createElement('script');
        headerScript.src = basePath + 'header.js';
        document.head.appendChild(headerScript);
        
        // Add the Web Component to the page
        const headerElement = document.createElement('soged-header');
        document.getElementById('header-component').appendChild(headerElement);
        
        loadComponent('footer-component', basePath + 'footer.html');
    }
});

 