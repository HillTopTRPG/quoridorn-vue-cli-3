<template>
  <div class="volumeComponent" @contextmenu.prevent>
    <!-- スライダー -->
    <label>
      <input
        class="volume"
        :class="{muted: mute, masterMute: masterMute, mutable: mutable}"
        type="range"
        min="0"
        max="1"
        step="0.01"
        v-model="volume"
      >
    </label>

    <span
      class="icon mute"
      :class="{muted: mute, masterMute: masterMute}"
      @click="setMute()"
      v-show="mutable"
    >
      <!-- ミュート解除ボタン -->
      <i class="icon-volume-high" v-show="!mute"></i>

      <!-- ミュートボタン -->
      <i class="icon-volume-mute2" v-show="mute"></i>
    </span>

    <!-- 数値表示 -->
    <span class="volumeText" :class="{mutable: mutable}">{{Math.round(volume * 100)}}</span>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component({
  props: {
    initVolume: { type: Number, required: true },
    mutable: { type: Boolean, default: true }
  }
})
export default class VolumeComponent extends Vue {
  /** Vuexの getter への参照 */
  @Getter("masterMute") private masterMute: any;

  private static FADE_NONE: number = 0;
  private static FADE_IN: number = 1;
  private static FADE_OUT: number = 2;

  /** 音量 */
  public volume: number = 0;
  /** ミュートかどうか */
  public mute: boolean = false;

  /** フェード種別 */
  private fade: number = VolumeComponent.FADE_NONE;
  /** フェード中の保存音量 */
  private fadingVolume: number = 0;

  /**
   * ライフサイクルメソッド
   */
  mounted(this: any): void {
    this.volume = this.initVolume;
  }

  /**
   * このコンポーネントにミュートを設定する
   * @param mute: boolean
   */
  setMute(this: any, mute: boolean = !this.mute): void {
    this.mute = mute;
  }

  /**
   * このコンポーネントに音量を設定する
   * @param volume: number
   */
  public setVolume(this: any, volume: number): void {
    this.volume = volume;
  }

  public startFade(isFadeIn: boolean) {
    // window.console.log("startFade", isFadeIn);
    if (this.fade === VolumeComponent.FADE_NONE)
      this.fadingVolume = this.volume;

    if (isFadeIn) {
      this.fade = VolumeComponent.FADE_IN;
    } else {
      this.fade = VolumeComponent.FADE_OUT;
    }
  }

  public endFade() {
    if (this.fade !== VolumeComponent.FADE_NONE) {
      // window.console.log("endFade");
      this.fade = VolumeComponent.FADE_NONE;
    }
  }

  public setFadeCount(current: number, all: number) {
    if (this.fade === VolumeComponent.FADE_IN) {
      this.volume = this.fadingVolume * (current / all);
    } else if (this.fade === VolumeComponent.FADE_OUT) {
      this.volume = this.fadingVolume * ((all - current) / all);
      // window.console.log("setFadeCount", current, "/", all, "|", this.fade, "$", this.fadingVolume, "%%%", this.volume);
    }
    if (current === all) this.fade = VolumeComponent.FADE_NONE;
  }

  /**
   * フィールド変数 mute を監視し、その値で muteイベント を発火する
   * @param mute
   */
  @Watch("mute")
  @Emit("mute")
  onChangeMute(mute: boolean): void {}

  /**
   * フィールド変数 volume を監視し、その値で volumeイベント を発火する
   * @param volume
   */
  @Watch("volume")
  @Emit("volume")
  onChangeVolume(volume: number): void {
    this.mute = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.volumeComponent {
  display: flex;
  flex-direction: row;
  flex: 1;
  position: relative;
  height: 20px;
  margin: auto;
}
.volumeComponent > label {
  display: flex;
  flex: 1;
}
.volumeComponent > label > * {
  flex: 1;
}
.icon {
  color: black;
  font-size: 10px;
  padding: 0;
}
.icon i {
  box-sizing: border-box;
  border: 2px solid black;
  border-radius: 50%;
  width: 20px;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.icon[disabled] i {
  background-color: lightgray;
}
.icon:not([disabled]) i:hover {
  border-color: #610b21;
  color: #610b21;
}
.icon:not([disabled]) i:active {
  border-color: #b40431;
  color: #b40431;
}
.icon.mute i {
  border-radius: 0 50% 0 0;
  cursor: pointer;
  border-color: black;
  color: black;
}
.icon.mute.muted i,
.icon.mute.masterMute i {
  border-color: #8a084b;
  border-bottom-color: black;
  background-color: #8a084b;
  color: white;
}
.volumeText {
  position: absolute;
  right: 4px;
  bottom: 2px;
  transform-origin: right bottom;
  transform: scale(0.7);
  color: white;
  pointer-events: none;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.volumeText.mutable {
  right: 24px;
}

input[type="range"] {
  -webkit-appearance: none;
  flex: 1;
  height: 100%;
  margin: 0;
  position: relative;
  background: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  outline: 0;
  cursor: pointer;
}
input[type="range"]::-webkit-slider-thumb {
  position: relative;
  -webkit-appearance: none;
  cursor: pointer;
}
input[type="range"].volume::-webkit-slider-thumb {
  background: black;
  width: 6px;
  height: 20px;
  margin-top: -4px;
  margin-bottom: -4px;
  box-sizing: border-box;
  border: 2px solid black;
}

input[type="range"].volume {
  width: calc(100% - 20px * 2);
  background: linear-gradient(
      to bottom right,
      rgba(0, 0, 0, 0) 47%,
      black 49.5%
    )
    no-repeat top left/105% 100%;
  border-bottom: 2px solid black;
}
input[type="range"].volume:not(.mutable) {
  border-right: 2px solid black;
}
input[type="range"].volume.muted,
input[type="range"].volume.masterMute {
  background: linear-gradient(
      to bottom right,
      rgba(0, 0, 0, 0) 47%,
      #8a084b 49.5%
    )
    no-repeat top left/105% 100%;
}
input[type="range"].volume:before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";
  background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 55%,
      rgb(80, 120, 100) 57.5%
    )
    no-repeat top left/105% 100%;
}
input[type="range"].volume.muted:before {
  background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 55%,
      #8a084b 57.5%
    )
    no-repeat top left/105% 100%;
}
</style>
