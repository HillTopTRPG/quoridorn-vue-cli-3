<script lang="ts">
import AddressCalcMixin from "./AddressCalcMixin.vue";

import { Prop, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Mixin } from "vue-mixin-decorator";

@Mixin
export default class CanvasMixin extends AddressCalcMixin {
  @Action("windowOpen") protected windowOpen: any;
  @Action("setProperty") protected setProperty: any;
  @Action("changeListObj") protected changeListObj: any;
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

  protected leftDown(this: any): void {
    if (this.storeObj.isLock || this.isRolling) {
      this.$emit("leftDown");
      return;
    }
    this.setProperty({
      property: `map.moveObj`,
      value: {
        key: this.objKey,
        isMoving: true
      },
      logOff: true
    });
    const rect = this.rect;
    const offset = {
      w: this.mouseOnTable.x - rect.left,
      h: this.mouseOnTable.y - rect.top
    };
    this.changeListObj({
      key: this.objKey,
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
    });
  }

  protected leftUp(this: any): void {
    if (this.storeObj.isLock || this.isRolling) {
      this.$emit("leftUp");
      return;
    }
    this.setProperty({
      property: `map.moveObj.isMoving`,
      value: false,
      logOff: true
    });
    const locate = {
      x: this.mouseOnTable.x - this.storeObj.move.gridOffset.x * this.gridSize,
      y: this.mouseOnTable.y - this.storeObj.move.gridOffset.y * this.gridSize
    };
    if (this.isFitGrid) {
      locate.x = (Math.ceil(locate.x / this.gridSize) - 1) * this.gridSize;
      locate.y = (Math.ceil(locate.y / this.gridSize) - 1) * this.gridSize;
    }
    this.changeListObj({
      key: this.objKey,
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
    });
  }

  protected rollStart(this: any) {
    const angle = this.getAngle(this.mouseOnTable);
    this.setProperty({
      property: `map.rollObj`,
      value: {
        key: this.objKey,
        isRolling: true
      },
      logOff: true
    });
    this.changeListObj({
      key: this.objKey,
      angle: {
        dragStart: this.arrangeAngle(angle - this.angle.total)
      }
    });
  }

  protected rollEnd(this: any, event: any) {
    // window.console.log(`rollEnd`, event.pageX, event.pageY)
    const mapObj: any = {
      rollObj: {
        isRolling: false
      }
    };
    if (event.button === 2) mapObj.isOverEvent = true;
    this.setProperty({ property: `map`, value: mapObj, logOff: true });
    const planeAngle = this.arrangeAngle(
      this.angle.dragging + this.angle.total
    );
    this.changeListObj({
      key: this.objKey,
      angle: {
        total: this.arrangeAngle(Math.round(planeAngle / 30) * 30),
        dragging: 0
      }
    });
  }

  protected rightDown(this: any): void {
    if (this.isRolling) {
      this.$emit("rightDown");
    }
  }

  protected rightUp(this: any, event: any): void {
    this.setProperty({ property: `map.isOverEvent`, value: true });
    this.$emit("rightUp", event);
  }

  protected openContext(event: any, contextProperty: string): void {
    this.setProperty({
      property: contextProperty,
      value: {
        objKey: this.objKey,
        x: event.pageX,
        y: event.pageY
      },
      logOff: true
    }).then(() => this.windowOpen(contextProperty));
  }

  protected mouseover(): void {
    this.isHover = true;
  }

  protected mouseout(): void {
    this.isHover = false;
  }

  protected getAngle(this: any, mouseOnTable: any) {
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

  @Watch("mouseOnTable", { deep: true })
  private onChangeMouseOnTable(this: any, mouseOnTable: any) {
    // window.console.log(`piece:${this.storeObj.name}, isDraggingLeft:${this.storeObj.isDraggingLeft}, isRolling:${this.isRolling}`)
    if (this.isRolling) {
      if (!this.isThisRolling) {
        return;
      }

      const angle = this.getAngle(mouseOnTable);
      const dragging = this.arrangeAngle(
        this.arrangeAngle(angle - this.angle.dragStart) - this.angle.total
      );
      this.changeListObj({
        key: this.objKey,
        angle: {
          dragging
        }
      });
    } else {
      if (this.storeObj.isDraggingLeft) {
        this.changeListObj({
          key: this.objKey,
          move: {
            dragging: {
              x: mouseOnTable.x - this.storeObj.move.from.x,
              y: mouseOnTable.y - this.storeObj.move.from.y
            }
          }
        });
      }
    }
  }

  protected get storeObj() {
    return this.getObj(this.objKey);
  }

  protected get angle() {
    return this.storeObj.angle;
  }

  protected get rect(): any {
    return {
      top: this.storeObj.top + this.storeObj.move.dragging.y,
      left: this.storeObj.left + this.storeObj.move.dragging.x,
      width: this.storeObj.columns * this.gridSize,
      height: this.storeObj.rows * this.gridSize
    };
  }

  protected get isThisRolling() {
    return this.rollObj.isRolling && this.rollObj.key === this.objKey;
  }

  protected get isFix() {
    return this.storeObj.isFix;
  }

  protected get currentAngle() {
    return this.arrangeAngle(this.angle.total + this.angle.dragging);
  }

  protected get style() {
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
