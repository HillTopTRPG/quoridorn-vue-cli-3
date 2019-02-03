<template>
  <BGMCoreComponent
    :tag="tag"
    :isLoop="isLoop"
    :title="title"
    :initVolume="initVolume"
    :url="url"
    :startSecond="startSecond"
    :endSecond="endSecond"
    @mounted="mounted"
    @destroyed="destroyed"
    @mute="mute"
    @volume="volume"
    @play="play"
    @pause="pause"
    @seekTo="seekTo"
    @end="end"
    ref="core"
  ></BGMCoreComponent>
</template>

<script lang="ts">
import BGMCoreComponent from "./BGMCoreComponent.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component<BGMFileComponent>({
  name: "bgmFileComponent",
  components: {
    BGMCoreComponent
  }
})
export default class BGMFileComponent extends Vue {
  @Prop({ required: true })
  tag!: string;
  @Prop({ required: true })
  isLoop!: boolean;
  @Prop({ required: true })
  title!: string;
  @Prop({ required: true })
  initVolume!: number;
  @Prop({ required: true })
  url!: string;
  @Prop({ required: true })
  startSecond!: number;
  @Prop({ required: true })
  endSecond!: number;

  private jukeboxAudio: any = null;

  destroyed(): void {
    this.jukeboxAudio = null;
  }
  mounted(this: any): void {
    this.jukeboxAudio = new Audio();
    this.jukeboxAudio.autoplay = true;
    this.jukeboxAudio.loop = this.isLoop;
    this.jukeboxAudio.addEventListener("timeupdate", this.timeUpdate);
    this.jukeboxAudio.addEventListener("play", () => {
      if (!this.jukeboxAudio) return;
      if (this.$refs.core instanceof BGMCoreComponent) {
        this.$refs.core.setDuration(this.jukeboxAudio.duration);
      }
    });
    if (this.url.startsWith("..")) {
      this.jukeboxAudio.src = this.url;
    } else {
      this.jukeboxAudio.src = this.url;
    }
  }
  mute(mute: boolean): void {
    this.jukeboxAudio.muted = mute;
  }
  volume(volume: number): void {
    this.jukeboxAudio.volume = volume;
  }
  play(): void {
    this.jukeboxAudio.play().then();
  }
  pause(): void {
    this.jukeboxAudio.pause();
  }
  seekTo(time: number): void {
    this.jukeboxAudio.currentTime = time;
  }
  end(): void {
    this.$emit("end");
  }
  timeUpdate(this: any): void {
    if (!this.jukeboxAudio) return;
    this.$refs.core.timeUpdate(this.jukeboxAudio.currentTime);
  }
}
</script>
