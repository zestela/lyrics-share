<script setup>
import shareView1 from "./views/shareView1.vue";
import shareView2 from "./views/shareView2.vue";
</script>

<template>
  <el-header>
    <img draggable="false" src="/logo.png" alt="" width="200px" />
  </el-header>
  <el-main>
    <div class="info-box">
      <div class="info-flexbox">
        <img draggable="false" :src="song_coverUrl" alt="cover" width="87" id="coverImg" crossorigin="anonymous" />
        <div class="info-inbox">
          <el-input v-model="song_name" placeholder="歌曲名称" class="song-name-input" />
          <el-input v-model="song_artist" placeholder="歌曲创作者" style="margin-top: -28px;" />
        </div>
      </div>
    </div>
    <div class="lyrics">
      <el-card class="lyrics-placecard" v-model="song_lyrics" v-show="!showLyricsSelector">
        请键入歌曲名称以选择歌词。
      </el-card>
      <div class="lyrics-selector-box" v-show="showLyricsSelector">
        <el-button v-for="(text, index) in lyrics_list" :key="index" @click="setLyricsSelector(index)"
          :class="isSelectedLyrics(index)">{{ text }}</el-button>
      </div>
    </div>
    <div class="select-box">
      <div class="select-inbox">
        <el-select v-model="selectedView" placeholder="海报样式" size="large" @change="$forceUpdate()"
          style="margin-right: 20px;">
          <el-option label="缤纷样式" value="shareView1" />
          <el-option label="简洁样式" value="shareView2" />
        </el-select>
        <el-select class="select-2" v-model="selectedSize" placeholder="样式大小" size="large" @change="$forceUpdate()">
          <el-option label="全屏幕大小" value="0" />
          <el-option label="手机大小" value="1" />
          <el-option label="小尺寸" value="2" />
        </el-select>
      </div>
    </div>
    <div class="generation-btn-box">
      <el-button class="generation-btn" @click="generationShare">生成</el-button>
    </div>
  </el-main>
  <el-footer>
    <div class="settings-box">
      <div class="mb-4">
        <el-button @click="showSettingsDialog = true;" type="primary" link>
          设置
        </el-button>
      </div>
    </div>
  </el-footer>
  <el-dialog v-model="showShareDialog" title="预览" @open="open()">
    <div class="preview-box">
      <img src="" alt="Preview Loading..." ref="previewImg">
    </div>
    <div class="preview-info-box">
      <el-text class="mx-1">{{ selectedText.style }}</el-text>
      <el-text class="mx-1">{{ selectedText.size }}</el-text>
    </div>
    <div class="share-btn-box">
      <el-button class="share-btn" @click="saveShare">保存</el-button>
    </div>
    <el-text class="mx-1" type="info">本页面显示的是低分辨率预览图，保存以获得高分辨率原图。<br>若预览图生成缓慢，请耐心等待。</el-text>
  </el-dialog>
  <el-dialog v-model="showSettingsDialog" title="设置">
    <div class="setting-item">
      <el-text class="mx-1">预览图生成倍数</el-text>
      <el-select v-model="selectedPreviewSize" placeholder="预览图生成倍数" size="large" @change="$forceUpdate()">
        <el-option label="0.1x" value="0.1" />
        <el-option label="0.5x" value="0.5" />
        <el-option label="1.0x" value="1.0" />
      </el-select>
    </div>
    <div class="setting-item">
      <el-text class="mx-1">保存图生成倍数</el-text>
      <el-select v-model="selectedGenerateSize" placeholder="保存图生成倍数" size="large" @change="$forceUpdate()">
        <el-option label="0.5x" value="0.5" />
        <el-option label="1.0x" value="1" />
        <el-option label="2.0x" value="2" />
        <el-option label="4.0x" value="4" />
      </el-select>
    </div>
    <div class="share-btn-box"><el-button class="share-btn" @click="saveSettings">保存</el-button></div>
  </el-dialog>
  <div class="share-box" v-show="showView">
    <component :is="selectedView" :name="song_name" :artist="song_artist" :lyrics="selectedLyrics"
      :coverUrl="song_coverUrl" :size="selectedSize" :bgdColor="bgdColor" />
  </div>
</template>

<script>
import { extractColors } from 'extract-colors';
import html2canvas from 'html2canvas';
import { converter } from '@/plugins/converter.js'

