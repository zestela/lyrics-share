<script>
export default {
  props: {
    name: String,
    artist: String,
    coverUrl: String,
    lyrics: String,
    size: String,
    bgdColor: String,
  },
  data() {
    return {
      shareBodyWidth: '100%',
      shareBodyMinHeight: '100vh',
      mainCardWidth: '35%',
      backgroundImageUrl: null,
      imageCache: new Map(),
      isProcessing: false,
      blurRadius: 97,
      scaleFactor: 0.1,
    };
  },
  created() {
    this.applyStyle();
  },
  mounted() {
    this.processBackgroundImage();
  },
  watch: {
    size() {
      this.applyStyle();
    },
    coverUrl() {
      this.$refs.coverImg.src = this.coverUrl;
      this.processBackgroundImage();
    },
  },
  methods: {
    applyStyle() {
      if (this.size === '0') {
        this.shareBodyWidth = '1920px';
        this.mainCardWidth = '18%';
        this.shareBodyMinHeight = '1080px';
      } else if (this.size === '1') {
        this.shareBodyWidth = '540px';
        this.mainCardWidth = '80%';
        this.shareBodyMinHeight = '960px';
      } else {
        this.shareBodyWidth = '400px';
        this.mainCardWidth = '90%';
        this.shareBodyMinHeight = '400px';
      }
    },
    
    gaussianBlur(imageData, width, height, radius) {
      const pixels = imageData.data;
      const output = new Uint8ClampedArray(pixels);
      
      const kernel = this.generateGaussianKernel(radius);
      const kernelSize = kernel.length;
      const halfKernel = Math.floor(kernelSize / 2);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let r = 0, g = 0, b = 0, a = 0;
          
          for (let i = 0; i < kernelSize; i++) {
            const sampleX = Math.min(width - 1, Math.max(0, x + i - halfKernel));
            const idx = (y * width + sampleX) * 4;
            
            r += pixels[idx] * kernel[i];
            g += pixels[idx + 1] * kernel[i];
            b += pixels[idx + 2] * kernel[i];
            a += pixels[idx + 3] * kernel[i];
          }
          
          const outputIdx = (y * width + x) * 4;
          output[outputIdx] = r;
          output[outputIdx + 1] = g;
          output[outputIdx + 2] = b;
          output[outputIdx + 3] = a;
        }
      }
      
      for (let i = 0; i < pixels.length; i++) {
        pixels[i] = output[i];
      }
      
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let r = 0, g = 0, b = 0, a = 0;
          
          for (let i = 0; i < kernelSize; i++) {
            const sampleY = Math.min(height - 1, Math.max(0, y + i - halfKernel));
            const idx = (sampleY * width + x) * 4;
            
            r += pixels[idx] * kernel[i];
            g += pixels[idx + 1] * kernel[i];
            b += pixels[idx + 2] * kernel[i];
            a += pixels[idx + 3] * kernel[i];
          }
          
          const outputIdx = (y * width + x) * 4;
          output[outputIdx] = r;
          output[outputIdx + 1] = g;
          output[outputIdx + 2] = b;
          output[outputIdx + 3] = a;
        }
      }
      
      return new ImageData(output, width, height);
    },
    
    generateGaussianKernel(radius) {
      const size = radius * 2 + 1;
      const kernel = new Array(size);
      const sigma = radius / 3;
      const twoSigmaSquare = 2 * sigma * sigma;
      let sum = 0;
      
      for (let i = 0; i < size; i++) {
        const x = i - radius;
        kernel[i] = Math.exp(-(x * x) / twoSigmaSquare);
        sum += kernel[i];
      }
      
      for (let i = 0; i < size; i++) {
        kernel[i] /= sum;
      }
      
      return kernel;
    },
    
    async processBackgroundImage() {
      if (!this.coverUrl || this.isProcessing) return;
      
      if (this.imageCache.has(this.coverUrl)) {
        this.backgroundImageUrl = this.imageCache.get(this.coverUrl);
        return;
      }
      
      this.isProcessing = true;
      
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = this.coverUrl;
        });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const scaledWidth = Math.floor(img.width * this.scaleFactor);
        const scaledHeight = Math.floor(img.height * this.scaleFactor);
        
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        
        let imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);
        
        imageData = this.gaussianBlur(imageData, scaledWidth, scaledHeight, this.blurRadius);
        
        ctx.putImageData(imageData, 0, 0);
        
        const blurredImageUrl = canvas.toDataURL('image/jpeg', 0.8);
        this.imageCache.set(this.coverUrl, blurredImageUrl);
        this.backgroundImageUrl = blurredImageUrl;
        
      } catch (error) {
        console.error('处理背景图像时出错:', error);
      } finally {
        this.isProcessing = false;
      }
    },
  },
};
</script>

