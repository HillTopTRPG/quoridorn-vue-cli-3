<template>
  <div class="masterVolumeComponent" @contextmenu.prevent>
    <div class="attrArea">
      <span class="title" title="すべてのBGMの再生音量を割合で補正します">【マスターボリューム】</span>
    </div>
    <div class="controlArea">
      <volume-component
        :initVolume="0.5"
        @mute="mute"
        @volume="volume"
        ref="volumeComponent"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import VolumeComponent from "@/components/music/component/VolumeComponent.vue";

@Component({
  components: {
    VolumeComponent
  }
})
export default class MasterVolumeComponent extends Vue {
  /** Vuexの action への参照 */
  @Action("setProperty") private setProperty: any;
  /** Vuexの getter への参照 */
  @Getter("masterMute") private masterMute: any;
  @Getter("masterVolume") private masterVolume: any;

  /**
   * ライフサイクルメソッド
   */
  mounted(this: any): void {
    this.$refs.volumeComponent.setMute(this.masterMute);
    this.$refs.volumeComponent.setVolume(this.masterVolume);
  }

  /**
   * マスターミュートを設定する
   * @param mute
   */
  mute(this: any, mute: boolean): void {
    this.$refs.volumeComponent.setMute(mute);
    this.setProperty({
      property: `private.display.jukeboxWindow.masterMute`,
      value: mute,
      logOff: true
    });
  }

  /**
   * マスターボリュームを設定する
   * @param volume
   */
  volume(this: any, volume: number): void {
    this.$refs.volumeComponent.setVolume(volume);
    this.setProperty({
      property: `private.display.jukeboxWindow.masterVolume`,
      value: volume,
      logOff: true
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.masterVolumeComponent {
  display: flex;
  flex-direction: column;
  min-height: 38px;
}

.masterVolumeComponent > div {
  flex-direction: row;
  position: relative;
}
.masterVolumeComponent > div.attrArea {
  height: 1.5em;
}
.masterVolumeComponent > div:not(.attrArea) {
  display: flex;
}

.masterVolumeComponent > div > span {
  /* はみ出た文字省略 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.masterVolumeComponent > div.attrArea > span.tag {
  display: inline-block;
  /* position: absolute; */
  font-size: 10px;
  padding: 0 2px;
  background-color: lightyellow;
  /* 罫線 */
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 5px;
  /* 縮小表示で限界を超えた小さいフォント対応 */
  max-width: calc((3em + 2px * 2) / 0.8);
  transform-origin: left;
  transform: scale(0.8);
  cursor: default;
  /* margin-right: calc((3em + 2px * 2) / 0.8 * (1 - 0.8) * -1); */
}
.masterVolumeComponent > div.attrArea > span.title {
  display: inline-block;
  text-align: left;
  font-weight: bold;
  cursor: default;
  font-size: 10px;
}
</style>()
