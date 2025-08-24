// YouTube Clone Application
class YouTubeClone {
    constructor() {
        this.videos = [];
        this.currentVideo = null;
        this.selectedFile = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.renderVideos();
    }

    setupEventListeners() {
        // Upload modal
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadModal = document.getElementById('uploadModal');
        const closeModal = document.getElementById('closeModal');
        const uploadArea = document.getElementById('uploadArea');
        const videoInput = document.getElementById('videoInput');
        const submitVideo = document.getElementById('submitVideo');

        uploadBtn.addEventListener('click', () => this.showUploadModal());
        closeModal.addEventListener('click', () => this.hideUploadModal());
        uploadArea.addEventListener('click', () => videoInput.click());
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        videoInput.addEventListener('change', (e) => this.handleVideoSelect(e));
        submitVideo.addEventListener('click', () => this.submitVideo());

        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        
        searchBtn.addEventListener('click', () => this.searchVideos());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchVideos();
            }
        });

        // Video actions
        const likeBtn = document.getElementById('likeBtn');
        const dislikeBtn = document.getElementById('dislikeBtn');
        const shareBtn = document.getElementById('shareBtn');

        likeBtn.addEventListener('click', () => this.likeVideo());
        dislikeBtn.addEventListener('click', () => this.dislikeVideo());
        shareBtn.addEventListener('click', () => this.shareVideo());

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                this.hideUploadModal();
            }
        });
    }

    loadSampleData() {
        this.videos = [
            {
                id: 1,
                title: "Amazing Nature Documentary",
                description: "Explore the wonders of wildlife in this breathtaking documentary.",
                thumbnail: "🌿",
                views: 1250,
                likes: 45,
                dislikes: 2,
                uploadDate: new Date('2024-01-15'),
                src: ""
            },
            {
                id: 2,
                title: "Cooking Masterclass",
                description: "Learn professional cooking techniques from expert chefs.",
                thumbnail: "👨‍🍳",
                views: 890,
                likes: 67,
                dislikes: 1,
                uploadDate: new Date('2024-01-20'),
                src: ""
            },
            {
                id: 3,
                title: "Tech Review: Latest Gadgets",
                description: "Comprehensive review of the newest technology products.",
                thumbnail: "📱",
                views: 2100,
                likes: 156,
                dislikes: 8,
                uploadDate: new Date('2024-01-25'),
                src: ""
            },
            {
                id: 4,
                title: "Fitness Challenge",
                description: "Join our 30-day fitness transformation challenge.",
                thumbnail: "💪",
                views: 1560,
                likes: 89,
                dislikes: 3,
                uploadDate: new Date('2024-02-01'),
                src: ""
            },
            {
                id: 5,
                title: "Music Production Tutorial",
                description: "Learn how to produce music like a professional.",
                thumbnail: "🎵",
                views: 743,
                likes: 34,
                dislikes: 1,
                uploadDate: new Date('2024-02-05'),
                src: ""
            },
            {
                id: 6,
                title: "Travel Vlog: Japan Adventure",
                description: "Join me on an incredible journey through Japan.",
                thumbnail: "🗾",
                views: 3200,
                likes: 245,
                dislikes: 12,
                uploadDate: new Date('2024-02-10'),
                src: ""
            }
        ];
    }

    renderVideos(videosToRender = this.videos) {
        const videosGrid = document.getElementById('videosGrid');
        videosGrid.innerHTML = '';

        videosToRender.forEach(video => {
            const card = this.createVideoCard(video);
            videosGrid.appendChild(card);
        });
    }

    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.addEventListener('click', () => this.playVideo(video));

        card.innerHTML = `
            <div class="video-thumbnail">
                ${video.thumbnail}
            </div>
            <div class="video-card-info">
                <h3 class="video-card-title">${video.title}</h3>
                <div class="video-card-stats">
                    ${this.formatViews(video.views)} views • ${this.formatDate(video.uploadDate)}
                </div>
            </div>
        `;

        return card;
    }

    playVideo(video) {
        this.currentVideo = video;
        
        // Show video player section
        const videoPlayerSection = document.getElementById('videoPlayerSection');
        videoPlayerSection.style.display = 'block';
        
        // Update video info
        document.getElementById('currentVideoTitle').textContent = video.title;
        document.getElementById('viewCount').textContent = this.formatViews(video.views);
        document.getElementById('likeCount').textContent = video.likes;
        document.getElementById('dislikeCount').textContent = video.dislikes;
        document.getElementById('videoDescription').innerHTML = `<p>${video.description}</p>`;

        // Set video source if available
        const mainVideo = document.getElementById('mainVideo');
        if (video.src) {
            mainVideo.src = video.src;
            mainVideo.style.display = 'block';
        } else {
            mainVideo.src = '';
            mainVideo.style.display = 'none';
        }
        
        // Increment view count
        video.views++;
        document.getElementById('viewCount').textContent = this.formatViews(video.views);
        
        // Scroll to video player
        videoPlayerSection.scrollIntoView({ behavior: 'smooth' });
        
        // Update the video grid to reflect new view count
        this.renderVideos();
    }

    showUploadModal() {
        document.getElementById('uploadModal').style.display = 'block';
    }

    hideUploadModal() {
        document.getElementById('uploadModal').style.display = 'none';
        this.resetUploadForm();
    }

    resetUploadForm() {
        document.getElementById('videoInput').value = '';
        document.getElementById('videoTitle').value = '';
        document.getElementById('videoDescription').value = '';
        document.getElementById('uploadDetails').style.display = 'none';
        document.getElementById('uploadArea').style.display = 'block';
    }

    handleDragOver(e) {
        e.preventDefault();
        e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.2)';
    }

    handleDrop(e) {
        e.preventDefault();
        e.target.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('video/')) {
            this.processVideoFile(files[0]);
        } else {
            alert('Please upload a valid video file.');
        }
    }

    handleVideoSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            this.processVideoFile(file);
        } else {
            alert('Please select a valid video file.');
        }
    }

    processVideoFile(file) {
        // Show upload details form
        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('uploadDetails').style.display = 'block';
        
        // Pre-fill title with filename
        const filename = file.name.replace(/\.[^/.]+$/, "");
        document.getElementById('videoTitle').value = filename;
        
        this.selectedFile = file;
    }

    submitVideo() {
        const title = document.getElementById('videoTitle').value.trim();
        const description = document.getElementById('videoDescription').value.trim();
        
        if (!title || !this.selectedFile) {
            alert('Please provide a title and select a video file.');
            return;
        }

        // Create a URL for the uploaded video
        const videoURL = URL.createObjectURL(this.selectedFile);

        // Create new video object
        const newVideo = {
            id: this.videos.length + 1,
            title,
            description,
            thumbnail: "🎬",
            views: 0,
            likes: 0,
            dislikes: 0,
            uploadDate: new Date(),
            src: videoURL
        };

        this.videos.unshift(newVideo);
        this.renderVideos();
        this.hideUploadModal();
    }

    searchVideos() {
        const query = document.getElementById('searchInput').value.trim().toLowerCase();
        if (!query) {
            this.renderVideos();
            return;
        }
        const filtered = this.videos.filter(video =>
            video.title.toLowerCase().includes(query) ||
            video.description.toLowerCase().includes(query)
        );
        this.renderVideos(filtered);
    }

    likeVideo() {
        if (!this.currentVideo) return;
        this.currentVideo.likes++;
        document.getElementById('likeCount').textContent = this.currentVideo.likes;
    }

    dislikeVideo() {
        if (!this.currentVideo) return;
        this.currentVideo.dislikes++;
        document.getElementById('dislikeCount').textContent = this.currentVideo.dislikes;
    }

    shareVideo() {
        if (!this.currentVideo) return;
        const shareText = `Check out this video: ${this.currentVideo.title}`;
        if (navigator.share) {
            navigator.share({
                title: this.currentVideo.title,
                text: shareText,
                url: window.location.href
            });
        } else {
            alert('Share functionality is not supported in this browser.');
        }
    }

    formatViews(views) {
        if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        }
        return views;
    }

    formatDate(date) {
        return date.toLocaleDateString();
    }
}

// Instantiate the app after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new YouTubeClone();
});