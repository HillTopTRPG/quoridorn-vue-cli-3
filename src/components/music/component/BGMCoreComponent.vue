<template>
  <div class="bgmCoreComponent">
    <div class="thumbnail" @contextmenu.prevent>
      <span class="icon-cross" @click.stop="deleteItem"></span>
      <img
        v-img="thumbnailData"
        draggable="false"
        alt="Not Found"
        :title="thumbnailTitle"
        @click="thumbnailClick"
      />
    </div>
    <div class="bgmComponent">
      <div class="attrArea">
        <span
          class="tag"
          :title="'【タグ】\n' + tag"
          ref="elm"
          @contextmenu.prevent
          >{{ tag }}</span
        ><!--
     --><span class="title selectable" :title="'【タイトル】\n' + title">{{
          title
        }}</span
        ><!--
     --><span class="icon loop" disabled v-if="isLoop" @contextmenu.prevent
          ><!--
       --><i class="icon-loop" title="ループ再生します"></i
          ><!--
       --></span
        >
      </div>
      <div class="controlArea" @contextmenu.prevent>
        <span
          class="icon play"
          :class="{ isPlay: isPlay }"
          @click="changePlay()"
          v-show="isPlay"
          ><i class="icon-play3"></i
        ></span>
        <span
          class="icon play"
          :class="{ isPlay: isPlay }"
          @click="changePlay()"
          v-show="!isPlay"
          ><i class="icon-pause2"></i
        ></span>
        <volume-component
          :initVolume="initVolume"
          @mute="setMute"
          @volume="setVolume"
          ref="volumeComponent"
        />
      </div>
      <div class="playLengthArea" @contextmenu.prevent>
        <input
          class="playLength"
          :class="{ isPlay: isPlay }"
          :style="playLengthStyle"
          type="range"
          min="0"
          :max="Math.round(duration * 100) / 100"
          step="0.01"
          v-model="playLength"
          @input="seekTo"
        />
        <span class="playLengthText"
          >{{ Math.round(playLength) }}/{{ Math.round(duration) }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VolumeComponent from "./VolumeComponent.vue";
import { getUrlParam } from "../../common/Utility";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  components: {
    VolumeComponent
  }
})
export default class BGMCoreComponent extends Vue {
  @Action("setProperty") private setProperty: any;
  @Getter("masterMute") private masterMute: any;
  @Getter("masterVolume") private masterVolume: any;

  @Prop({ type: String, required: true })
  private bgmKey!: string;

  @Prop({ type: String, required: true })
  private tag!: string;

  @Prop({ type: Boolean, required: true })
  private isLoop!: boolean;

  @Prop({ type: String, required: true })
  private title!: string;

  @Prop({ type: Number, required: true })
  private initVolume!: number;

  @Prop({ type: String, required: true })
  private url!: string;

  @Prop({ type: String, default: "" })
  private creditUrl!: string;

  @Prop({ type: Number, required: true })
  private startSecond!: number;

  @Prop({ type: Number, required: true })
  private endSecond!: number;

  @Prop({ type: Number, required: true })
  private fadeIn!: number;

  @Prop({ type: Number, required: true })
  private fadeOut!: number;

  private jukeboxAudio: any = null;
  isYoutube: boolean = false;
  isPlay: boolean = true;
  playLength: number = 0;
  duration: number = 0;
  thumbnailData: string = "";

  private fadeInTable: number[] = [];
  private fadeOutTable: number[] = [];

  public click() {
    const elm: HTMLElement = this.$refs.elm as HTMLElement;
    elm.click();
  }

  private deleteItem() {
    this.setProperty({
      property: "private.display.jukeboxWindow.command",
      logOff: true,
      isNotice: false,
      value: { command: "remove", payload: this.bgmKey }
    });
  }

  mounted(this: any): void {
    this.isYoutube = /www\.youtube\.com/.test(this.url);
    this.thumbnailData = `http://i.ytimg.com/vi/${getUrlParam(
      "v",
      this.url
    )}/default.jpg`;

    const volumeComponent: VolumeComponent = this.$refs
      .volumeComponent as VolumeComponent;
    volumeComponent.setVolume(this.initVolume);
    volumeComponent.setMute(false);

    this.$emit("mounted");
  }
  destroyed(): void {
    this.changePlay(false);
    this.$emit("destroyed");
  }

