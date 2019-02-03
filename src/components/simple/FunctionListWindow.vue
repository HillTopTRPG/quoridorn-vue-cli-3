<template>
  <WindowFrame titleText="現時点の仕様" display-property="private.display.functionListWindow" align="center" fixSize="500, 400">
    <iframe src="./static/FunctionList.html"></iframe>
  </WindowFrame>
</template>

<script>
import WindowFrame from "../WindowFrame";
import WindowMixin from "../WindowMixin";

export default {
  mixins: [WindowMixin],
  components: { WindowFrame: WindowFrame }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
