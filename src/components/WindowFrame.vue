<template>
  <div
    :style="windowStyle"
    @mousedown="windowActive({ property: displayProperty, isClose: false })"
    @mouseup="mouseUp"
    @touchcancel="mouseUp"
    @touchend="mouseUp"
    @touchstart="deckHoverKey(displayProperty)"
    class="window"
    v-if="isDisplay"
  >
    <!-- コンテンツ -->
    <div class="_contents" :style="{ fontSize: fontSize + 'px' }" @wheel.stop>
      <slot />
    </div>

    <!-- タイトルバー -->
    <div
      class="window-title"
      :class="{ fix: isFix }"
      @mousedown.left.prevent="event => move(event, true)"
      @mouseup.left.prevent="event => move(event, false)"
      @touchstart.prevent="event => move(event, true, true)"
      @touchend.prevent="event => move(event, false, true)"
      @touchcancel.prevent="event => move(event, false, true)"
      @contextmenu.prevent
    >
      <!-- タイトル文言 -->
      <div>
        <span>{{ titleText }}</span>
        <span class="message" v-if="message">{{ message }}</span>
      </div>

      <!-- 文字サイズ変更 -->
      <label v-if="fontSizeBar" class="fontSizeSlider">
        文字サイズ{{ fontSize }}px
        <input
          type="range"
          min="10"
          max="18"
          v-model="fontSize"
          @mousedown.stop
        />
      </label>
    </div>

    <!-- サイズ変更つまみ -->
    <div
      class="corner-left-top"
      v-if="!isFix"
      @mousedown.left.prevent="event => resize(event, 'corner-left-top', true)"
      @mouseup.left.prevent="event => resize(event, 'corner-left-top', false)"
      @touchstart.prevent="
        event => resize(event, 'corner-left-top', true, true)
      "
      @touchend.prevent="event => resize(event, 'corner-left-top', false, true)"
      @touchcancel.prevent="
        event => resize(event, 'corner-left-top', false, true)
      "
      @contextmenu.prevent
    ></div>
    <div
      class="corner-left-bottom"
      v-if="!isFix"
      @mousedown.left.prevent="
        event => resize(event, 'corner-left-bottom', true)
      "
      @mouseup.left.prevent="
        event => resize(event, 'corner-left-bottom', false)
      "
      @touchstart.prevent="
        event => resize(event, 'corner-left-bottom', true, true)
      "
      @touchend.prevent="
        event => resize(event, 'corner-left-bottom', false, true)
      "
      @touchcancel.prevent="
        event => resize(event, 'corner-left-bottom', false, true)
      "
      @contextmenu.prevent
    ></div>
    <div
      class="corner-right-top"
      v-if="!isFix"
      @mousedown.left.prevent="event => resize(event, 'corner-right-top', true)"
      @mouseup.left.prevent="event => resize(event, 'corner-right-top', false)"
      @touchstart.prevent="
        event => resize(event, 'corner-right-top', true, true)
      "
      @touchend.prevent="
        event => resize(event, 'corner-right-top', false, true)
      "
      @touchcancel.prevent="
        event => resize(event, 'corner-right-top', false, true)
      "
      @contextmenu.prevent
    ></div>
    <div
      class="corner-right-bottom"
      v-if="!isFix"
      @mousedown.left.prevent="
        event => resize(event, 'corner-right-bottom', true)
      "
      @mouseup.left.prevent="
        event => resize(event, 'corner-right-bottom', false)
      "
      @touchstart.prevent="
        event => resize(event, 'corner-right-bottom', true, true)
      "
      @touchend.prevent="
        event => resize(event, 'corner-right-bottom', false, true)
      "
      @touchcancel.prevent="
        event => resize(event, 'corner-right-bottom', false, true)
      "
      @contextmenu.prevent
    ></div>
    <div
      class="side-top"
      v-if="!isFix"
      @mousedown.left.prevent="event => resize(event, 'side-top', true)"
      @mouseup.left.prevent="event => resize(event, 'side-top', false)"
      @touchstart.prevent="event => resize(event, 'side-top', true, true)"
      @touchend.prevent="event => resize(event, 'side-top', false, true)"
      @touchcancel.prevent="event => resize(event, 'side-top', false, true)"
      @contextmenu.prevent
    ></div>
    <div
      class="side-left"
      v-if="!isFix"
      @mousedown.left.prevent="event => resize(event, 'side-left', true)"
      @mouseup.left.prevent="event => resize(event, 'side-left', false)"
      @touchstart.prevent="event => resize(event, 'side-left', true, true)"
      @touchend.prevent="event => resize(event, 'side-left', false, true)"
      @touchcancel.prevent="event => resize(event, 'side-left', false, true)"
      @contextmenu.prevent
    ></div>
    <div
      class="side-right"
      v-if="!isFix"
      @mousedown.left.prevent="event => resize(event, 'side-right', true)"
      @mouseup.left.prevent="event => resize(event, 'side-right', false)"
      @touchstart.prevent="event => resize(event, 'side-right', true, true)"
      @touchend.prevent="event => resize(event, 'side-right', false, true)"
      @touchcancel.prevent="event => resize(event, 'side-right', false, true)"
      @contextmenu.prevent
    ></div>
    <div
      class="side-bottom"
      v-if="!isFix"
      @mousedown.left.prevent="event => resize(event, 'side-bottom', true)"
      @mouseup.left.prevent="event => resize(event, 'side-bottom', false)"
      @touchstart.prevent="event => resize(event, 'side-bottom', true, true)"
      @touchend.prevent="event => resize(event, 'side-bottom', false, true)"
      @touchcancel.prevent="event => resize(event, 'side-bottom', false, true)"
      @contextmenu.prevent
    ></div>

    <!-- 閉じるボタン -->
    <span v-if="!isBanClose" @contextmenu.prevent>
      <i class="icon-cross window-close" @click.left.prevent="closeWindow"></i>
    </span>

    <!-- 立ち絵 -->
    <stand-image-component
      class="standImage"
      v-for="(standImage, index) in standImageList"
      :key="index"
      :standImage="standImage.standImage"
      :drawDiff="true"
      @click="clickStandImage(standImage.standImage, index)"
      :style="standImageStyle(standImage.standImage)"
      @contextmenu.prevent
    />
  </div>