<template>
  <div class="share-body" ref="shareBody">
    <div 
      v-if="backgroundImageUrl" 
      class="background-layer" 
      :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
    ></div>
    
    <div class="base-background" :style="{ backgroundColor: bgdColor }"></div>
    
    <div class="main-card" ref="mainCard">
      <div class="lyrics-card">
        <div class="lyrics" v-html="lyrics"></div>
      </div>
      <div class="info-card">
        <img class="cover-img" draggable="false" ref="coverImg" :src="coverUrl" />
        <div>
          <div class="name-text" v-text="name"></div>
          <div class="artist-text" v-text="artist"></div>
          <img class="logo-img" draggable="false" src="/view-logo-1.png" width="90" alt="Lyrics Share Logo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.share-body {
  * {
    user-select: none;
  }

  & {
    margin: 0;
    padding-top: 20px;
    padding-bottom: 20px;
    width: v-bind(shareBodyWidth);
    min-height: v-bind(shareBodyMinHeight);
    background-color: v-bind(bgdColor);
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    color: white;
    font-family: 'HarmonyOS Sans', sans-serif;
    font-weight: bold;
    font-size: 17px;
    position: relative;
    overflow: hidden;
  }
  
  .base-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  .background-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 2;
    opacity: 0.85;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.3) 0%,
        rgba(0, 0, 0, 0.1) 50%,
        rgba(0, 0, 0, 0.3) 100%
      );
    }
  }

  .main-card {
    position: relative;
    z-index: 100;
    width: v-bind(mainCardWidth);
    height: max-content;
    backdrop-filter: blur(30px);
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    overflow: hidden;

    .lyrics-card {
      .lyrics {
        line-height: 1.4em;
      }
    }

    .info-card {
      background-color: rgba(0, 0, 0, 0.4);
      margin: 0;
      padding: 20px;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
      display: flex;
      justify-content: left;
      align-items: center;

      .cover-img {
        width: 4rem;
        border-radius: 8px;
      }

      div * {
        margin-left: 15px;
      }

      .artist-text {
        margin-top: 2px;
        color: rgba(255, 255, 255, 0.85);
      }

      .logo-img {
        margin-top: -10px;
        opacity: 0.75;
        width: 90px !important;
      }
    }

    .lyrics-card {
      background-color: rgba(0, 0, 0, 0.25);
      margin: 0;
      padding: 20px;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      white-space: break-spaces;

      * {
        margin-bottom: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  .share-body {
    padding-top: 10px;
    padding-bottom: 10px;
    
    .background-layer {
      opacity: 0.8;
    }
    
    .main-card {
      width: 90% !important;
      
      .info-card {
        padding: 15px;
        
        .cover-img {
          width: 3.5rem;
        }
        
        div * {
          margin-left: 10px;
        }
      }
      
      .lyrics-card {
        padding: 15px;
        font-size: 16px;
      }
    }
  }
}

@media (max-width: 480px) {
  .share-body {
    .main-card {
      .info-card {
        .cover-img {
          width: 3rem;
        }
        
        .logo-img {
          width: 70px !important;
        }
      }
      
      .lyrics-card {
        font-size: 15px;
      }
    }
  }
}
</style>
