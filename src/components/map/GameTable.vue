<template>
  <div
    :style="gameTableStyle"
    @contextmenu.prevent
    @dragover.prevent
    @drop.prevent="drop"
    dropzone="move"
    id="gameTable">

    <div :style="gridPaperStyle">
    </div>

    <div @mousedown.left.prevent="leftDown"
         @mousedown.right.prevent="rightDown" @mouseup.left.prevent="leftUp"
         @mouseup.right.prevent="rightUp" @touchcancel.prevent="leftUp"
         @touchend.prevent="leftUp" @touchstart.prevent="leftDown" id="mapBoardFrame">
      <MapBoard/>
    </div>

    <MapMask v-for="obj in getMapObjectList({ kind: 'mapMask', place: 'field' })"
             :key="obj.key" :objKey="obj.key" @drag="dragging" @leftDown="leftDown"
             @leftUp="leftUp" @rightDown="rightDown" @rightUp="rightUp" type="mapMask"/>
    <Character v-for="obj in getMapObjectList({ kind: 'character', place: 'field' })"
               :key="obj.key" :objKey="obj.key" @drag="dragging" @leftDown="leftDown"
               @leftUp="leftUp" @rightDown="rightDown" @rightUp="rightUp" type="character"/>
    <Chit v-for="obj in getMapObjectList({ kind: 'chit', place: 'field' })"
          :key="obj.key" :objKey="obj.key" @drag="dragging" @leftDown="leftDown"
          @leftUp="leftUp" @rightDown="rightDown" @rightUp="rightUp" type="chit"/>

  </div>
</template>

<script lang="ts">
import AddressCalcMixin from "../AddressCalcMixin.vue";
import MapBoard from "./MapBoard.vue";
import MapMask from "./mapMask/MapMask.vue";
import Character from "./character/Character.vue";
import Chit from "./chit/Chit.vue";

import { qLog, getFileNameArgList } from "../common/Utility";
import { Component, Mixins } from "vue-mixin-decorator";
import { Action, Getter } from "vuex-class";
import { Watch } from "vue-property-decorator";

