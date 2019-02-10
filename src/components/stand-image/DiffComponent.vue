<template>
  <div class="container">

    <!-- 画像 -->
    <div class="img-container">
      <div class="img" v-bg-img="image" :class="{isReverse : isReverse}" @click="chooseImage"></div>
    </div>

    <!-- 数値情報 -->
    <div class="locate">
      <label>位置</label>
      <label>X：<input type="number" min="0" v-model="x"></label>
      <label>Y：<input type="number" min="0" v-model="y"></label>
    </div>

    <!-- アニメーション周期 -->
    <div class="range">
      <label>表示時間{{viewTime}}</label>
      <RangeMultiplePersent v-model="time"/>
    </div>

    <span
      class="delete-button"
      @click.prevent="deleteStandImageDiff({ key: actorKey, statusName: statusName, index: index })"
    >削除</span>

  </div>
</template>

<script lang="ts">
import ActorSelect from "../parts/select/ActorSelect.vue";
import RangeMultiplePersent from "../parts/RangeMultiplePersent.vue";

import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component<DiffComponent>({
  name: "diffComponent",
  components: {
    ActorSelect,
    RangeMultiplePersent
  }
})
export default class DiffComponent extends Vue {
  @Prop({ type: String, required: true })
  private actorKey!: string;

  @Prop({ type: String, required: true })
  private statusName!: string;

  @Prop({ type: Object, required: true })
  private diff!: any;

  @Prop({ type: Number, required: true })
  private index!: number;

  @Prop({ type: Number, required: true })
  private animationLength!: number;

  @Action("setProperty") setProperty: any;
  @Action("changeListInfo") changeListInfo: any;
  @Action("windowOpen") windowOpen: any;
  @Action("editStandImageDiff") editStandImageDiff: any;
  @Action("deleteStandImageDiff") deleteStandImageDiff: any;
  @Getter("getPeerActors") getPeerActors: any;
  @Getter("getViewName") getViewName: any;
  @Getter("getObj") getObj: any;
  @Getter("imageList") imageList: any;

  /**
   * 画像選択
   */
  chooseImage(): void {
    const actorKey = this.actorKey;
    const index = this.index;
    const image = this.diff.image;
    const tag = this.diff.tag;
    Promise.resolve()
      .then(() =>
        // リアクティブのための更新と、それに伴うコールバックの一時無効のための指定
        this.setProperty({
          property: "private.display.imageSelectorWindow",
          value: {
            imageKey: null,
            imageTag: null,
            callback: null
          },
          logOff: true
        })
      )
      .then(() => {
        return this.setProperty({
          property: "private.display.imageSelectorWindow",
          value: {
            imageKey: image,
            imageTag: tag,
            callback: (imageKey: string, imageTag: string) => {
              this.editStandImageDiff({
                key: actorKey,
                statusName: this.statusName,
                index: index,
                image: imageKey,
                tag: imageTag
              });
            }
          },
          logOff: true
        });
      })
      .then(() => {
        this.windowOpen("private.display.imageSelectorWindow");
      });
  }

  get viewTime(): string {
    const time = this.time;
    const start = (this.animationLength * time[0]) / 100;
    const end = (this.animationLength * time[1]) / 100;
    return `(${start}~${end})秒`;
  }

  get image(): string | null {
    if (!this.diff || !this.diff.image) return null;
    const imageObj = this.imageList.filter(
      (image: any) => image.key === this.diff.image.replace(":R", "")
    )[0];
    return imageObj ? imageObj.data : null;
  }

  get isReverse(): boolean {
    if (!this.diff || !this.diff.image) return false;
    return /:R/.test(this.diff.image);
  }

  get x(): number {
    if (!this.diff || !this.diff.x) return 0;
    return this.diff.x;
  }

  set x(value: number) {
    this.editStandImageDiff({
      key: this.actorKey,
      statusName: this.statusName,
      index: this.index,
      x: value
    });
  }

  get y(): number {
    if (!this.diff || !this.diff.y) return 0;
    return this.diff.y;
  }

  set y(value: number) {
    this.editStandImageDiff({
      key: this.actorKey,
      statusName: this.statusName,
      index: this.index,
      y: value
    });
  }

  get time(): number[] {
    if (!this.diff || !this.diff.time) return [50];
    return this.diff.time;
  }

  set time(value: number[]) {
    this.editStandImageDiff({
      key: this.actorKey,
      statusName: this.statusName,
      index: this.index,
      time: value
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  overflow: visible;

  > div.range {
    border-left: 1px dashed #666;
  }
}
$color1: #f7f7f7;
$color2: #bebebe;
.img-container {
  margin-bottom: 0.5em;
  border: 1px solid #666;
  width: 5em;
  height: 5em;
  background: $color1;
  display: flex;
  background-image: linear-gradient(45deg, $color2 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, $color2 0),
    linear-gradient(45deg, $color2 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, $color2 0);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px, 8px 8px, 16px 16px;

  .img {
    flex: 1;
    background-size: contain;
  }
}
.delete-button {
  border-radius: 3px;
  border: solid 1px #666;
  color: #666;
  position: absolute;
  right: 2px;
  top: 2px;
  padding: 0 1px;
  font-size: 8px;

  &:hover {
    color: darkred;
    border-color: darkred;
  }
}
input[type="number"] {
  width: 3em;
}
.locate {
  display: inline-flex;
  flex-direction: column;
  margin-bottom: -1px;
  box-sizing: border-box;
  z-index: 0;
  padding: 0 0.5em;

  > label {
    flex: 1;
    display: flex;
    align-items: center;
  }
}
.range {
  position: relative;
  flex: 1;
  padding: 0 1em 0 0.5em;
  overflow: visible;
}
</style>