export default {
  data() {
    return {
      search_name: "",
      song_name: "",
      song_artist: "",
      song_lyrics: "",
      song_coverUrl: "./default-cover.png",
      lyrics_list: [],
      cover_color: {},
      selectedView: "shareView1",
      selectedSize: "0",
      selectedLyrics: "",
      selectedLyricsIndex: [],
      showView: false,
      showLyricsSelector: false,
      showSettingsDialog: false,
      showShareDialog: false,
      bgdColor: "",
      selectedText: {
        style: "缤纷样式",
        size: "全屏幕大小"
      },
      selectedPreviewSize: "0.5",
      selectedGenerateSize: "2"
    };
  },
  components: { shareView1, shareView2 },
  watch: {
    async song_name() { // 输入歌曲名后将歌词获取请求交给公共 converter
      if (this.song_name != "" || this.song_name != " ") {
        let data = await converter(this.song_name);
        this.song_lyrics = data.lrc;
        this.song_coverUrl = data.cover;
        this.showLyricsSelector = true;
      }
      else
        this.showLyricsSelector = false;
    },
    song_coverUrl() { // 封面链接变化时获取主题色
      let imgElement = new Image();
      imgElement.crossOrigin = 'Anonymous';
      imgElement.src = this.song_coverUrl;
      imgElement.onload = async () => {
        let imgGetter = document.createElement("canvas");
        imgGetter.getContext("2d").drawImage(imgElement, 0, 0, 1024, 1024);
        let colorLst = await extractColors(imgGetter.toDataURL("image/jpg"));
        this.bgdColor = colorLst[0].hex;
      }
    },
    song_lyrics() { // 获取到歌词后的处理
      this.lyrics_list = [];
      let data = this.song_lyrics.split(/[\n]/);
      for (let i = 0; i < data.length; i++) {
        if (data[i] != "")
          this.lyrics_list.push(data[i]);
      }
      this.selectedLyricsIndex = [];
    }
  },
  methods: {
    setLyricsSelector(index) {
      if (!this.selectedLyricsIndex.includes(index)) {
        this.selectedLyricsIndex.push(index);
      }
      else {
        this.selectedLyricsIndex = this.selectedLyricsIndex.filter(item => item !== index);
      }
    },
    async generationShare() {
      this.selectedLyrics = "";
      if (this.song_name == "" || this.song_artist == "")
        return;
      for (let i = 0; i < this.selectedLyricsIndex.length; i++) {
        this.selectedLyrics += this.lyrics_list[this.selectedLyricsIndex[i]] + "\n";
      }
      this.showShareDialog = true;
      this.showView = true;
      let selectedTextStyles = ["", "缤纷样式", "简洁样式"];
      let selectedTextSizes = ["全屏幕大小", "手机大小", "小尺寸"]
      this.selectedText.size = selectedTextSizes[this.selectedSize];
      this.selectedText.style = selectedTextStyles[this.selectedView.split("w")[1]]
    },
    saveShare() {
      html2canvas(document.getElementsByClassName("share-body")[0], { useCORS: true, scale: this.selectedGenerateSize }).then((canvas) => {
        const aLink = document.createElement('a')
        aLink.download = "Lyrics Share 生成.jpg";
        aLink.href = canvas.toDataURL('image/jpeg', 1.0);
        aLink.dispatchEvent(new MouseEvent('click', {}))
      });
    },
    open() {
      html2canvas(document.getElementsByClassName("share-body")[0], { useCORS: true, scale: this.selectedPreviewSize }).then((canvas) => {
        let img = new Image();
        img.src = canvas.toDataURL('image/jpeg', 1.0);
        this.$refs.previewImg.setAttribute("src", img.src);
      });
    },
    saveSettings() {
      localStorage.setItem('selectedGenerateSize', this.selectedGenerateSize);
      localStorage.setItem('selectedPreviewSize', this.selectedPreviewSize);
      this.showSettingsDialog = false;
    },
    isSelectedLyrics(index) {
      if (!this.selectedLyricsIndex.includes(index))
        return "lyrics-selector-unselect"
      else
        return "lyrics-selector-selected"
    }
  },
  mounted() {
    if (localStorage.getItem('selectedGenerateSize') != null && localStorage.getItem('selectedPreviewSize') != null) {
      this.selectedGenerateSize = localStorage.getItem('selectedGenerateSize');
      this.selectedPreviewSize = localStorage.getItem('selectedPreviewSize');
    }
  },
};
</script>