@Component({
  name: "gameTable",
  components: {
    MapBoard,
    MapMask,
    Character,
    Chit
  }
})
export default class GameTable extends Mixins<AddressCalcMixin>(
  AddressCalcMixin
) {
  @Action("addPieceInfo") addPieceInfo: any;
  @Action("windowOpen") windowOpen: any;
  @Action("setProperty") setProperty: any;
  @Action("windowClose") windowClose: any;
  @Action("importStart") importStart: any;
  @Getter("isFitGrid") isFitGrid: any;
  @Getter("parseColor") parseColor: any;
  @Getter("getBackgroundImage") getBackgroundImage: any;
  @Getter("marginGridColor") marginGridColor: any;
  @Getter("marginMaskColor") marginMaskColor: any;
  @Getter("marginMaskAlpha") marginMaskAlpha: any;
  @Getter("isUseGridColor") isUseGridColor: any;
  @Getter("isUseImage") isUseImage: any;
  @Getter("playerKey") playerKey: any;
  @Getter("angle") angle: any;
  @Getter("rollObj") rollObj: any;
  @Getter("isDraggingLeft") isDraggingLeft: any;
  @Getter("isMouseDownRight") isMouseDownRight: any;
  @Getter("isOverEvent") isOverEvent: any;
  @Getter("isDraggingRight") isDraggingRight: any;
  @Getter("move") move: any;
  @Getter("angleVolatile") angleVolatile: any;
  @Getter("isModal") isModal: any;
  @Getter("getMapObjectList") getMapObjectList: any;
  @Getter("propertyList") propertyList: any;

  mounted(): void {
    document.addEventListener("mousemove", this.mouseMove);
    document.addEventListener("touchmove", this.touchMove);
  }

  dragging(): void {
    window.console.log(`★★★★ dragging ★★★★`);
  }

  onWheel(delta: number): void {
    const changeValue = 100;
    const add = delta > 0 ? changeValue : -changeValue;
    const wheel = this.wheel + add;
    if (wheel < -2400 || wheel > 800) {
      return;
    }
    this.setProperty({
      property: "private.map.wheel",
      value: wheel,
      logOff: true
    });
  }

  getAngle(mouseOnTable: any, storeObj: any): number {
    const rectObj = {
      top: storeObj.top + storeObj.move.dragging.y,
      left: storeObj.left + storeObj.move.dragging.x,
      width: storeObj.columns * this.gridSize,
      height: storeObj.rows * this.gridSize
    };
    const center = {
      x: rectObj.left + rectObj.width / 2,
      y: rectObj.top + rectObj.height / 2
    };
    // 中心座標を基準としたマウス座標
    const loc = {
      x: mouseOnTable.x - center.x,
      y: mouseOnTable.y - center.y
    };
    // 中心点と指定された座標とを結ぶ線の角度を求める
    return (Math.atan2(loc.y, loc.x) * 180) / Math.PI;
  }

  leftDown(this: any): void {
    // window.console.log(`  [methods] mousedown left on GameTable`)
    const obj = {
      move: {
        from: {
          x: this.mouseLocate.x,
          y: this.mouseLocate.y
        }
      },
      isDraggingLeft: true
    };
    this.setProperty({ property: "map", value: obj, logOff: true });
  }

  leftUp(): void {
    // window.console.log(`  [methods] mouseup left on GameTable`)
    if (this.rollObj.isRolling) {
      // マップ上のオブジェクトを回転中の場合
      const pieceObj = this.$store.state.public[
        this.rollObj.propName
      ].list.filter((obj: any) => obj.key === this.rollObj.key)[0];
      const storeIndex = this.$store.state.public[
        this.rollObj.propName
      ].list.indexOf(pieceObj);
      this.setProperty({
        property: `map.rollObj.isRolling`,
        value: false,
        logOff: true
      });
      const planeAngle = this.arrangeAngle(
        pieceObj.angle.dragging + pieceObj.angle.total
      );
      const total = this.arrangeAngle(Math.round(planeAngle / 30) * 30);
      // window.console.log(`angle:${angle}, planeAngle:${planeAngle}, totalB:${this.angle.total}, totalA:${total}`)
      const obj = {
        total: total,
        dragging: 0
      };
      this.setProperty({
        property: `public.${this.rollObj.propName}.list.${storeIndex}.angle`,
        value: obj,
        logOff: true,
        isNotice: true
      });
    } else {
      // マップを動かしている場合
      const obj = {
        move: {
          dragging: {
            x: 0,
            y: 0
          },
          total: {
            x: this.move.total.x + this.move.dragging.x,
            y: this.move.total.y + this.move.dragging.y
          }
        },
        isDraggingLeft: false
      };
      this.setProperty({ property: "map", value: obj, logOff: true });
    }
  }

  rightDown(this: any): void {
    qLog(`  [methods] GameTableイベント => event: mousedown, mouse: right`);
    const obj = {
      angle: {
        dragStart: this.calcCoordinate(
          this.mouseLocate.x,
          this.mouseLocate.y,
          this.currentAngle
        ).angle
      },
      isMouseDownRight: true
    };
    this.setProperty({ property: "map", value: obj, logOff: true });
  }

  rightUp(event: any): void {
    qLog(`  [methods] GameTableイベント => event: mouseup, mouse: right`);
    const isDraggingRight = this.isDraggingRight;
    this.setProperty({
      property: "map.isMouseDownRight",
      value: false,
      logOff: true
    });

    let isRoll = false;
    if (isDraggingRight) {
      const nextAngle = this.arrangeAngle(
        this.angle.total + Math.round(this.angleVolatile.dragging / 15) * 15
      );
      if (this.angle.total !== nextAngle) {
        isRoll = true;
      }
      const obj = {
        angle: {
          dragging: 0
        },
        isDraggingRight: false
      };
      this.setProperty({ property: "map", value: obj, logOff: true });
      this.setProperty({
        property: "private.map.angle.total",
        value: nextAngle,
        logOff: true
      });
    }
    let pageX = event.pageX;
    let pageY = event.pageY;

    if (!this.isOverEvent) {
      if (!isRoll) {
        // 右ドラッグが解除されたのが子画面上でなく、調整後に回転していない場合のみ右コンテキストメニューを表示する
        const obj = {
          x: pageX,
          y: pageY
        };
        this.setProperty({
          property: `private.display.gameTableContext`,
          value: obj,
          logOff: true
        });
        this.windowOpen(`private.display.gameTableContext`);
        qLog(`  [methods] open context => gameTableContext`);
      }
    } else {
      this.setProperty({
        property: `map.isOverEvent`,
        value: false,
        logOff: true
      });
    }
  }

  mouseMove(event: any): void {
    this.setMouseLocateOnPage(event.pageX, event.pageY);
  }

  touchMove(event: any): void {
    this.setMouseLocateOnPage(
      event.changedTouches[0].pageX,
      event.changedTouches[0].pageY
    );
  }

  setMouseLocateOnPage(pageX: number, pageY: number): void {
    const obj = {
      x: pageX,
      y: pageY
    };
    this.setProperty({ property: "mouse", value: obj, logOff: true });

    const canvasAddress = this.calcCanvasAddress(
      pageX,
      pageY,
      this.currentAngle
    );
    const mapObj: any = {
      mouse: {
        onScreen: {
          x: canvasAddress.locateOnScreen.x,
          y: canvasAddress.locateOnScreen.y
        },
        onTable: {
          x: canvasAddress.locateOnTable.x,
          y: canvasAddress.locateOnTable.y
        },
        onCanvas: {
          x: canvasAddress.locateOnCanvas.x,
          y: canvasAddress.locateOnCanvas.y
        }
      },
      grid: {
        c: canvasAddress.grid.column,
        r: canvasAddress.grid.row
      }
    };
    if (this.isMouseDownRight && !this.isDraggingRight) {
      mapObj.isDraggingRight = true;
    }
    this.setProperty({ property: "map", value: mapObj, logOff: true });
  }

  drop(event: any): void {
    // ドロップされた物の種類
    const kind = event.dataTransfer.getData("kind");

    const offsetX = event.dataTransfer.getData("offsetX");
    const offsetY = event.dataTransfer.getData("offsetY");

    const canvasAddress = this.calcCanvasAddress(
      event.pageX,
      event.pageY,
      this.currentAngle,
      offsetX,
      offsetY
    );
    const locateOnTable = canvasAddress.locateOnTable;
    if (this.isFitGrid) {
      locateOnTable.x =
        (Math.ceil(locateOnTable.x / this.gridSize) - 1) * this.gridSize;
      locateOnTable.y =
        (Math.ceil(locateOnTable.y / this.gridSize) - 1) * this.gridSize;
    }

    qLog(
      `  [methods] drop on GameTable => type: ${kind}, address: (${
        canvasAddress.grid.column
      },${canvasAddress.grid.row})`
    );

    const pieceObj: any = {
      kind: kind,
      propName: kind,
      left: locateOnTable.x,
      top: locateOnTable.y,
      isNotice: true,
      owner: this.playerKey,
      place: "field"
    };

    // マップマスクの作成
    if (kind === "mapMask") {
      const name = event.dataTransfer.getData("name");
      const color = event.dataTransfer.getData("color");
      const fontColor = event.dataTransfer.getData("fontColor");
      const columns = parseInt(event.dataTransfer.getData("columns"), 10);
      const rows = parseInt(event.dataTransfer.getData("rows"), 10);

      // 必須項目
      pieceObj.columns = columns;
      pieceObj.rows = rows;
      // 個別部
      pieceObj.name = name;
      pieceObj.color = color;
      pieceObj.fontColor = fontColor;

      this.addPieceInfo(pieceObj);
      return;
    }

    // キャラクターの作成
    if (kind === "character") {
      const name = event.dataTransfer.getData("name");
      const size = event.dataTransfer.getData("size");
      const useImageList = event.dataTransfer.getData("useImageList");
      const isHide = event.dataTransfer.getData("isHide") === "true";
      const url = event.dataTransfer.getData("urlStr");
      const text = event.dataTransfer.getData("description");
      const useImageIndex = parseInt(
        event.dataTransfer.getData("useImageIndex"),
        10
      );
      const currentImageTag = event.dataTransfer.getData("currentImageTag");

      // 必須項目
      pieceObj.columns = size;
      pieceObj.rows = size;
      // 個別部
      pieceObj.name = name;
      pieceObj.useImageList = useImageList;
      pieceObj.isHide = isHide;
      pieceObj.url = url;
      pieceObj.text = text;
      pieceObj.useImageIndex = useImageIndex;
      pieceObj.currentImageTag = currentImageTag;
      pieceObj.fontColorType = 0;
      pieceObj.fontColor = "";
      const useImage = useImageList.split("|")[useImageIndex];
      pieceObj.statusList = [
        {
          name: "◆",
          standImage: {
            ref: "",
            base: "",
            baseTag: "",
            autoResize: false,
            animationLength: 0,
            locate: 1,
            diffList: [],
            isSystemLock: true
          }
        }
      ];
      pieceObj.property = {
        initiative: 0,
        subInitiative: 0,
        roundIndex: -1
      };

      this.propertyList.forEach((prop: any, index: number) => {
        if (prop.type === "min") {
          const nextProp = this.propertyList[index + 1];
          pieceObj.property[nextProp.property + "-min"] = 0;
        }
        if (prop.type === "number") {
          pieceObj.property[prop.property] = 0;
        }
        if (prop.type === "max") {
          const prevProp = this.propertyList[index - 1];
          pieceObj.property[prevProp.property + "-max"] = 99;
        }
        if (prop.type === "checkbox") {
          pieceObj.property[prop.property] = false;
        }
      });

      if (this.$store.state.private.display.addCharacterWindow.isContinuous) {
        const splits = name.split("_");
        const continuousNum = parseInt(splits[splits.length - 1], 10);
        this.setProperty({
          property: "private.display.addCharacterWindow.continuousNum",
          value: continuousNum + 1,
          logOff: true
        });
      } else {
        this.windowClose("private.display.addCharacterWindow");
        this.setProperty({
          property: "private.display.addCharacterWindow.continuousNum",
          value: 1,
          logOff: true
        });
      }

      this.addPieceInfo(pieceObj);
      return;
    }

    // チットの作成
    if (kind === "chit") {
      const currentImageTag = event.dataTransfer.getData("currentImageTag");
      const imageKey = event.dataTransfer.getData("imageKey");
      const isReverse = event.dataTransfer.getData("isReverse");
      const columns = event.dataTransfer.getData("columns");
      const rows = event.dataTransfer.getData("rows");
      const description = event.dataTransfer.getData("description");

      // 必須項目
      pieceObj.columns = columns;
      pieceObj.rows = rows;
      // 個別部
      pieceObj.currentImageTag = currentImageTag;
      pieceObj.imageKey = imageKey;
      pieceObj.isReverse = isReverse;
      pieceObj.description = description;

      this.addPieceInfo(pieceObj);
      return;
    }

    // ファイルがドロップされてる
    const files = event.dataTransfer.files;

    // ファイルの種類に応じて振り分け
    const imageFiles: any[] = [];
    const zipFiles: any[] = [];
    for (const file of files) {
      window.console.log(file.type);
      if (file.type.indexOf("image/") === 0) {
        // 画像
        imageFiles.push(file);
      } else if (file.type.indexOf("zip") >= 0) {
        // zip
        zipFiles.push(file);
      }
    }

    // 画像ファイルの処理
    if (imageFiles.length > 0) {
      // どこに使う画像ファイルなのかを選んでもらう
      const promiseList: PromiseLike<any>[] = imageFiles.map(file =>
        this.createBase64DataSet(file, { w: 96, h: 96 })
      );
      const _: any = this;
      Promise.all(promiseList).then((values: any[]) => {
        values.forEach((valueObj: any, index: number) => {
          valueObj.key = index;
        });
        _.setProperty({
          property: "private.display.dropImageWindow.imageDataList",
          value: values
        });
      });
      this.windowOpen("private.display.dropImageWindow");
    }

    // zipファイルの処理
    if (zipFiles.length > 0) {
      this.importStart({ zipFiles: zipFiles, isRoomCreate: false });
    }
  }

  createBase64DataSet(imageFile: any, { w, h }: { w: number; h: number }): any {
    // 画像の読み込み処理
    const normalLoad = new Promise<String>(
      (resolve: Function, reject: Function) => {
        try {
          const reader: any = new FileReader();
          reader.onload = function(event: any) {
            // サムネイル画像でない場合はプレーンな画像データからBase64データを取得する
            resolve(reader.result);
          };
        } catch (error) {
          reject(error);
        }
      }
    );
    // サムネイル画像の読み込み処理
    const thumbnailLoad = new Promise<String>(
      (resolve: Function, reject: Function) => {
        // 画像の読み込み処理
        try {
          const reader: any = new FileReader();
          reader.onload = function(event: any) {
            // サムネイル画像作成の場合は小さくて決まったサイズの画像データに加工する（アニメGIFも最初の１コマの静止画になる）

            const image = new Image();
            image.onload = function() {
              const useSize = {
                w: image.width,
                h: image.height
              };

              // 大きい場合は、比率を保ったまま縮小する
              if (useSize.w > w || useSize.h > h) {
                const scale = Math.min(w / useSize.w, h / useSize.h);
                useSize.w = useSize.w * scale;
                useSize.h = useSize.h * scale;
              }

              // 画像を描画してデータを取り出す（Base64変換の実装）
              const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
                document.createElement("canvas")
              );
              const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
              canvas.width = w;
              canvas.height = h;
              const locate = {
                x: (canvas.width - useSize.w) / 2,
                y: (canvas.height - useSize.h) / 2
              };
              ctx.drawImage(image, locate.x, locate.y, useSize.w, useSize.h);

              // 非同期で返却
              resolve(canvas.toDataURL());
            };
            image.src = event.target.result;
          };
          reader.readAsDataURL(imageFile);
        } catch (error) {
          reject(error);
        }
      }
    );
    return Promise.all<String>([normalLoad, thumbnailLoad]).then(
      (values: String[]) => ({
        name: imageFile.name,
        imageArgList: getFileNameArgList(imageFile.name),
        thumbnail: values[0],
        image: values[1]
      })
    );
  }

  get currentAngle(): number {
    return this.arrangeAngle(this.angle.total + this.angleVolatile.dragging);
  }

  get sizeW(): number {
    return (this.columns + this.marginGridSize * 2) * this.gridSize;
  }

  get sizeH(): number {
    return (this.rows + this.marginGridSize * 2) * this.gridSize;
  }

  get gameTableStyle(): any {
    const translateZ = this.wheel;
    const zoom = (1000 - this.wheel) / 1000;
    const totalLeftX = (this.move.total.x + this.move.dragging.x) * zoom;
    const totalLeftY = (this.move.total.y + this.move.dragging.y) * zoom;
    let rotateZ = this.currentAngle;

    const transformList: string[] = [];
    transformList.push(`translateZ(${translateZ}px)`);
    transformList.push(`translateY(${totalLeftY}px)`);
    transformList.push(`translateX(${totalLeftX}px)`);
    transformList.push(`rotateY(0deg)`);
    transformList.push(`rotateX(0deg)`);
    transformList.push(`rotateZ(${rotateZ}deg)`);
    const result: any = {
      width: this.sizeW + "px",
      height: this.sizeH + "px",
      borderWidth: this.borderWidth + "px",
      transform: transformList.join(" ")
    };
    if (this.isUseImage) {
      result.backgroundImage = `url(${this.getBackgroundImage})`;
    }
    if (this.isModal) {
      result.filter = "blur(3px)";
    }
    return result;
  }

  get gridPaperStyle(): any {
    const maskColorObj = this.parseColor(this.marginMaskColor);
    maskColorObj.a = this.marginMaskAlpha;
    const marginMaskColorStr = maskColorObj.getRGBA();
    const result: any = {
      width: this.sizeW + "px",
      height: this.sizeH + "px",
      "background-color": marginMaskColorStr
    };
    if (this.isUseGridColor) {
      const colorObj = this.parseColor(this.marginGridColor);
      colorObj.a = 0.3;
      const marginGridColor3 = colorObj.getRGBA();
      colorObj.a = 0.1;
      const marginGridColor1 = colorObj.getRGBA();
      result["background-image"] =
        `linear-gradient(0deg, transparent -2px,` +
        `${marginGridColor3} 2px, ${marginGridColor3} 3%, transparent 4%, transparent 20%,` +
        `${marginGridColor1} 21%, ${marginGridColor1} 22%, transparent 23%, transparent 40%,` +
        `${marginGridColor1} 41%, ${marginGridColor1} 42%, transparent 43%, transparent 60%,` +
        `${marginGridColor1} 61%, ${marginGridColor1} 62%, transparent 63%, transparent 80%,` +
        `${marginGridColor1} 81%, ${marginGridColor1} 82%, transparent 83%, transparent),` +
        `linear-gradient(270deg, transparent -2px,` +
        `${marginGridColor3} 2px, ${marginGridColor3} 3%, transparent 4%, transparent 20%,` +
        `${marginGridColor1} 21%, ${marginGridColor1} 22%, transparent 23%, transparent 40%,` +
        `${marginGridColor1} 41%, ${marginGridColor1} 42%, transparent 43%, transparent 60%,` +
        `${marginGridColor1} 61%, ${marginGridColor1} 62%, transparent 63%, transparent 80%,` +
        `${marginGridColor1} 81%, ${marginGridColor1} 82%, transparent 83%, transparent)`;
    }
    return result;
  }

  @Watch("mouseLocate", { deep: true })
  onChangeMouseLocate(mouseLocate: any) {
    if (this.isDraggingLeft) {
      const obj = {
        x: mouseLocate.x - this.move.from.x,
        y: mouseLocate.y - this.move.from.y
      };
      this.setProperty({
        property: "map.move.dragging",
        value: obj,
        logOff: true
      });
    }
    if (this.isDraggingRight) {
      const angle = this.calcCoordinate(
        mouseLocate.x,
        mouseLocate.y,
        this.currentAngle
      ).angle;
      let angleDiff = this.arrangeAngle(angle - this.angleVolatile.dragStart);
      this.setProperty({
        property: "map.angle.dragging",
        value: angleDiff,
        logOff: true
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#gameTable {
  position: fixed;
  display: block;
  margin: auto;
  text-align: center;
  vertical-align: middle;
  background-position: 0 0;
  background-size: 100% 100%;
  cursor: crosshair;
  z-index: -1;
  /*
  box-sizing: border-box;
  */
  perspective: 1000px;
  border: ridge gray;
  overflow: hidden;
}

#gameTable:before {
  content: "";
  background: inherit; /*.bgImageで設定した背景画像を継承する*/
  -webkit-filter: blur(10px);
  -ms-filter: blur(10px);
  filter: blur(10px);
  position: absolute;
  /*ブラー効果で画像の端がボヤけた分だけ位置を調整*/
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  z-index: -1; /*重なり順序を一番下にしておく*/
}

#gameTable > div {
  background-position: 1px 1px;
  background-size: 48px 48px;
}

#mapBoardFrame {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: none;
  text-align: center;
  vertical-align: middle;
}
</style>
