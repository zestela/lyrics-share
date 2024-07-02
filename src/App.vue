<script setup>
import shareView1 from "./views/shareView1.vue";
import shareView2 from "./views/shareView2.vue";
</script>

<template>
  <el-header>
    <img src="/logo.png" alt="" width="254" />
  </el-header>
  <el-main>
    <div class="search-box">
      <el-input v-model="search_name" placeholder="请输入想分享的歌曲名称...">
        <template #append><el-button @click="search_song">搜索</el-button></template>
      </el-input>
      <el-card id="search_suggestions" v-show="showSuggestions">
        <el-button v-for="(content, index) in song_list" :key="index" @click="setInfo(index)">{{ content.name + " " +
          content.artist }}</el-button>
      </el-card>
    </div>
    <div class="info-box">
      <div class="info-flexbox">
        <img :src="song_coverUrl" alt="cover" width="87" id="coverImg" crossorigin="anonymous" />
        <div class="info-inbox">
          <el-input v-model="song_name" placeholder="歌曲名称" class="song-name-input" />
          <el-input v-model="song_artist" placeholder="歌曲创作者" style="margin-top: -28px;" />
        </div>
      </div>
    </div>
    <el-input v-model="song_lyrics" rows="15" type="textarea" placeholder="歌曲歌词" class="lyrics-input" />
    <div class="select-box">
      <div class="select-inbox">
        <el-select v-model="selectedView" placeholder="海报样式" size="large" @change="$forceUpdate()"
          style="margin-right: 20px;">
          <el-option label="样式1" value="shareView1" />
          <el-option label="样式2" value="shareView2" />
        </el-select>
        <el-select v-model="selectedSize" placeholder="样式大小" size="large" @change="$forceUpdate()">
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
  <el-dialog v-model="showShareDialog" title="预览" width="30%" @open="open()">
    <div class="preview-box">
      <img src="" alt="Preview Loading..." ref="previewImg">
    </div>
    <div class="share-btn-box">
      <el-button class="share-btn" @click="saveShare">保存</el-button>
    </div>
    <el-text class="mx-1" type="info">本页面显示的是低分辨率预览图，保存以获得高分辨率原图。<br>若预览图生成缓慢，请耐心等待。</el-text>
  </el-dialog>
  <div class="share-box" v-show="showView">
    <component :is="selectedView" :name="song_name" :artist="song_artist" :lyrics="song_lyrics"
  :coverUrl="song_coverUrl" :size="selectedSize" :bgdColor="bgdColor" />
  </div>
</template>

<script>
import { extractColors } from 'extract-colors';
import html2canvas from 'html2canvas';

async function getJSON(url) {
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log("Request Failed", error);
  }
}

export default {
  data() {
    return {
      search_name: "",
      song_name: "",
      song_artist: "",
      song_lyrics: "",
      song_coverUrl: "./default-cover.png",
      song_list: [],
      cover_color: {},
      selectedView: "shareView1",
      selectedSize: "0",
      showView: false,
      showSuggestions: false,
      showShareDialog: false,
      api_url: "https://music.cyrilstudio.top",
      bgdColor: ""
    };
  },
  components: { shareView1,shareView2 },
  watch: {
    song_coverUrl() {
      let imgElement = new Image();
      imgElement.crossOrigin = 'Anonymous';
      imgElement.src = this.song_coverUrl;
      imgElement.onload = async () => {
        let imgGetter = document.createElement("canvas");
        imgGetter.getContext("2d").drawImage(imgElement, 0, 0, 1024, 1024);
        let colorLst = await extractColors(imgGetter.toDataURL("image/jpg"));
        this.bgdColor = colorLst[0].hex;
      }
    }
  },
  methods: {
    async search_song() {
      this.song_list = this.song_list.slice(0, 0);
      let response = await getJSON(
        this.api_url + "/search?keywords=" + this.search_name
      );
      if (response.result.songCount < 10)
        response = response.result.songs.slice(0, response.result.songCount);
      else response = response.result.songs.slice(0, 10);
      for (let i = 0; i < response.length; i++)
        this.song_list.push({
          name: response[i].name,
          artist: response[i].artists[0].name,
          id: response[i].id,
        });
      this.showSuggestions = true;
    },
    async setInfo(index) {
      this.song_name = this.song_list[index].name;
      let response = await getJSON(
        this.api_url + "/lyric?id=" + this.song_list[index].id
      );
      this.song_lyrics = response.lrc.lyric.replace(/\[(.*?)\]/g, "");
      response = await getJSON(
        this.api_url + "/song/detail?ids=" + this.song_list[index].id
      );
      this.song_coverUrl = response.songs[0].al.picUrl;
      this.song_artist = this.song_list[index].artist;
      this.showSuggestions = false;
    },
    async generationShare() {
      this.showShareDialog = true;
      this.showView = true;
    },
    saveShare() {
      html2canvas(document.getElementsByClassName("share-body")[0], { useCORS: true, scale: 2 }).then((canvas) => {
        let img = new Image();
        img.src = canvas.toDataURL('image/jpeg', 1.0);
        window.open('', '_blank').document.write(img.outerHTML);
      });
    },
    open() {
      html2canvas(document.getElementsByClassName("share-body")[0], { useCORS: true, scale: 0.5 }).then((canvas) => {
        let img = new Image();
        img.src = canvas.toDataURL('image/jpeg', 1.0);
        this.$refs.previewImg.setAttribute("src", img.src);
      });
    }
  },
  mounted() { },
};
</script>
