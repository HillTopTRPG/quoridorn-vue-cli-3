<template>
  <b-g-m-core-component
    :bgmKey="bgmKey"
    :tag="tag"
    :isLoop="isLoop"
    :title="title"
    :initVolume="initVolume"
    :creditUrl="creditUrl"
    :url="url"
    :startSecond="startSecond"
    :endSecond="endSecond"
    :fadeIn="fadeIn"
    :fadeOut="fadeOut"
    @mounted="onMounted"
    @destroyed="onDestroyed"
    @mute="onMute"
    @volume="onVolume"
    @play="onPlay"
    @pause="onPause"
    @seekTo="onSeekTo"
    @end="onEnd"
    ref="core"
  ></b-g-m-core-component>
</template>

<script lang="ts">
import BGMCoreComponent from "./BGMCoreComponent.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component({
  components: {
    BGMCoreComponent
  }
})
export default class BGMFileComponent extends Vue {
  @Action("setProperty") private setProperty: any;

  @Prop({ type: Object, required: true })
  private bgm!: any;

  @Prop({ type: String, required: true })
  private bgmKey!: string;

  @Prop({ required: true })
  private tag!: string;

  @Prop({ required: true })
  private isLoop!: boolean;

  @Prop({ required: true })
  private title!: string;

  @Prop({ required: true })
  private initVolume!: number;

  @Prop({ required: true })
  private url!: string;

  @Prop({ default: "" })
  private creditUrl!: string;

  @Prop({ required: true })
  private startSecond!: number;

  @Prop({ required: true })
  private endSecond!: number;

  @Prop({ type: Number, required: true })
  private fadeIn!: number;

  @Prop({ type: Number, required: true })
  private fadeOut!: number;

  private jukeboxAudio: any = null;

  onMounted(this: any): void {
    window.console.log(this.url);
    const useUrl = this.url.replace(/^(.+dropbox.+\?dl)=0$/, "$1=1");

    const bgmCoreComponent: BGMCoreComponent = this.$refs
      .core as BGMCoreComponent;

    bgmCoreComponent.click();

    this.jukeboxAudio = new Audio();
    // this.jukeboxAudio.crossOrigin = "anonymous";
    this.jukeboxAudio.autoplay = true;
    this.jukeboxAudio.loop = this.isLoop;
    this.jukeboxAudio.addEventListener("timeupdate", this.onTimeUpdate);
    this.jukeboxAudio.addEventListener("play", () => {
      if (!this.jukeboxAudio) return;
      bgmCoreComponent.setDuration(this.jukeboxAudio.duration);
      bgmCoreComponent.play();
    });
    this.jukeboxAudio.addEventListener("progress", () =>
      window.console.log("progress")
    );
    this.jukeboxAudio.addEventListener("emptied", () =>
      window.console.log("emptied")
    );
    this.jukeboxAudio.addEventListener("stalled", () =>
      window.console.log("stalled")
    );
    this.jukeboxAudio.addEventListener("abort", () =>
      window.console.log("abort")
    );
    this.jukeboxAudio.addEventListener("error", () =>
      window.console.log("error")
    );
    this.jukeboxAudio.addEventListener("ended", () =>
      window.console.log("ended")
    );
    this.jukeboxAudio.addEventListener("suspend", () =>
      window.console.log("suspend")
    );
    // DropBox共有リンク対応
    this.jukeboxAudio.src = useUrl;
    window.console.log(this.jukeboxAudio.src);
  }

  onDestroyed(): void {
    this.jukeboxAudio = null;
  }

  onMute(mute: boolean): void {
    this.jukeboxAudio.muted = mute;
  }

  onVolume(volume: number): void {
    this.jukeboxAudio.volume = volume;
  }

  onPlay(): void {
    this.jukeboxAudio.play().then(() => {
      window.console.log("onPlayed", this.jukeboxAudio.readyState);
    });
  }

  onPause(): void {
    this.jukeboxAudio.pause();
  }

  onSeekTo(time: number): void {
    this.jukeboxAudio.currentTime = time;
  }

  onEnd(): void {
    this.$emit("end");
  }

  onTimeUpdate(): void {
    if (!this.jukeboxAudio) return;
    const bgmCoreComponent: BGMCoreComponent = this.$refs
      .core as BGMCoreComponent;
    bgmCoreComponent.timeUpdate(this.jukeboxAudio.currentTime);
  }
}
</script>
