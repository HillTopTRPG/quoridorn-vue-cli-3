<script lang="ts">
import AddressCalcMixin from "./AddressCalcMixin.vue";

import { Prop, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Mixin } from "vue-mixin-decorator";

@Mixin
export default class CanvasMixin extends AddressCalcMixin {
  @Action("windowOpen") protected windowOpen: any;
  @Action("setProperty") protected setProperty: any;
  @Getter("isFitGrid") protected isFitGrid: any;
  @Getter("getObj") protected getObj: any;
  @Getter("isRolling") protected isRolling: any;
  @Getter("rollObj") protected rollObj: any;
  @Getter("gridSize") protected gridSize: any;
  @Getter("marginGridSize") protected marginGridSize: any;

  @Prop({ type: String, required: true })
  protected type!: string;

  @Prop({ type: String, required: true })
  protected objKey!: string;

  protected isHover: boolean = false;

  leftDown(this: any): void {
    if (this.storeObj.isLock || this.isRolling) {
      this.$emit("leftDown");
      return;
    }
    // window.console.log(`  [methods] mousedown left on ${this.type}`)
    const rect = this.rect;
    const offset = {
      w: this.mouseOnTable.x - rect.left,
      h: this.mouseOnTable.y - rect.top
    };
    const pieceObj = {
      move: {
        from: {
          x: this.mouseOnTable.x,
          y: this.mouseOnTable.y
        },
        gridOffset: {
          x: Math.floor(offset.w / this.gridSize),
          y: Math.floor(offset.h / this.gridSize)
        }
      },
      isDraggingLeft: true
    };
    this.setProperty({
      property: `public.${this.type}.list.${this.storeIndex}`,
      value: pieceObj,
      logOff: true
    });
  }
  leftUp(this: any): void {
    if (this.storeObj.isLock || this.isRolling) {
      this.$emit("leftUp");
      return;
    }
    // window.console.log(`  [methods] mouseup left on ${this.type}`)
    const locate = {
      x: this.mouseOnTable.x - this.storeObj.move.gridOffset.x * this.gridSize,
      y: this.mouseOnTable.y - this.storeObj.move.gridOffset.y * this.gridSize
    };
    if (this.isFitGrid) {
      locate.x = (Math.ceil(locate.x / this.gridSize) - 1) * this.gridSize;
      locate.y = (Math.ceil(locate.y / this.gridSize) - 1) * this.gridSize;
    }
    const pieceObj = {
      left: locate.x,
      top: locate.y,
      move: {
        dragging: {
          x: 0,
          y: 0
        },
        gridOffset: {
          x: 0,
          y: 0
        }
      },
      isDraggingLeft: false
    };
    this.setProperty({
      property: `public.${this.type}.list.${this.storeIndex}`,
      value: pieceObj,
      logOff: true,
      isNotice: true
    });
  }
  rightDown(this: any): void {
    if (this.storeObj.isLock || this.isRolling) {
      this.$emit("rightDown");
    }
  }
  rightUp(this: any, event: any): void {
    this.setProperty({ property: `map.isOverEvent`, value: true });
    this.$emit("rightUp", event);
  }
  openContext(event: any, contextProperty: string): void {
    let pageX = event.pageX;
    let pageY = event.pageY;

    const obj = {
      objKey: this.objKey,
      x: pageX,
      y: pageY
    };
    this.setProperty({
      property: contextProperty,
      value: obj,
      logOff: true
    }).then(() => this.windowOpen(contextProperty));
  }
  mouseover(): void {
    this.isHover = true;
  }
  mouseout(): void {
    this.isHover = false;
  }
  arrangeAngle(angle: number): number {
    if (angle > 180) {
      angle -= 360;
    }
    if (angle < -180) {
      angle += 360;
    }
    return angle;
  }
  getAngle(this: any, mouseOnTable: any) {
    const rect = this.rect;
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    // 中心座標を基準としたマウス座標
    const loc = {
      x: mouseOnTable.x - center.x,
      y: mouseOnTable.y - center.y
    };
    // 中心点と指定された座標とを結ぶ線の角度を求める
    return (Math.atan2(loc.y, loc.x) * 180) / Math.PI;
  }
  rollStart(this: any) {
    this.setProperty({
      property: `map.rollObj.isRolling`,
      value: true,
      logOff: true
    });
    const angle = this.getAngle(this.mouseOnTable);
    const planeAngle = this.arrangeAngle(angle - this.angle.total);
    // window.console.log(`angle:${angle}, total:${this.angle.total}, dragStartB:${this.angle.dragStart}, dragStartA:${planeAngle}`)
    this.setProperty({
      property: `public.${this.type}.list.${this.storeIndex}.angle.dragStart`,
      value: planeAngle,
      logOff: true
    });
    const obj = {
      propName: this.type,
      key: this.objKey
    };
    this.setProperty({ property: `map.rollObj`, value: obj, logOff: true });
  }
  rollEnd(this: any, event: any) {
    // window.console.log(`rollEnd`, event.pageX, event.pageY)
    const mapObj: any = {
      rollObj: {
        isRolling: false
      }
    };
    if (event.button === 2) {
      mapObj.isOverEvent = true;
    }
    this.setProperty({ property: `map`, value: mapObj, logOff: true });
    const planeAngle = this.arrangeAngle(
      this.angle.dragging + this.angle.total
    );
    const total = this.arrangeAngle(Math.round(planeAngle / 30) * 30);
    // window.console.log(`angle:${angle}, planeAngle:${planeAngle}, totalB:${this.angle.total}, totalA:${total}`)
    const obj = {
      total: total,
      dragging: 0
    };
    this.setProperty({
      property: `public.${this.type}.list.${this.storeIndex}.angle`,
      value: obj,
      isNotice: true,
      logOff: true
    });
  }

