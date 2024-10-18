function loadEnv() {
    const env = {};
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './.env', false);
    xhr.send();
    
    if (xhr.status === 200) {
        const lines = xhr.responseText.split('\n');
        lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                env[key.trim()] = value.trim();
            }
        });
    }

    return env;
}

// Load environment variables
const env = loadEnv();
window.env = env; // Make it accessible globally
    