<template>
  <b-g-m-core-component
    :tag="tag"
    :isLoop="isLoop"
    :title="title"
    :initVolume="initVolume"
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

@Component<BGMYoutubeComponent>({
  name: "bgmYoutubeComponent",
  components: {
    BGMCoreComponent
  }
})
export default class BGMYoutubeComponent extends Vue {
  @Action("setProperty") setProperty: any;

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

  @Prop({ type: Number, required: true })
  private startSecond!: number;

  @Prop({ type: Number, required: true })
  private endSecond!: number;

  @Prop({ type: Number, required: true })
  private fadeIn!: number;

  @Prop({ type: Number, required: true })
  private fadeOut!: number;

  onMounted() {
    const result = (<any>window)["youtube"]["registration"](
      this.tag,
      this.url,
      0,
      {
        onReady: this.onReady,
        timeUpdate: this.onTimeUpdate,
        onPlaying: this.onPlaying,
        onError: this.onError,
        onPaused: this.onPaused,
        onReject: this.onReject
      }
    );
    if (!result) this.$emit("end");
  }

  onDestroyed() {
    (<any>window)["youtube"]["destroyed"](this.tag);
  }

  onReady() {}

  onPlaying(this: any, duration: number) {
    const bgmCoreComponent: BGMCoreComponent = this.$refs.core;
    bgmCoreComponent.setDuration(duration);
    bgmCoreComponent.play();
  }

  onError(event: any) {
    window.console.log(event);
  }

  onPaused(this: any) {
    const bgmCoreComponent: BGMCoreComponent = this.$refs.core;
    bgmCoreComponent.pause();
  }

  onReject() {
    window.console.log("youtube - onReject => reload");
    this.setProperty({
      property: "private.display.jukeboxWindow.command",
      logOff: true,
      value: { command: "add", payload: this.bgmKey }
    });
  }

  onMute(mute: boolean) {
    (<any>window)["youtube"][mute ? "mute" : "unMute"](this.tag);
  }
  onVolume(volume: number) {
    (<any>window)["youtube"]["setVolume"](this.tag, volume * 100);
  }
  onPlay() {
    (<any>window)["youtube"]["play"](this.tag);
  }
  onPause() {
    (<any>window)["youtube"]["pause"](this.tag);
  }
  onSeekTo(time: any) {
    (<any>window)["youtube"]["seekTo"](this.tag, time, true);
  }
  onEnd() {
    this.$emit("end");
  }
  onTimeUpdate(time: number) {
    const bgmCoreComponent: BGMCoreComponent = <BGMCoreComponent>(
      this.$refs.core!
    );
    bgmCoreComponent.timeUpdate(time);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