</template>

<script lang="ts">
import StandImageComponent from "@/components/parts/StandImageComponent.vue";

import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  components: { StandImageComponent }
})
export default class WindowFrame extends Vue {
  @Action("windowClose") private windowClose: any;
  @Action("setProperty") private setProperty: any;
  @Action("windowActive") private windowActive: any;
  @Getter("getStateValue") private getStateValue: any;
  @Getter("isModal") private isModal: any;

  @Prop({ type: String, required: true })
  private titleText!: string;

  @Prop({ type: String, required: true })
  private displayProperty!: string;

  @Prop({ type: String, required: true })
  private align!: string;

  @Prop({ type: String })
  private baseSize!: string | null;

  @Prop({ type: String })
  private fixSize!: string | null;

  @Prop({ type: Boolean, default: false })
  private isBanClose!: boolean;

  @Prop({ type: Boolean, default: false })
  private fontSizeBar!: boolean;

  @Prop({ type: String })
  private message!: string | null;

  private moveMode: string = "";
  private mouse: any = {
    x: 0,
    y: 0,
    saveX: 0,
    saveY: 0
  };

  public windowFactor: any = {
    l: 0, // left
    r: 0, // right
    t: 0, // top
    b: 0, // bottom
    w: 0, // width
    h: 0, // height
    draggingX: 0,
    draggingY: 0
  };

  private fontSize: number = 12;

  mounted(): void {
    const _ = this;
    document.addEventListener("mousemove", event => {
      _.mouse.x = event.pageX;
      _.mouse.y = event.pageY;
      _.reflesh();
    });
    document.addEventListener("touchmove", event => {
      _.mouse.x = event.changedTouches[0].pageX;
      _.mouse.y = event.changedTouches[0].pageY;
      _.reflesh();
    });
    this.addEventForIFrame();
  }

  closeWindow(this: any): void {
    // window.console.log(`  [methods] closeWindow(click [x]button)`)
    this.windowClose(this.displayProperty);
    this.$emit("cancel");
  }

