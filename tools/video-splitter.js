const ffmpeg = require('fluent-ffmpeg');
const { readFile, writeFile } = require('fs').promises;
const fs = require('fs');
const path = require('path');

// 生成随机视频ID
function generateVideoId() {
  return Math.random().toString(36).substring(2, 9);
}

// 关键帧切割函数
async function splitByKeyframes(inputPath, chunkSizeMB = 24) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputPath)
    command.ffprobe((err, metadata) => {
      if (err) return reject(err);
      
      const keyframes = metadata.streams[0].keyframes;
      if (!keyframes || keyframes.length === 0) return reject('未检测到关键帧');
      
      // 根据关键帧计算切割点
      resolve(keyframes.map((kf, i) => ({
        time: kf.time,
        size: chunkSizeMB * 1024 // 目标分片大小KB
      })));
    });
  });
}

// 导出切割视频模块
module.exports = {
  processVideo: async (inputPath, outputDir) => {
    const chunkSize = 24 * 1024 * 1024; // 24MB
    const videoId = generateVideoId();
    const meta = {
      id: videoId,
      title: path.basename(inputPath),
      chunks: [],
      totalChunks: ""
    };
    
    try {
      // 1. 扫描关键帧
      const cutPoints = await splitByKeyframes(inputPath);
      
      // 2. 执行切割
      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions(cutPoints.map((cp, i) => `-ss ${cp.time}`))
          .on('end', resolve)
          .on('error', reject)
          .saveToFile(`${outputDir}/chunk-${videoId}_%03d.mp4`);
      });
      
      // 3. 生成元数据
      meta.totalChunks = cutPoints.length;
      for (let i = 0; i < meta.totalChunks; i++) {
        meta.chunks.push({
          key: `chunk:${videoId}_${i}`,
          size: chunkSize
        });
      }
      
      // 4. 返回结果
      return meta;
    } catch (err) {
      console.error('视频处理失败:', err);
      throw err;
    }
  }
};