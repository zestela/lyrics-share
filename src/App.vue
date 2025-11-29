<script setup>
import shareView1 from "./views/shareView1.vue";
import shareView2 from "./views/shareView2.vue";
import { Edit, Plus } from '@element-plus/icons-vue';
</script>

<template>
  <el-header>
    <img draggable="false" src="/logo.png" alt="" width="200px" />
  </el-header>
  <el-main>
    <div class="search-box">
      <el-input v-model="search_name" placeholder="输入想要分享的歌曲名称..." @keyup.enter="search_song">
        <template #append><el-button @click="search_song">搜索</el-button></template>
      </el-input>
      <el-card id="search_suggestions" v-show="showSuggestions">
        <el-button v-for="(content, index) in song_list" :key="index" @click="setInfo(index)">{{ content.name + " - " +
          content.artist }}</el-button>
      </el-card>
    </div>
    <div class="manual-input-btn-box">
      <el-button type="primary" @click="showManualInputModal = true" class="manual-input-btn">
        <el-icon>
          <Edit />
        </el-icon>
        手动输入歌词
      </el-button>
    </div>
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
      <el-button class="generation-btn" @click="generationShare" :disabled="selectedLyricsIndex.length == 0">生成</el-button>
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

  <el-dialog v-model="showManualInputModal" title="手动输入歌词" width="600px" class="manual-input-modal"
    :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="manual-input-section">
      <el-text class="section-title">歌词内容</el-text>
      <el-text type="info" class="input-tip">请输入完整的歌词内容，每行一句</el-text>
      <el-input v-model="manualLyrics" type="textarea" :rows="8" placeholder="请输入歌词内容..." maxlength="2000"
        show-word-limit resize="none" class="lyrics-textarea" />
    </div>
    <div class="manual-input-section">
      <el-text class="section-title">歌曲封面</el-text>
      <div class="cover-upload-area">
        <el-upload ref="coverUpload" class="cover-upload" action="#" :auto-upload="false" :show-file-list="false"
          :on-change="handleCoverChange" accept="image/jpeg,image/png,image/jpg">
          <div v-if="manualCoverPreview" class="cover-preview">
            <img :src="manualCoverPreview" alt="封面预览" class="cover-image" />
            <div class="cover-overlay">
              <span>更换封面</span>
            </div>
          </div>
          <div v-else class="cover-upload-placeholder">
            <el-icon>
              <Plus />
            </el-icon>
            <span>上传封面图片</span>
          </div>
        </el-upload>
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleManualInputCancel">取消</el-button>
        <el-button type="primary" @click="handleManualInputConfirm" :disabled="!isManualInputValid"
          :loading="isConfirmLoading">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="share-box" v-show="showView">
    <component :is="selectedView" :name="song_name" :artist="song_artist" :lyrics="selectedLyrics"
      :coverUrl="song_coverUrl" :size="selectedSize" :bgdColor="bgdColor" />
  </div>
</template>

<script>
import { extractColors } from 'extract-colors';
import html2canvas from 'html2canvas';
import { converter, search, cover } from '@/plugins/converter.js'

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
      showSuggestions: false,
      bgdColor: "",
      selectedText: {
        style: "缤纷样式",
        size: "全屏幕大小"
      },
      selectedPreviewSize: "0.5",
      selectedGenerateSize: "2",
      song_list: [],

      // 手动输入模态框相关数据
      showManualInputModal: false,
      manualLyrics: "",
      manualCoverFile: null,
      manualCoverPreview: "",
      isConfirmLoading: false,
    };
  },
  components: { shareView1, shareView2 },
  watch: {
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
      if (this.lyrics_list[this.lyrics_list.length - 1] == " ")
        this.lyrics_list.pop();
      this.selectedLyricsIndex = [];
    }
  },
  computed: {
    isManualInputValid() {
      return this.manualLyrics.trim() !== '';
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
    },

    handleManualInputCancel() {
      this.manualLyrics = "";
      this.manualCoverFile = null;
      this.manualCoverPreview = "";
      this.showManualInputModal = false;
      if (this.manualCoverPreview) {
        URL.revokeObjectURL(this.manualCoverPreview);
      }
    },
    async handleManualInputConfirm() {
      try {
        this.song_lyrics = this.manualLyrics;

        if (this.manualCoverFile) {
          try {
            if (!this.manualCoverFile.type.startsWith('image/')) {
              throw new Error('无效的图片文件类型');
            }
            if (this.manualCoverFile.size > 5 * 1024 * 1024) {
              throw new Error('图片文件大小超过5MB限制');
            }

            this.song_coverUrl = URL.createObjectURL(this.manualCoverFile);
          } catch (coverError) {
            console.warn('封面图片处理失败，使用默认封面:', coverError);
            this.song_coverUrl = "./default-cover.png";
            alert('封面图片处理失败，已使用默认封面');
          }
        } else {
          this.song_coverUrl = "./default-cover.png";
        }

        this.showLyricsSelector = true;
        this.showManualInputModal = false;
        this.handleManualInputCancel();
      } catch (error) {
        console.error("手动输入确认失败:", error);
        if (error.message.includes('数据验证失败')) {
          alert('数据验证失败，请检查输入内容');
        } else if (error.message.includes('图片文件')) {
          alert('图片文件处理失败，请重新上传');
        } else {
          alert('数据传递失败，请重试');
        }
      }
    },

    handleCoverChange(file) {
      const isImage = file.raw.type.startsWith('image/');
      if (!isImage) {
        alert('只能上传图片文件!');
        return false;
      }
      this.manualCoverFile = file.raw;
      this.manualCoverPreview = URL.createObjectURL(file.raw);
      return false;
    },
    async search_song() {
      if (this.search_name == "")
        return;
      this.showTip = false;
      this.song_list = [];
      const response = await search(this.search_name);
      const resLength = response.length <= 10 ? response.length : 10;
      for (let i = 0; i < resLength; i++)
        this.song_list.push({
          name: response[i].name,
          artist: response[i].artistName,
          id: response[i].id,
          cover: response[i].cover
        });
      if (response.length == 0) {
        this.song_list.push({
          name: "暂无搜索结果",
          artist: "请尝试使用手动添加歌词",
          id: -1,
          cover: ""
        });
      }
      this.showSuggestions = true;
    },
    async setInfo(index) {
      if (document.documentElement.clientWidth > 600)
        this.showTip = true;
      this.showMainUI = true;
      this.song_name = this.song_list[index].name;
      this.song_lyrics = await converter(this.song_list[index].id);
      this.song_coverUrl = await cover(this.song_list[index].name, this.song_list[index].artist);
      this.song_artist = this.song_list[index].artist;
      this.showSuggestions = false;
      this.showLyricsSelector = true;
    },
  },
  mounted() {
    if (localStorage.getItem('selectedGenerateSize') != null && localStorage.getItem('selectedPreviewSize') != null) {
      this.selectedGenerateSize = localStorage.getItem('selectedGenerateSize');
      this.selectedPreviewSize = localStorage.getItem('selectedPreviewSize');
    }
  },
};
</script>
