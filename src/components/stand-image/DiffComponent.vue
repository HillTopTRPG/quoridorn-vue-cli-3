<template>
  <div class="container" @contextmenu.prevent>
    <!-- 画像 -->
    <div class="img-container">
      <div
        class="img"
        v-bg-img="image"
        :class="{ isReverse: isReverse }"
        @click="chooseImage"
      ></div>
    </div>

    <!-- 数値情報 -->
    <div class="locate">
      <label>位置</label>
      <label>X：<input type="number" v-model="x"/></label>
      <label>Y：<input type="number" v-model="y"/></label>
      <ctrl-select v-model="type" :optionInfoList="optionInfoList" />
    </div>

    <!-- アニメーション周期 -->
    <div class="range">
      <label>表示時間{{ viewTime }}</label>
      <range-multiple-persent v-model="time" />
    </div>

    <span
      class="delete-button"
      @click.prevent="
        deleteStandImageDiff({
          key: actorKey,
          statusName: statusName,
          index: index
        })
      "
    >
      削除
    </span>
  </div>
</template>

<script lang="ts">
import RangeMultiplePersent from "../parts/RangeMultiplePersent.vue";
import CtrlSelect from "@/components/parts/CtrlSelect.vue";

import { Component, Prop, Vue } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  components: {
    CtrlSelect,
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

  @Action("setProperty") private setProperty: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("editStandImageDiff") private editStandImageDiff: any;
  @Action("deleteStandImageDiff") private deleteStandImageDiff: any;
  @Getter("getViewName") private getViewName: any;
  @Getter("getObj") private getObj: any;
  @Getter("imageList") private imageList: any;

  /**
   * 画像選択
   */
  chooseImage(): void {
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
            callback: this.changeImage.bind(this)
          },
          logOff: true
        });
      })
      .then(() => {
        this.windowOpen("private.display.imageSelectorWindow");
      });
  }

  public changeImage(imageKey: string, imageTag: string) {
    const arg: any = {
      key: this.actorKey,
      statusName: this.statusName,
      index: this.index,
      image: imageKey,
      tag: imageTag,
      time: this.time
    };

    // 画像のファイル名の情報を利用
    const imageObj: any = this.imageList.filter(
      (image: any) => image.key === imageKey.replace(":R", "")
    )[0];
    const argObj = DiffComponent.getArg(imageObj);
    const isReverse: boolean = /:R/.test(imageKey);
    if (argObj.x !== undefined) arg.x = isReverse ? argObj.reverseX : argObj.x;
    if (argObj.y !== undefined) arg.y = isReverse ? argObj.reverseY : argObj.y;
    if (argObj.from !== undefined) arg.time[0] = argObj.from;
    if (argObj.to !== undefined) arg.time[1] = argObj.to;

    this.editStandImageDiff(arg);
  }

  public static getArg(imageObj: any): any {
    if (!imageObj) return {};

    const arg: any = {};

    const imageArgList: string[] = imageObj.imageArgList;

    if (!imageArgList) return arg;

    const getParamNum = (index: number): number | null => {
      if (imageArgList.length <= index) return null;
      const num = parseInt(imageArgList[index], 10);
      return isNaN(num) ? null : num;
    };

    arg.type = getParamNum(0);
    arg.x = getParamNum(1);
    arg.y = getParamNum(2);
    arg.reverseX = getParamNum(3);
    arg.reverseY = getParamNum(4);
    arg.from = getParamNum(5);
    arg.to = getParamNum(6);

    return arg;
  }

  get viewTime(): string {
    const time = this.time;
    const start = (this.animationLength * time[0]) / 100;
    const end = (this.animationLength * time[1]) / 100;
    return `(${start}~${end})秒`;
  }

  public get imageKey(): string | null {
    if (!this.diff || !this.diff.image) return null;
    return this.diff.image;
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

  get type(): string {
    if (!this.diff || !this.diff.type) return "0";
    return String(this.diff.type);
  }

  set type(value: string) {
    this.editStandImageDiff({
      key: this.actorKey,
      statusName: this.statusName,
      index: this.index,
      type: parseInt(value, 10)
    });
  }

  set time(value: number[]) {
    this.editStandImageDiff({
      key: this.actorKey,
      statusName: this.statusName,
      index: this.index,
      time: value
    });
  }

  private get optionInfoList(): any[] {
    const resultList: any[] = [];
    resultList.push({
      key: "0",
      value: "0",
      text: "重ねる",
      disabled: false
    });
    resultList.push({
      key: "1",
      value: "1",
      text: "置換",
      disabled: false
    });
    return resultList;
  }
}
</script>

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
    border-left: 1px dashed #666666;
  }
}

$color1: #f7f7f7;
$color2: #bebebe;
.img-container {
  border: 1px solid #666666;
  width: 6em;
  height: 6em;
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

    &.isReverse {
      transform: scale(-1, 1);
    }
  }
}

.delete-button {
  border-radius: 3px;
  border: solid 1px #666666;
  color: #666666;
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
    justify-content: space-between;
  }
}

.range {
  position: relative;
  flex: 1;
  padding: 0 1em 0 0.5em;
  overflow: visible;
}
</style>
