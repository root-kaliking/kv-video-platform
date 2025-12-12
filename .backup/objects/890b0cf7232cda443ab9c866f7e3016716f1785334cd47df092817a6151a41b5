class KVVideoPlayer {
  constructor(videoId) {
    this.videoId = videoId;
    this.chunks = [];
    this.loadedChunks = 0;
    
    // 绑定UI元素
    this.videoElement = document.getElementById('player');
    this.progressText = document.getElementById('loading-progress');
    
    // 恢复播放位置
    const savedPosition = localStorage.getItem(`video_${videoId}_position`);
    if(savedPosition) this.videoElement.currentTime = parseFloat(savedPosition);
    
    // 监听播放位置变化
    this.videoElement.addEventListener('timeupdate', () => {
      localStorage.setItem(`video_${videoId}_position`, this.videoElement.currentTime);
    });
  }
  
  async init() {
    const res = await fetch(`api/video/${this.videoId}`);
    const meta = await res.json();
    this.totalChunks = meta.chunks.length;
    
    for (let i = 0; i < this.totalChunks; i++) {
      this.fetchChunk(i);
    }
  }

  async fetchChunk(index) {
    const res = await fetch(`api/video/${this.videoId}/chunk/${index}`);
    this.chunks[index] = await res.arrayBuffer();
    this.loadedChunks++;
    this.updateProgress();
    
    if (this.loadedChunks === this.totalChunks) {
      this.assembleVideo();
    }
  }
  
  updateProgress() {
    this.progressText.innerText = `加载中: ${this.loadedChunks}/${this.totalChunks} 个分片`;
  }
  
  assembleVideo() {
    const blob = new Blob(this.chunks, { type: 'video/mp4' });
    this.videoElement.src = URL.createObjectURL(blob);
    this.progressText.style.display = 'none';
  }
}