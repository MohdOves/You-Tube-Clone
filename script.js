const apiKey = ''; 
const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
let nextPageToken = '';

function searchVideos(loadMore = false) {
    const query = document.getElementById('searchQuery').value; 
    const url = `${apiUrl}?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&type=video&maxResults=5&pageToken=${loadMore ? nextPageToken : ''}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.items || data.items.length === 0) {
                document.getElementById('results').innerHTML = '<p>No results found.</p>';
                document.getElementById('loadMoreButton').style.display = 'none';
                return;
            }

            displayResults(data.items, loadMore); 
            nextPageToken = data.nextPageToken || ''; 
            document.getElementById('loadMoreButton').style.display = nextPageToken ? 'block' : 'none'; 
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('results').innerHTML = '<p style="color: red;">Error fetching data. Try again.</p>';
        });
}


function displayResults(items, loadMore) {
    const resultsContainer = document.getElementById('results');

    
    if (!loadMore) {
        resultsContainer.innerHTML = '';
    }

    items.forEach(item => {
        const videoId = item.id.videoId; 
        const title = item.snippet.title;
        const thumbnail = item.snippet.thumbnails.high.url; 
        const channelName = item.snippet.channelTitle; 

        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.innerHTML = `
            <h3>${title}</h3>
            <p><strong>Channel:</strong> ${channelName}</p>
            <img src="${thumbnail}" alt="${title}" onclick="playVideo('${videoId}')">
        `;
        resultsContainer.appendChild(videoItem);
    });
}


function playVideo(videoId) {
    document.getElementById('results').innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    `;

    document.getElementById('search-section').style.display = 'none';
    document.getElementById('returnButton').style.display = 'block'; 
    document.getElementById('loadMoreButton').style.display = 'none'; 
}


function returnToSearch() {
    document.getElementById('results').innerHTML = ''; 
    document.getElementById('search-section').style.display = 'block'; 
    document.getElementById('returnButton').style.display = 'none'; 
    document.getElementById('loadMoreButton').style.display = 'none'; 
}


function loadMoreVideos() {
    searchVideos(true); 
}


document.getElementById('themeButton').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    document.getElementById('themeButton').innerText = isLightMode ? 'Dark Mode' : 'Light Mode';
});

