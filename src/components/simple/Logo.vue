<template>
  <div class="logo-container">
    <div class="img-container">
      <img class="mascot-left" src="http://mihikari.sakura.ne.jp/quoridorn/official/img/mascot/normal/mascot_normal.png" @contextmenu.prevent>
      <img class="logo" src="../../assets/logo/bg_white_4c.svg" @contextmenu.prevent>
      <img class="mascot-right" src="http://mihikari.sakura.ne.jp/quoridorn/official/img/mascot/teach/mascot_teach.png" @contextmenu.prevent>
    </div>
    <div class="version">Ver.{{version}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component({})
export default class Logo extends Vue {
  @Getter("version") private version: any;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../common.scss";

.logo-container {
  @include flex-box(column, center, flex-start);
  padding: 0.8em 0;
  font-size: 16px;
  pointer-events: none;
  overflow: hidden;

  > div {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
  }
}

.img-container {
  @include flex-box(row, center, flex-end);
  position: relative;
  padding: 0 6em;

  .mascot-left,
  .mascot-right {
    position: absolute;
    top: 0;
    height: 6rem;
    width: 6rem;
    z-index: 0;
  }

  .mascot-left {
    left: 0;
  }

  .logo {
    z-index: 1;
    height: 3.4rem;
  }

  .mascot-right {
    right: 0;
    transform: scale(-1, 1);
  }
}

.version {
  @include flex-box(row, center, flex-end);
  height: 2.6rem;
  font-size: 1rem;
  line-height: 1rem;
}
</style>
