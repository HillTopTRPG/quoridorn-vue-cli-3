<template>
  <window-frame
    titleText="開発履歴 on Twitter   「みんなありがとう！！！！！」"
    display-property="private.display.devLogWindow"
    align="left-top"
    fixSize="385, 660"
  >
    <iframe src="./static/DevelopHistory.html"></iframe>
  </window-frame>
</template>

<script>
import WindowFrame from "../WindowFrame";
import WindowMixin from "../WindowMixin";

export default {
  mixins: [WindowMixin],
  components: {
    WindowFrame
  }
};
</script>

<style scoped lang="scss">
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
.contents {
  position: absolute;
  height: 710px;
  overflow-y: scroll;
  width: 450px;
  transform: scale(0.8) translate(-51px, -90px);
}
</style>
