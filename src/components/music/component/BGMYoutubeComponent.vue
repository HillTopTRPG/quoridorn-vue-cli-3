<template>
  <b-g-m-core-component
    :bgmKey="bgmKey"
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

@Component({
  components: {
    BGMCoreComponent
  }
})
export default class BGMYoutubeComponent extends Vue {
  @Action("setProperty") private setProperty: any;

  @Prop({ type: Object, required: true })
  private bgm!: any;

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

  private onMounted() {
    const bgmObj = {
      onReady: this.onReady,
      timeUpdate: this.onTimeUpdate,
      onPlaying: this.onPlaying,
      onError: this.onError,
      onPaused: this.onPaused,
      onReject: this.onReject
    };
    const result = (<any>window)["youtube"]["registration"](
      this.tag,
      this.url,
      0,
      bgmObj
    );
    if (!result) this.$emit("end");
  }

  private onDestroyed() {
    (<any>window)["youtube"]["destroyed"](this.tag);
  }

  private onReady() {}

  private onPlaying(this: any, duration: number) {
    const bgmCoreComponent: BGMCoreComponent = this.$refs.core! as BGMCoreComponent;
    bgmCoreComponent.setDuration(duration);
    bgmCoreComponent.play();
  }

  private onError(event: any) {
    window.console.error(event);
  }

  private onPaused(this: any) {
    const bgmCoreComponent: BGMCoreComponent = this.$refs
      .core as BGMCoreComponent;
    bgmCoreComponent.pause();
  }

  private onReject() {
    window.console.log("youtube - onReject => reload");
    this.bgm.isReject = true;
    this.setProperty({
      property: "private.display.jukeboxWindow.command",
      logOff: true,
      value: { command: "add", payload: this.bgm }
    });
  }

  private onMute(mute: boolean) {
    (<any>window)["youtube"][mute ? "mute" : "unMute"](this.tag);
  }

  private onVolume(volume: number) {
    (<any>window)["youtube"]["setVolume"](this.tag, volume * 100);
  }

  private onPlay() {
    (<any>window)["youtube"]["play"](this.tag);
  }

  private onPause() {
    (<any>window)["youtube"]["pause"](this.tag);
  }

  private onSeekTo(time: any) {
    (<any>window)["youtube"]["seekTo"](this.tag, time, true);
  }

  private onEnd() {
    this.$emit("end");
  }

  private onTimeUpdate(time: number) {
    const bgmCoreComponent: BGMCoreComponent = this.$refs
      .core as BGMCoreComponent;
    bgmCoreComponent.timeUpdate(time);
  }
}
</script>
