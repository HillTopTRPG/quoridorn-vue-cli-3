<template>
  <canvas
    class="stand-image"
    :width="canvasSize.w"
    :height="canvasSize.h"
    @contextmenu.prevent
    @click="onClick"
    ref="standImage"
  ></canvas>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";

interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
}

@Component<StandImageComponent>({
  name: "standImageComponent"
})
export default class StandImageComponent extends Vue {
  @Prop({ type: Object, required: true })
  private standImage!: any;

  @Prop({ type: Boolean, default: true })
  private drawDiff!: boolean;

  @Getter("imageList") imageList: any;

  private baseImageElm: HTMLImageElement | null = null;
  private diffImageList: any[] = [];
  private timeList: number[] = [];
  private animationLength: number = 0;

  private timeIndex: number = -1;
  private timer: number = -1; // Timeout ID

  private onMounted: boolean = false;
  private dataSetUpped: boolean = false;

  mounted(): void {
    this.onMounted = true;
    if (this.dataSetUpped) {
      // 描画開始
      this.startPaint();
    }
  }

  @Watch("standImage", { deep: true })
  onChangeStandImage(standImage: any) {
    // 稼働中のタイマーはキャンセル
    if (this.timer !== -1) clearTimeout(this.timer);

    const imageLoad = (imageKey: string | null, callback: Function) =>
      new Promise((resolve: Function, reject: Function) => {
        let imageData = null;
        if (imageKey) {
          const imageObj = this.imageList.filter(
            (image: any) => image.key === imageKey.replace(":R", "")
          )[0];
          imageData = imageObj ? imageObj.data : null;
        }

        const image = new Image();
        image.onload = () => {
          callback(image);
          resolve();
        };
        image.onerror = () => resolve();
        image.src = imageData;
      });

    const promiseList = [];

    // ベースのロード
    let baseImageElm: HTMLImageElement | null = null;
    promiseList.push(
      imageLoad(standImage.base, (imageElm: HTMLImageElement) => {
        baseImageElm = imageElm;
      })
    );

    // 差分のロード
    this.diffImageList.splice(0, this.diffImageList.length);
    let diffImageList: any[] = [];
    standImage.diffList.forEach((diff: any, index: number) => {
      const promise = Promise.resolve().then(() => {
        return imageLoad(diff.image, (imageElm: HTMLImageElement) => {
          if (!imageElm) return;
          diffImageList.push({
            index: index,
            image: imageElm,
            isReverse: diff.image ? /:R/.test(diff.image) : false,
            start: diff.time[0],
            end: diff.time[1],
            rec: {
              x: diff.x,
              y: diff.y,
              w: imageElm.naturalWidth,
              h: imageElm.naturalHeight
            }
          });
        });
      });
      promiseList.push(promise);
    });

    Promise.all(promiseList).then(() => {
      diffImageList = diffImageList.sort((diff1, diff2) => {
        if (diff1.index < diff2.index) return -1;
        if (diff1.index > diff2.index) return 1;
        return 0;
      });

      let timeList: number[] = [];
      diffImageList.forEach(diff => {
        // msに変換
        const start = standImage.animationLength * diff.start * 10;
        const end = standImage.animationLength * diff.end * 10;
        if (timeList.indexOf(start) === -1) timeList.push(start);
        if (timeList.indexOf(end) === -1) timeList.push(end);
      });
      timeList = timeList.sort((time1, time2) => (time1 < time2 ? -1 : 1));

      this.baseImageElm = baseImageElm;
      this.diffImageList = diffImageList;
      this.timeList = timeList;
      this.animationLength = standImage.animationLength;

      this.dataSetUpped = true;
      if (this.onMounted) {
        // 描画開始
        this.startPaint();
      }
    });
  }

  /**
   * 描画を開始する
   */
  private startPaint() {
    this.timeIndex = 0;
    this.paint();
  }

  /**
   * 描画する
   */
  paint(this: any): void {
    const time = this.timeList[this.timeIndex];

    const canvasElm: HTMLCanvasElement = <HTMLCanvasElement>(
      this.$refs.standImage
    );
    const ctx: CanvasRenderingContext2D = canvasElm!.getContext("2d")!;

    ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);

    const canvasSize = this.canvasSize;
    if (this.baseImageElm) {
      ctx.drawImage(this.baseImageElm, 0, 0, canvasSize.w, canvasSize.h);
    }

    if (this.drawDiff) {
      // 差分の描画
      this.diffImageList.forEach((diff: any) => {
        const start = this.animationLength * diff.start * 10;
        const end = this.animationLength * diff.end * 10;
        if (start === 0 && end === this.animationLength * 1000) {
          StandImageComponent.drawTransparent(ctx, diff.image, diff.rec);
        } else {
          if (start <= time && time < end) {
            StandImageComponent.drawTransparent(ctx, diff.image, diff.rec);
          }
        }
      });
    }

    // 描画タイマー更新
    this.setNextTimer();
  }

  private setNextTimer() {
    const lastTime = this.timeList[this.timeIndex];
    this.timeIndex++;

    let nextTime;
    let waitTime;
    if (this.timeIndex < this.timeList.length) {
      nextTime = this.timeList[this.timeIndex];
      waitTime = nextTime - lastTime;
    } else {
      this.timeIndex = 0;
      nextTime = this.timeList[this.timeIndex];
      waitTime = this.animationLength * 1000 - lastTime + nextTime;
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.paint();
    }, waitTime);
  }

  @Emit("click")
  onClick() {}

  @Watch("canvasSize", { deep: true })
  @Emit("resize")
  onChangeCanvasSize(canvasSize: any) {}

  private get canvasSize(): any {
    return {
      w: this.baseImageElm ? this.baseImageElm.naturalWidth : 0,
      h: this.baseImageElm ? this.baseImageElm.naturalHeight : 0
    };
  }

  private static drawTransparent(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    rec: Rectangle
  ) {
    // 重なり部分をクリアする設定
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fill();
    // 半透明色での塗りつぶし
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(image, rec.x, rec.y, rec.w, rec.h);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
