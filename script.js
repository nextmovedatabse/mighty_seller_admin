const IMGUR_CLIENT_ID = '121d3230a99f972';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgeSEtV-z2wN-OtTqvJjHn1ntqbFTTZKOPkqSb1OJ9cwD3u68sOFko_e6wQURWqUKoQw/exec';

document.getElementById('youtubeId').addEventListener('input', function() {
    const videoId = this.value;
    if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        document.getElementById('youtubePreview').innerHTML = `
            <iframe width="280" height="157" 
                    src="${embedUrl}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>`;
    }
});

function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(previewId).src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

document.getElementById('thumbnail').addEventListener('change', function() {
    previewImage(this, 'thumbnailPreview');
});

document.getElementById('image').addEventListener('change', function() {
    previewImage(this, 'imagePreview');
});

async function uploadToImgur(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formData
    });
    const data = await response.json();
    return data.data.link;
}

document.getElementById('contentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = 'Uploading...';

    try {
        const thumbnailUrl = await uploadToImgur(document.getElementById('thumbnail').files[0]);
        const imageUrl = await uploadToImgur(document.getElementById('image').files[0]);

        const formData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            youtubeId: document.getElementById('youtubeId').value,
            thumbnailUrl: thumbnailUrl,
            imageUrl: imageUrl,
            number: document.getElementById('number').value
        };

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            messageDiv.innerHTML = '<div class="success">Data submitted successfully!</div>';
            this.reset();
            document.getElementById('thumbnailPreview').src = '';
            document.getElementById('imagePreview').src = '';
            document.getElementById('youtubePreview').innerHTML = '';
        } else {
            throw new Error('Failed to submit to Google Sheets');
        }
    } catch (error) {
        messageDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
});