  mouseUp(event: any): void {
    const evtObj = {
      clientX: event.pageX,
      clientY: event.pageY,
      button: event.button
    };
    if (event.button === 2) {
      this.setProperty({
        property: `map.isOverEvent`,
        value: true,
        logOff: true
      });
    }
    document
      .getElementById("mapBoardFrame")!
      .dispatchEvent(new MouseEvent("mouseUp", evtObj));
  }

  resize(
    this: any,
    event: any,
    direct: string,
    flg: boolean,
    isTouch: boolean
  ): void {
    if (flg) {
      this.mouse.saveX = isTouch
        ? event.changedTouches[0]["pageX"]
        : event.pageX;
      this.mouse.saveY = isTouch
        ? event.changedTouches[0]["pageY"]
        : event.pageY;
    } else {
      const moveMode = this.moveMode;
      const winFac = this.windowFactor;
      // window.console.log(this.moveMode, winFac.x, winFac.y, winFac.w, winFac.h, winFac.draggingX, winFac.draggingY)
      if (moveMode.indexOf("right") >= 0) {
        winFac.r -= winFac.draggingX;
        winFac.w += winFac.draggingX;
      }
      if (moveMode.indexOf("left") >= 0) {
        winFac.l += winFac.draggingX;
        winFac.w -= winFac.draggingX;
      }
      if (moveMode.indexOf("top") >= 0) {
        winFac.t += winFac.draggingY;
        winFac.h -= winFac.draggingY;
      }
      if (moveMode.indexOf("bottom") >= 0) {
        winFac.b -= winFac.draggingY;
        winFac.h += winFac.draggingY;
      }
      winFac.draggingX = 0;
      winFac.draggingY = 0;
      this.mouseUp(event);
    }
    // window.console.log(this.moveMode, this.windowFactor.x, this.windowFactor.y, this.windowFactor.w, this.windowFactor.h, this.windowFactor.draggingX, this.windowFactor.draggingY)
    this.moveMode = flg ? direct : "";
  }

  reflesh(this: any): void {
    const x = this.mouse.x;
    const y = this.mouse.y;
    const moveX = x - this.mouse.saveX;
    const moveY = y - this.mouse.saveY;
    switch (this.moveMode) {
      case "side-top":
      case "side-bottom":
      case "corner-left-top":
      case "corner-left-bottom":
      case "corner-right-top":
      case "corner-right-bottom":
      case "move":
        this.windowFactor.draggingY = moveY;
    }
    switch (this.moveMode) {
      case "side-left":
      case "side-right":
      case "corner-left-top":
      case "corner-left-bottom":
      case "corner-right-top":
      case "corner-right-bottom":
      case "move":
        this.windowFactor.draggingX = moveX;
    }
    // window.console.log(this.moveMode, this.windowFactor.x, this.windowFactor.y, this.windowFactor.w, this.windowFactor.h, this.windowFactor.draggingX, this.windowFactor.draggingY)
  }

  move(this: any, event: any, flg: boolean, isTouch: boolean): void {
    if (flg) {
      this.mouse.saveX = isTouch
        ? event.changedTouches[0]["pageX"]
        : event.pageX;
      this.mouse.saveY = isTouch
        ? event.changedTouches[0]["pageY"]
        : event.pageY;
    } else {
      this.windowFactor.r -= this.windowFactor.draggingX;
      this.windowFactor.t += this.windowFactor.draggingY;
      this.windowFactor.l += this.windowFactor.draggingX;
      this.windowFactor.b -= this.windowFactor.draggingY;
      this.windowFactor.draggingX = 0;
      this.windowFactor.draggingY = 0;
      this.mouseUp(event);
    }
    this.moveMode = flg ? "move" : "";
  }

