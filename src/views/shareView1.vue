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
        shareBodyMinHeight: "100vh",
        mainCardWidth: "35%"
      }
    },
    created () {
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
            this.shareBodyWidth = "1920px";
            this.mainCardWidth = "35%";
            this.shareBodyMinHeight = "100vh";
          }
          else if (this.size == "1") {
            this.shareBodyWidth = "540px";
            this.mainCardWidth = "50%";
            this.shareBodyMinHeight = "960px";
          }
          else {
            this.shareBodyWidth = "400px";
            this.mainCardWidth = "80%";
            this.shareBodyMinHeight = "400px";
          }
        } 
    }
}

</script>

<template>
  <div class="share-body" ref="shareBody">
    <div class="main-card" ref="mainCard">
      <div class="lyrics-card">
        <div v-html="lyrics"></div>
      </div>
      <div class="info-card">
        <img draggable="false" ref="coverImg" :src="coverUrl">
        <div>
          <div v-text="name"></div>
          <div v-text="artist"></div>
          <img draggable="false" src="/view-logo-1.png" width="80" alt="Lyrics Share Logo">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.share-body {
  * {
    user-select: none;
  }
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
  font-family: "HarmonyOS Sans";

  .main-card {
    z-index: 100;
    width: v-bind(mainCardWidth);
    height: max-content;
    backdrop-filter: blur(30px);

    .info-card {
      background-color: rgba(88, 88, 88, 0.4);
      margin: 0;
      padding: 20px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      display: flex;
      justify-content: left;
      align-items: center;

      img {
        width: 4rem;
        border-radius: 5px;
      }

      div * {
        margin-left: 10px;
      }
    }

    .lyrics-card {
      background-color: rgba(88, 88, 88, 0.25);
      margin: 0;
      padding: 20px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      white-space: break-spaces;

      * {
        margin-bottom: 0;
      }
    }
  }
}
</style>