  thumbnailClick(this: any): void {
    if (/www\.youtube\.com/.test(this.url))
      window.open(this.creditUrl || this.url, "_blank");
  }
  audioMute(this: any): void {
    const volumeComponent: VolumeComponent = this.$refs
      .volumeComponent as VolumeComponent;
    this.$emit(
      "mute",
      this.masterMute || (volumeComponent ? volumeComponent.mute : false)
    );
  }
  audioVolume(this: any): void {
    const volumeComponent: VolumeComponent = this.$refs
      .volumeComponent as VolumeComponent;
    this.$emit(
      "volume",
      this.masterVolume * (volumeComponent ? volumeComponent.volume : 0)
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
    this.fadeProc();
  }
  pause(): void {
    this.isPlay = false;
  }
  play(): void {
    this.isPlay = true;
    this.fadeProc();
  }
  setDuration(duration: number): void {
    this.duration = duration;

    this.fadeInTable = [];
    for (let i = 0; i <= this.fadeIn; i++) {
      this.fadeInTable.push(this.bgmStart + i / 10);
    }

    this.fadeOutTable = [];
    for (let i = 0; i <= this.fadeOut; i++) {
      this.fadeOutTable.push(this.bgmEnd - (this.fadeOut - i) / 10);
    }

    // window.console.log(this.fadeInTable, this.fadeOutTable);
  }

  fadeProc() {
    const volumeComponent: VolumeComponent = this.$refs
      .volumeComponent as VolumeComponent;
    let isProcessed: boolean = false;
    if (this.fadeIn) {
      this.fadeInTable.forEach((time, index) => {
        if (isProcessed) return;
        if (this.playLength <= time) {
          if (index === 0) volumeComponent.startFade(true);
          volumeComponent.setFadeCount(index, this.fadeIn);
          isProcessed = true;
        }
      });
    }
    if (this.fadeOut) {
      this.fadeOutTable
        .concat()
        .reverse()
        .forEach((time, index) => {
          if (isProcessed) return;
          if (this.playLength > time) {
            if (index === this.fadeOut) volumeComponent.startFade(false);
            volumeComponent.setFadeCount(
              this.fadeOut - index - 1,
              this.fadeOut
            );
            isProcessed = true;
          }
        });
    }
    if (!isProcessed) {
      if (this.fadeIn || this.fadeOut) {
        volumeComponent.endFade();
      }
    }
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

<style scoped lang="scss">
@import "../../common.scss";

.bgmCoreComponent {
  @include flex-box();
  min-height: 54px;
  margin-top: 4px;
  padding-top: 4px;
  border-top: 2px solid black;

  &:hover .thumbnail .icon-cross {
    visibility: visible;
  }
}

.thumbnail {
  position: relative;
  height: 54px;
  width: 72px;
  cursor: pointer;

  > *:not(.icon-cross) {
    width: 100%;
    height: 100%;
  }

  .icon-cross {
    visibility: hidden;
    position: absolute;
    left: 0;
    top: 0;
    background-color: white;
    border: solid 1px black;
    border-radius: 50%;
    font-size: 10px;
    padding: 0.3em;

    &:hover {
      background-color: lightyellow;
      color: red;
    }
  }
}

.bgmComponent {
  @include flex-box(column);
  flex: 1;
  min-height: 54px;
}

.icon {
  color: black;
  font-size: 10px;
  padding: 0;

  i {
    box-sizing: border-box;
    border: 2px solid black;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    @include inline-flex-box(row, center, center);
  }

  &[disabled] i {
    background-color: lightgray;
  }

  &:not([disabled]) {
    i:hover {
      border-color: #610b21;
      color: #610b21;
    }

    i:active {
      border-color: #b40431;
      color: #b40431;
    }
  }

  &.play {
    i {
      border-radius: 50% 50% 0 0;
      cursor: pointer;
    }

    &:not(.isPlay) i {
      border-color: #8a084b;
      background-color: #8a084b;
      color: white;
    }
  }
}

.bgmComponent > div {
  flex-direction: row;
  position: relative;
}
.bgmComponent > div.attrArea {
  height: 1.5em;
}
.bgmComponent > div:not(.attrArea) {
  @include flex-box();
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