  addEventForIFrame(this: any): void {
    const elms: HTMLCollection = document.getElementsByTagName("iFrame");
    Array.prototype.slice.call(elms).forEach((iFrameElm: HTMLIFrameElement) => {
      // マウス移動
      const mouseMoveListener = (event: any) => {
        const iFrameRect = iFrameElm.getBoundingClientRect();
        const evtObj = {
          clientX: event.pageX + iFrameRect.left,
          clientY: event.pageY + iFrameRect.top
        };
        document.dispatchEvent(new MouseEvent("mousemove", evtObj));
      };
      // タッチ移動
      const touchMoveListener = (event: any) => {
        const iFrameRect = iFrameElm.getBoundingClientRect();
        const evtObj: any = {
          changedTouches: [
            {
              clientX: event.changedTouches[0]["pageX"] + iFrameRect.left,
              clientY: event.changedTouches[0]["pageY"] + iFrameRect.top
            }
          ]
        };
        document.dispatchEvent(new MouseEvent("touchmove", evtObj));
      };
      // クリック
      const clickListener = (event: any) => {
        const iFrameRect = iFrameElm.getBoundingClientRect();
        const evtObj = {
          clientX: event.pageX + iFrameRect.left,
          clientY: event.pageY + iFrameRect.top,
          button: event.button
        };
        document
          .getElementById("mapBoardFrame")!
          .dispatchEvent(new MouseEvent("click", evtObj));
      };
      // マウス離す
      const _ = this;
      const mouseUpListener = (event: any) => {
        const iFrameRect = iFrameElm.getBoundingClientRect();
        const evtObj = {
          clientX: event.pageX + iFrameRect.left,
          clientY: event.pageY + iFrameRect.top,
          button: event.button
        };
        if (event.button === 2) {
          _.setProperty({
            property: `map.isOverEvent`,
            value: true,
            logOff: true
          });
        }
        document
          .getElementById("mapBoardFrame")!
          .dispatchEvent(new MouseEvent("mouseUp", evtObj));
      };
      // コンテキストメニュー防止
      const contextMenuListener = () => {
        return false;
      };
      if (!iFrameElm.onload) {
        try {
          iFrameElm.onload = () => {
            try {
              const bodyElm: HTMLDocument = iFrameElm.contentWindow!.document;
              if (!bodyElm.onmousemove) {
                bodyElm.onmousemove = mouseMoveListener;
              }
              if (!bodyElm.ontouchmove) {
                bodyElm.ontouchmove = touchMoveListener;
              }
              if (!bodyElm.onmouseup) {
                bodyElm.onmouseup = mouseUpListener;
              }
              if (!bodyElm.oncontextmenu) {
                bodyElm.oncontextmenu = contextMenuListener;
              }
              if (!bodyElm.onclick) {
                bodyElm.onclick = clickListener;
              }
              /*
                const aElms = bodyElm.getElementsByTagName('a')
                for (const aElm of aElms) {
                  if (!aElm.onmousemove) { aElm.onmousemove = mouseMoveListener }
                  if (!aElm.ontouchmove) { aElm.ontouchmove = touchMoveListener }
                  if (!aElm.oncontextmenu) { aElm.oncontextmenu = contextMenuListener }
                  if (!aElm.onclick) { aElm.onclick = clickListener }
                }
                */
            } catch (error) {
              /* Nothing */
            }
          };
        } catch (error) {
          /* Nothing */
        }
      }
      if (!iFrameElm.onmousemove) {
        iFrameElm.onmousemove = mouseMoveListener;
      }
      if (!iFrameElm.ontouchmove) {
        iFrameElm.ontouchmove = touchMoveListener;
      }
      if (!iFrameElm.onmouseup) {
        iFrameElm.onmouseup = mouseUpListener;
      }
      if (!iFrameElm.onclick) {
        iFrameElm.onclick = clickListener;
      }
    });
  }

  clickStandImage(standImage: any, index: number): void {
    this.standImageList.splice(index, 1);
  }

  standImageStyle(standImage: any): any {
    const locate = standImage.locate;
    const mpx: number = (192 * (locate - 1)) / 12;
    return {
      left: `calc((100% - 192px) * ${locate - 1} / 11)`
    };
  }

  @Watch("command", { deep: true })
  onChangeCommand(this: any, command: any) {
    if (!command) {
      return;
    }
    if (command.command === "open" || command.command === "reset") {
      this.windowFactor.l = 0;
      this.windowFactor.r = 0;
      this.windowFactor.t = 0;
      this.windowFactor.b = 0;
      this.windowFactor.w = 0;
      this.windowFactor.h = 0;
    }
    if (command.command === "open") {
      setTimeout(this.addEventForIFrame, 0);
    }
    this.setProperty({
      property: `${this.displayProperty}.command`,
      value: null,
      logOff: true
    });
    setTimeout(() => this.$emit(command.command, command.payload), 0);
  }