  @Watch("mouseOnTable", { deep: true })
  onChangeMouseOnTable(this: any, mouseOnTable: any) {
    // window.console.log(`piece:${this.storeObj.name}, isDraggingLeft:${this.storeObj.isDraggingLeft}, isRolling:${this.isRolling}`)
    if (this.isRolling) {
      if (!this.isThisRolling) {
        return;
      }
      const angle = this.getAngle(mouseOnTable);
      const dragging = this.arrangeAngle(
        this.arrangeAngle(angle - this.angle.dragStart) - this.angle.total
      );
      this.setProperty({
        property: `public.${this.type}.list.${this.storeIndex}.angle.dragging`,
        value: dragging,
        logOff: true
      });
    } else {
      if (this.storeObj.isDraggingLeft) {
        const obj = {
          x: mouseOnTable.x - this.storeObj.move.from.x,
          y: mouseOnTable.y - this.storeObj.move.from.y
        };
        this.setProperty({
          property: `public.${this.type}.list.${this.storeIndex}.move.dragging`,
          value: obj,
          logOff: true
        });
      }
    }
  }

  get storeObj() {
    return this.getObj(this.objKey);
  }
  get storeIndex() {
    return this.$store.state.public[this.type].list.findIndex(
      (obj: any) => obj.key === this.objKey
    );
  }
  get angle() {
    return this.storeObj.angle;
  }
  get rect(): any {
    return {
      top: this.storeObj.top + this.storeObj.move.dragging.y,
      left: this.storeObj.left + this.storeObj.move.dragging.x,
      width: this.storeObj.columns * this.gridSize,
      height: this.storeObj.rows * this.gridSize
    };
  }
  get isThisRolling() {
    return (
      this.rollObj.isRolling &&
      this.rollObj.propName === this.type &&
      this.rollObj.key === this.objKey
    );
  }
  get isFix() {
    return this.storeObj.isFix;
  }
  get currentAngle() {
    return this.arrangeAngle(this.angle.total + this.angle.dragging);
  }
  get style() {
    const rectObj = this.rect;
    return {
      top: `${rectObj.top}px`,
      left: `${rectObj.left}px`,
      width: `${rectObj.width}px`,
      height: `${rectObj.height}px`,
      transform: `rotateZ(${this.arrangeAngle(
        Math.round(this.currentAngle / 30) * 30
      )}deg)`
    };
  }
}
</script>
