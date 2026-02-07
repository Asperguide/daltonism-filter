// ----------------------------- Content Loading Functionality (Page-specific) ------------------------------

function loadUrl() {
    const url = document.getElementById('url-input').value;
    if (url) {
        document.getElementById('content-iframe').src = url;
        document.getElementById('content-image').style.display = 'none';
        document.getElementById('content-iframe').style.display = 'block';
    }
}

function loadFile() {
    const file = document.getElementById('file-input').files[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            // Handle as image
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('content-image').src = e.target.result;
                document.getElementById('content-iframe').style.display = 'none';
                document.getElementById('content-image').style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            // For other types, try to load in iframe
            const reader = new FileReader();
            reader.onload = (e) => {
                let blobType = file.type || 'application/octet-stream';
                const blob = new Blob([e.target.result], { type: blobType });
                const blobUrl = URL.createObjectURL(blob);
                document.getElementById('content-iframe').src = blobUrl;
                document.getElementById('content-image').style.display = 'none';
                document.getElementById('content-iframe').style.display = 'block';
            };
            if (file.type.startsWith('text/')) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        }
    }
}

function loadImage() {
    const file = document.getElementById('image-input').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('content-image').src = e.target.result;
            document.getElementById('content-iframe').style.display = 'none';
            document.getElementById('content-image').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function setContentDisplayHeight() {
    const contentDisplay = document.getElementById('content-display');
    if (contentDisplay) {
        const rect = contentDisplay.getBoundingClientRect();
        const height = window.innerHeight - rect.top - 10; // 10px margin
        contentDisplay.style.height = Math.max(height, 200) + 'px'; // minimum height
        const iframe = document.getElementById('content-iframe');
        const img = document.getElementById('content-image');
        if (iframe) iframe.style.height = '100%';
        if (img) img.style.height = '100%';
    }
}

function initializeContentLoader() {
    const loadUrlBtn = document.getElementById('load-url-btn');
    const loadFileBtn = document.getElementById('load-file-btn');
    const loadImageBtn = document.getElementById('load-image-btn');

    if (loadUrlBtn) {
        loadUrlBtn.addEventListener('click', loadUrl);
    }

    if (loadFileBtn) {
        loadFileBtn.addEventListener('click', loadFile);
    }

    if (loadImageBtn) {
        loadImageBtn.addEventListener('click', loadImage);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeContentLoader();
    setContentDisplayHeight();
});

window.addEventListener('resize', setContentDisplayHeight);

// ----------------------------- End of the code ------------------------------