  get isDisplay(this: any): string {
    return !this.displayProperty
      ? ""
      : this.getStateValue(this.displayProperty).isDisplay;
  }

  get command(this: any): string {
    return !this.displayProperty
      ? ""
      : this.getStateValue(this.displayProperty).command;
  }
  get zIndex(this: any): any {
    return this.getStateValue(this.displayProperty).zIndex;
  }
  get standImageList(this: any): any[] {
    return this.getStateValue(this.displayProperty).standImageList || [];
  }
  get isFix(this: any): boolean {
    return this.fixSize !== undefined;
  }
  get fixW(this: any): number {
    return !this.isFix ? -1 : parseInt(this.fixSize.split(",")[0].trim(), 10);
  }
  get fixH(this: any): number {
    return !this.isFix ? -1 : parseInt(this.fixSize.split(",")[1].trim(), 10);
  }
  get base(this: any): any {
    if (!this.baseSize) {
      return { w: 0, h: 0 };
    }
    return {
      w: parseInt(this.baseSize.split(",")[0].trim(), 10),
      h: parseInt(this.baseSize.split(",")[1].trim(), 10)
    };
  }

  @Emit("windowStyle")
  @Watch("windowStyle")
  onChangeWindowStyle(windowStyle: any) {}

  get windowStyle(this: any): any {
    const moveMode = this.moveMode;
    const winFac = this.windowFactor;

    let left = winFac.l;
    let bottom = winFac.b;
    let right = winFac.r;
    let top = winFac.t;
    let height = winFac.h;
    let width = winFac.w;

    if (moveMode.indexOf("top") >= 0 || moveMode === "move") {
      top += winFac.draggingY;
      if (moveMode.indexOf("top") >= 0) {
        height -= winFac.draggingY;
      }
    }

    if (moveMode.indexOf("bottom") >= 0 || moveMode === "move") {
      bottom -= winFac.draggingY;
      if (moveMode.indexOf("bottom") >= 0) {
        height += winFac.draggingY;
      }
    }

    if (moveMode.indexOf("right") >= 0 || moveMode === "move") {
      right -= winFac.draggingX;
      if (moveMode.indexOf("right") >= 0) {
        width += winFac.draggingX;
      }
    }

    if (moveMode.indexOf("left") >= 0 || moveMode === "move") {
      left += winFac.draggingX;
      if (moveMode.indexOf("left") >= 0) {
        width -= winFac.draggingX;
      }
    }

    const obj: any = {
      left: this.align.indexOf("left") >= 0 ? left + "px" : undefined,
      right: this.align.indexOf("right") >= 0 ? right + "px" : undefined,
      top: this.align.indexOf("top") >= 0 ? top + 37 + "px" : undefined,
      bottom: this.align.indexOf("bottom") >= 0 ? bottom + "px" : undefined,
      "z-index": this.zIndex
    };
    if (
      this.align.indexOf("left") < 0 &&
      this.align.indexOf("right") < 0 &&
      this.align.indexOf("top") < 0 &&
      this.align.indexOf("bottom") < 0
    ) {
      if (this.isFix) {
        // obj.left = `calc((100% - ${this.fixW}px) / 2 + ${left}px)`
        obj.left = `calc(50% - ${this.fixW / 2 - left}px)`;
        obj.top = `calc(50% - ${this.fixH / 2 - top}px)`;
      } else {
        obj.left =
          this.base.w > 0
            ? `calc(50% - ${this.base.w / 2 - left}px)`
            : `calc(${-this.base.w / 2 + left}px)`;
        obj.top =
          this.base.h > 0
            ? `calc(50% - ${this.base.h / 2 - top}px)`
            : `calc(${-this.base.h / 2 + top}px)`;
      }
    }
    if (this.isFix) {
      obj.width = this.fixW + "px";
      obj.height = this.fixH + "px";
    } else {
      obj.width =
        this.base.w > 0
          ? `${this.base.w + width}px`
          : `calc(100% - ${-this.base.w - width + 10}px)`;
      obj.height =
        this.base.h > 0
          ? `${this.base.h + height}px`
          : `calc(100% - ${-this.base.h - height - 10}px)`;
    }
    if (this.isModal && this.zIndex <= 99999) {
      obj.filter = "blur(3px)";
    }
    return obj;
  }
}
</script>

