<template>
  <div class="bgmCoreComponent">
    <div class="thumbnail">
      <img v-img="thumbnailData" draggable="false" alt="Not Found" :title="thumbnailTitle" @click="thumbnailClick">
    </div>
    <div class="bgmComponent">
      <div class="attrArea">
        <span class="tag" :title="'【タグ】\n' + tag">{{tag}}</span><!--
     --><span class="title" :title="'【タイトル】\n' + title">{{title}}</span><!--
     --><span class="icon loop" disabled v-if="isLoop"><i class="icon-loop" title="ループ再生します"></i></span>
      </div>
      <div class="controlArea">
        <span class="icon play" :class="{isPlay: isPlay}" @click="changePlay()" v-show="isPlay"><i class="icon-play3"></i></span>
        <span class="icon play" :class="{isPlay: isPlay}" @click="changePlay()" v-show="!isPlay"><i class="icon-pause2"></i></span>
        <VolumeComponent
          :initVolume="initVolume"
          @mute="setMute"
          @volume="setVolume"
          ref="volumeComponent"/>
      </div>
      <div class="playLengthArea">
        <input class="playLength" :class="{isPlay: isPlay}" :style="playLengthStyle" type="range" min="0" :max="Math.round(duration * 100) / 100" step="0.01" v-model="playLength" @input="seekTo">
        <span class="playLengthText">{{Math.round(playLength)}}/{{Math.round(duration)}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import VolumeComponent from "./VolumeComponent.vue";
import { getUrlParam } from "../../common/Utility";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component<BGMCoreComponent>({
  name: "bgmCoreComponent",
  props: {
    tag: { type: String, required: true },
    isLoop: { type: Boolean, required: true },
    title: { type: String, required: true },
    initVolume: { type: Number, required: true },
    url: { type: String, required: true },
    startSecond: { type: Number, required: true },
    endSecond: { type: Number, required: true }
  },
  components: {
    VolumeComponent
  }
})
export default class BGMCoreComponent extends Vue {
  @Getter("masterMute") masterMute: any;
  @Getter("masterVolume") masterVolume: any;

  private jukeboxAudio: any = null;
  isYoutube: boolean = false;
  isPlay: boolean = true;
  playLength: number = 0;
  duration: number = 0;
  thumbnailData: string = "";

  mounted(this: any): void {
    this.isYoutube = /www\.youtube\.com/.test(this.url);
    this.thumbnailData = `http://i.ytimg.com/vi/${getUrlParam(
      "v",
      this.url
    )}/default.jpg`;
    this.$refs.volumeComponent.setVolume(this.initVolume);
    this.$refs.volumeComponent.setMute(false);
    this.$emit("mounted");
  }
  destroyed(): void {
    this.changePlay(false);
    this.$emit("destroyed");
  }

  thumbnailClick(this: any): void {
    window.open(this.url, "_blank");
  }
  audioMute(this: any): void {
    this.$emit(
      "mute",
      this.masterMute ||
        (this.$refs.volumeComponent ? this.$refs.volumeComponent.mute : false)
    );
  }
  audioVolume(this: any): void {
    this.$emit(
      "volume",
      this.masterVolume *
        (this.$refs.volumeComponent ? this.$refs.volumeComponent.volume : 0)
    );
  }
  setMute(): void {
    this.audioMute();
  }
  setVolume(): void {
    this.audioVolume();
  }
  changePlay(isPlay = !this.isPlay): void {
    this.isPlay = isPlay;
    this.$emit(isPlay ? "play" : "pause");
  }
  seekTo(): void {
    this.$emit("seekTo", this.playLength);
    this.changePlay(true);
  }
  timeUpdate(this: any, time: number): void {
    this.playLength = time;
    if (this.playLength < this.bgmStart) {
      this.playLength = this.bgmStart;
      this.$emit("seekTo", this.bgmStart);
    }
    if (this.playLength >= this.bgmEnd) {
      if (this.isLoop) {
        this.playLength = this.bgmStart;
        this.$emit("seekTo", this.bgmStart);
      } else {
        this.$emit("pause");
        this.$emit("end");
      }
    }
  }
  pause(): void {
    this.isPlay = false;
  }
  play(): void {
    this.isPlay = true;
  }
  setDuration(duration: number): void {
    this.duration = duration;
  }

  get playLengthStyle(): any {
    const useColor = this.isPlay ? "black" : "#8A084B";
    const per = (this.playLength * 100) / this.duration;
    return {
      background: `linear-gradient(to right, ${useColor} 0%, ${useColor} ${per}%, rgba(100, 100, 100, 1) ${per}%, rgba(100, 100, 100, 1) 100%)`
    };
  }
  get bgmStart(this: any): number {
    let start = 0;
    if (this.startSecond > 0) {
      start = this.startSecond;
    } else if (this.startSecond < 0) {
      start = this.duration + this.startSecond;
    }
    if (start > this.duration) start = this.duration;
    if (start < 0) start = 0;
    return start;
  }
  get bgmEnd(this: any): number {
    let end = this.duration;
    if (this.endSecond > 0) {
      end = this.endSecond;
    } else if (this.endSecond < 0) {
      end = this.duration + this.endSecond;
    }
    if (end > this.duration) end = this.duration;
    if (end < 0) end = 0;
    return end;
  }
  get thumbnailTitle(this: any): string {
    let title = `【タイトル】\n${this.title}`;
    if (this.isYoutube) {
      title += `\n\n【URL】\n${this.url}`;
    }
    return title;
  }

  @Watch("masterMute", { immediate: true })
  onChangeMasterMute() {
    setTimeout(() => this.audioMute(), 0);
  }

  @Watch("masterVolume", { immediate: true })
  onChangeMasterVolue() {
    setTimeout(() => this.audioVolume(), 0);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bgmCoreComponent {
  display: flex;
  flex-direction: row;
  min-height: 54px;
  margin-top: 4px;
  padding-top: 4px;
  border-top: 2px solid black;
}
.thumbnail {
  height: 54px;
  width: 72px;
  cursor: pointer;
}
.thumbnail > * {
  width: 100%;
  height: 100%;
}
.bgmComponent {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 54px;
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
  height: 20px;
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
.icon.play i {
  border-radius: 50% 50% 0% 0%;
  cursor: pointer;
}
.icon.play:not(.isPlay) i {
  border-color: #8a084b;
  background-color: #8a084b;
  color: white;
}

.bgmComponent > div {
  flex-direction: row;
  position: relative;
}
.bgmComponent > div.attrArea {
  height: 1.5em;
}
.bgmComponent > div:not(.attrArea) {
  display: flex;
}

.bgmComponent > div > span {
  /* はみ出た文字省略 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.bgmComponent > div.attrArea > span.tag {
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
}
.bgmComponent > div.attrArea > span.title {
  display: inline-block;
  position: absolute;
  left: calc(3em);
  text-align: left;
  font-weight: bold;
  cursor: default;
  width: calc(100% - 3em - 17px);
}
.bgmComponent > div.attrArea > .icon.loop {
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  margin: auto;
  transform-origin: right top;
  transform: scale(0.8);
}
.bgmComponent > div.attrArea > .icon.loop i {
  font-weight: bold;
}

.volumeText {
  position: absolute;
  right: 24px;
  bottom: 2px;
  transform-origin: right bottom;
  transform: scale(0.7);
  color: white;
  pointer-events: none;
}
.playLengthText {
  position: absolute;
  right: 24px;
  bottom: 6px;
  transform-origin: right bottom;
  transform: scale(0.7);
  color: white;
  pointer-events: none;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

input[type="range"] {
  -webkit-appearance: none;
  flex: 1;
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

input[type="range"].playLength {
  height: 8px;
  position: relative;
  cursor: pointer;
  margin-bottom: 8px;
  flex: 1;
  width: 100%;
  border-color: black;
}
input[type="range"].playLength::-webkit-slider-runnable-track {
  height: 8px;
  background: rgba(0, 0, 0, 0);
  box-sizing: border-box;
}
input[type="range"].playLength::-webkit-slider-thumb {
  box-sizing: border-box;
  width: 6px;
  height: 16px;
  margin-top: 0px;
  background-color: black;
}
</style>
