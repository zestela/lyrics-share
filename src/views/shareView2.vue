<script setup>
defineProps({
  name: String,
  artist: String,
  coverUrl: String,
  lyrics: String
});
</script>

<template>
  <div class="share-body">
    <div class="main-card">
      <div class="lyrics-card">
        <div v-html="lyrics"></div>
      </div>
      <div class="info-card">
        <img :src="coverUrl" height="50">
        <div>
          <div v-text="name"></div>
          <div v-text="artist"></div>
        </div>
      </div>
    </div>
    <div class="logo">
      <img src="/lyrics-share-logo.png" alt="LOGO" width="200">
    </div>
  </div>
</template>

<style>
.share-body {
  margin: 0;
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(30px);
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;

  color: white;
  font-family: "HarmonyOS Sans";
}

.main-card {
  z-index: 100;
  width: 50%;
  height: max-content;
  backdrop-filter: blur(30px);
}

@media screen and (min-width: 1024px) {
  .main-card {
    width: 25%;
  }
}

.info-card {
  background-color: rgba(88, 88, 88, 0.5);
  margin: 0;
  padding: 20px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  justify-content: left;
  align-items: center;
}

.info-card img {
  border-radius: 5px;
}

.info-card div {
  margin-left: 10px;
}

.lyrics-card {
  background-color: rgba(88, 88, 88, 0.4);
  margin: 0;
  padding: 20px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  white-space: break-spaces;
}

.lyrics-card * {
  margin-bottom: 0;
}

.logo {
  padding: 10px;
  padding-bottom: 0;
  border-radius: 5px;
  position: fixed;
  left: 5px;
  bottom: 5px;
}
</style>
