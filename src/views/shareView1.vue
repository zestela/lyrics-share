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
    };
  },
  created() {
    this.applyStyle();
  },
  watch: {
    size() {
      this.applyStyle();
    },
    coverUrl() {
      this.$refs.coverImg.src = this.coverUrl;
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
  },
};
</script>

<template>
  <div class="share-body" ref="shareBody">
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
  }

  .main-card {
    z-index: 100;
    width: v-bind(mainCardWidth);
    height: max-content;
    backdrop-filter: blur(30px);

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
</style>