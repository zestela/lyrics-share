<script>

export default {
  props: {
    name: String,
    artist: String,
    coverUrl: String,
    lyrics: String,
    size: String,
    bgdColor: String
  },
  data() {
    return {
      shareBodyWidth: "100%",
      shareBodyMinHeight: "100vh"
    }
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
    }
  },
  methods: {
    applyStyle() {
      if (this.size == "0") {
        this.shareBodyWidth = "960px";
        this.shareBodyMinHeight = "540px";
      }
      else if (this.size == "1") {
        this.shareBodyWidth = "540px";
        this.shareBodyMinHeight = "960px";
      }
      else {
        this.shareBodyWidth = "400px";
        this.shareBodyMinHeight = "400px";
      }
    }
  }
}

</script>

<template>
  <div class="share-body" ref="shareBody">
    <div class="lyrics-card">
      <div class="lyrics" v-html="lyrics"></div>
    </div>
    <div class="info-card">
      <div class="info-inbox">
        <div class="texts-and-cover">
          <img class="cover-img" draggable="false" ref="coverImg" :src="coverUrl">
          <div style="margin-left: 15px;line-height: 1;">
            <div class="name-text" v-text="name"></div>
            <div class="artist-text" v-text="artist"></div>
          </div>
        </div>
        <img class="logo-img" draggable="false" src="/logo.png" alt="Lyrics Share Logo">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.share-body {
  * {
    user-select: none;
    font-family: "SourceHan" !important;
  }

  margin: 0;
  padding-top: 20px;
  padding-bottom: 20px;
  width: v-bind(shareBodyWidth);
  min-height: v-bind(shareBodyMinHeight);
  background-color: white;
  color: #311E8F;
  font-size: 17px;
  display: flex;
  flex-direction: column;
  position: relative;

  .lyrics-card {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;

    .lyrics {
      width: fit-content;
      margin-left: 30px;
      line-height: 1.4em;
    }

    white-space: break-spaces;

    * {
      margin-bottom: 0;
    }
  }

  .info-card {
    .info-inbox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cover-img {
        height: 4rem;
        border-radius: 8px;
      }

      .texts-and-cover {
        margin-left: 30px;
        display: flex;
        align-items: center;
      }

      .artist-text {
        margin-top: 2px;
        font-size: 15px;
        color: #311e8fcb;
        font-weight: lighter;
      }

      .logo-img {
        margin-right: 30px;
        height: 2rem;
        object-fit: contain;
      }
    }
  }

  .info-card::before {
    display: block;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    height: 1px;
    content: "";
    background: linear-gradient(to right, rgba(49, 30, 143, 0.08) 10%, #311E8F 50%, rgba(49, 30, 143, 0.08) 90%);
  }
}
</style>