<style scoped lang="scss">
@import "./common.scss";

.window {
  position: fixed;
  display: block;
  padding: 29px 8px 8px 8px;
  overflow: visible;
  min-height: 50px;
  border-radius: 8px 8px 0 0;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.6);
  border: solid gray 1px;
  box-sizing: border-box;
}
.window img,
.window button {
  white-space: nowrap;
}

._contents {
  position: relative;
  overflow: visible;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 91;
}

.window-title {
  @include flex-box(row, center, center);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1.5rem;
  border-radius: 8px 8px 0 0;
  border-bottom: solid rgba(0, 0, 0, 0.2) 1px;
  cursor: move;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;

  &.fix {
    background: linear-gradient(
      rgba(170, 233, 203, 0.8),
      rgba(142, 226, 186, 0.8)
    );
  }
  > div {
    position: absolute;
    left: 5px;

    > span:not(:first-child) {
      margin-left: 0.5em;
      padding: 0 0.5em;
      font-style: italic;
      text-underline: #444444;
      border-radius: 0.3em;
      background-color: white;
    }
  }
}

.window-close {
  position: absolute;
  top: 3px;
  right: 8px;
  padding: 3px;
  font-size: 8px;
  border: 2px solid rgba(0, 0, 0, 0.5);
  color: rgba(0, 0, 0, 0.5);
  transform-origin: right;
  transform: scale(0.8);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    border-color: black;
    color: black;
  }
}

.side-left,
.side-right,
.side-top,
.side-bottom,
.corner-left-top,
.corner-left-bottom,
.corner-right-top,
.corner-right-bottom {
  position: absolute;
  z-index: 90;
}

.side-left,
.side-right {
  top: 8px;
  width: 10px;
  height: calc(100% - 12px);
}

.side-top,
.side-bottom {
  left: 8px;
  height: 10px;
  width: calc(100% - 12px);
}

.corner-left-top,
.corner-left-bottom,
.corner-right-top,
.corner-right-bottom {
  width: 10px;
  height: 10px;
}

.side-left,
.corner-left-top,
.corner-left-bottom {
  left: -4px;
}
.side-right,
.corner-right-top,
.corner-right-bottom {
  right: -4px;
}
.side-top,
.corner-left-top,
.corner-right-top {
  top: -4px;
}
.side-bottom,
.corner-left-bottom,
.corner-right-bottom {
  bottom: -4px;
}

.side-left {
  cursor: w-resize;
}
.side-right {
  cursor: e-resize;
}
.side-top {
  cursor: n-resize;
}
.side-bottom {
  cursor: s-resize;
}
.corner-left-top {
  cursor: nw-resize;
}
.corner-left-bottom {
  cursor: sw-resize;
}
.corner-right-top {
  cursor: ne-resize;
  border-radius: 0 8px 0 0;
}
.corner-right-bottom {
  cursor: se-resize;
}

.fontSizeSlider {
  @include flex-box(row, center, center);
  font-size: 10px;

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background-image: linear-gradient(
      to bottom,
      rgb(160, 166, 162) 0%,
      rgb(201, 199, 200) 100%
    );
    height: 0.4em;
    width: 100%;
    border-radius: 0.3em;
    border: 1px solid rgb(167, 167, 167);
    border-top: 1px solid rgb(105, 110, 106);
    box-sizing: border-box;

    &:focus,
    &:active {
      outline: none;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      cursor: pointer;
      position: relative;
      width: 1em;
      height: 1em;
      display: block;
      background-image: linear-gradient(
        to bottom,
        rgb(242, 248, 246) 0%,
        rgb(242, 248, 246) 50%,
        rgb(230, 240, 239) 51%,
        rgb(230, 240, 239) 100%
      );
      border-radius: 50%;
      -webkit-border-radius: 50%;
      border: 1px solid rgb(167, 167, 167);
    }
  }
}
.standImage {
  width: 192px;
  height: 256px;
  position: absolute;
  bottom: calc(100% + 1px);

  &:hover {
    outline: solid 1px magenta;
  }
}
</style>
