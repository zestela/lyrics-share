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
            this.mainCardWidth = "18%";
            this.shareBodyMinHeight = "1080px";
          }
          else if (this.size == "1") {
            this.shareBodyWidth = "540px";
            this.mainCardWidth = "80%";
            this.shareBodyMinHeight = "960px";
          }
          else {
            this.shareBodyWidth = "400px";
            this.mainCardWidth = "90%";
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
        <div class="lyrics" v-html="lyrics"></div>
      </div>
      <div class="info-card">
        <img class="cover-img" draggable="false" ref="coverImg" :src="coverUrl">
        <div>
          <div class="name-text" v-text="name"></div>
          <div class="artist-text" v-text="artist"></div>
          <img class="logo-img" draggable="false" src="/view-logo-1.png" width="90" alt="Lyrics Share Logo">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
</style>
