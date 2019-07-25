<template>
  <window-frame
    :titleText="titleText"
    display-property="private.display.initiativeWindow"
    align="right-top"
    baseSize="300, 500"
    @windowStyle="onChangeWindowStyle"
    ref="window"
  >
    <div class="contents">
      <div class="playOperationArea" @contextmenu.prevent>
        <!-- 拡大ボタン -->
        <ctrl-button @click="arrangeWindowSize(true)" v-if="isWindowViewScroll">
          ◁︎拡大
        </ctrl-button>

        <!-- 縮小ボタン -->
        <ctrl-button
          @click="arrangeWindowSize(false)"
          v-if="!isWindowViewScroll"
          :disabled="baseWindowWidth === 0"
        >
          縮小▷︎
        </ctrl-button>

        <!-- 空白 -->
        <div style="flex: 1;"></div>

        <!-- 設定ボタン -->
        <ctrl-button class="setting" @click="openSettingWindow">
          設定
        </ctrl-button>
      </div>
      <div class="playOperationArea" @contextmenu.prevent>
        <!-- 戻るボタン -->
        <ctrl-button
          class="back"
          @click="roundBack"
          :disabled="round === 0 || backDisabled"
        >
          戻る
        </ctrl-button>

        <!-- 次へボタン -->
        <ctrl-button class="next" @click="roundNext" :disabled="round === 0">
          次へ
        </ctrl-button>

        <!-- 空白 -->
        <div style="flex: 1;"></div>

        <!-- 戦闘開始ボタン -->
        <ctrl-button
          class="start"
          @click="battleStart"
          :disabled="sortCharacterList.length === 0"
        >
          戦闘開始
        </ctrl-button>

        <!-- 戦闘終了ボタン -->
        <ctrl-button class="end" @click="battleEnd" :disabled="round === 0">
          戦闘終了
        </ctrl-button>
      </div>
      <div class="tableContainer">
        <table @mousemove="event => moveDev(event)" @mouseup="moveDevEnd">
          <thead @contextmenu.prevent>
            <tr>
              <!-- 順番 -->
              <th :style="colStyle(0)">順番</th>

              <!-- イニシアティブ -->
              <divider
                :index="0"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <th :style="colStyle(1)" title="イニシアティブ">
                イニシアティブ
              </th>

              <!-- 修正（イニシアティブ同値時） -->
              <divider
                :index="1"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <th
                :style="colStyle(2)"
                title="修正（イニシアティブ同値時比較用）"
              >
                修正（イニシアティブ同値時比較用）
              </th>

              <!-- 名前 -->
              <divider
                :index="2"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <th :style="colStyle(3)" title="名前">名前</th>

              <!-- 追加パラメータ -->
              <template v-for="(property, index) in propertyList">
                <divider
                  :key="`th-${index}-divider`"
                  :index="3 + index"
                  @doubleClick="doubleClick"
                  prop="initiativeWindow"
                />
                <th
                  :key="`th-${index}`"
                  :style="colStyle(4 + index)"
                  :title="property.property"
                >
                  {{ property.property }}
                </th>
              </template>

              <!-- その他 -->
              <divider
                :index="3 + propertyList.length"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <th :style="colStyle(4 + propertyList.length)" title="その他">
                その他
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- ===============================================================
              コンテンツ
            -->
            <tr
              v-for="character in sortCharacterList"
              :key="character.key"
              @click="selectLine(character.key)"
              :class="{
                isActive: selectLineKey === character.key,
                roundPlayer: round && character.key === roundPlayerKey
              }"
            >
              <!-- 順番 -->
              <td :style="colStyle(0)">
                <span v-if="round && character.key === roundPlayerKey">●</span>
              </td>

              <!-- イニシアティブ -->
              <divider
                :index="0"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <td :style="colStyle(1)">
                <label>
                  <input
                    type="number"
                    :value="getInitiative(character.key)"
                    @change="
                      event =>
                        setInitiative(
                          character.key,
                          parseInt(event.target.value)
                        )
                    "
                  />
                </label>
              </td>

              <!-- 修正（イニシアティブ同値時） -->
              <divider
                :index="1"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <td :style="colStyle(2)">
                <label>
                  <input
                    type="number"
                    :value="getSubInitiative(character.key)"
                    @change="
                      event =>
                        setSubInitiative(
                          character.key,
                          parseInt(event.target.value)
                        )
                    "
                  />
                </label>
              </td>

              <!-- 名前 -->
              <divider
                :index="2"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <td :style="colStyle(3)" class="selectable">
                {{ character.name }}
              </td>

              <!-- 追加パラメータ -->
              <template v-for="(property, index) in propertyList">
                <divider
                  :key="`td-${index}-divider`"
                  :index="3 + index"
                  @doubleClick="doubleClick"
                  prop="initiativeWindow"
                />
                <td :key="`td-${index}`" :style="colStyle(4 + index)">
                  <label v-if="property.type === 'min'">
                    <input
                      type="number"
                      :value="getPropValue(character.key, index)"
                      :max="getMax(character.key, index + 1)"
                      @input="
                        event =>
                          setMin(
                            character.key,
                            index,
                            parseInt(event.target.value, 10)
                          )
                      "
                      @change="
                        event =>
                          arrangeMin(
                            character.key,
                            index,
                            parseInt(event.target.value, 10)
                          )
                      "
                      :class="{
                        isError:
                          getMax(character.key, index + 1) <
                          getPropValue(character.key, index)
                      }"
                    />
                  </label>
                  <label v-if="property.type === 'number'">
                    <input
                      type="number"
                      :min="getMin(character.key, index)"
                      :value="getPropValue(character.key, index)"
                      :max="getMax(character.key, index)"
                      @input="
                        event =>
                          setPropValue(
                            character.key,
                            index,
                            parseInt(event.target.value, 10)
                          )
                      "
                      :class="{
                        isError:
                          getPropValue(character.key, index) <
                            getMin(character.key, index) ||
                          getMax(character.key, index) <
                            getPropValue(character.key, index)
                      }"
                    />
                  </label>
                  <label v-if="property.type === 'max'">
                    <input
                      type="number"
                      :min="getMin(character.key, index - 1)"
                      :value="getPropValue(character.key, index)"
                      @input="
                        event =>
                          setMax(
                            character.key,
                            index,
                            parseInt(event.target.value, 10)
                          )
                      "
                      @change="
                        event =>
                          arrangeMax(
                            character.key,
                            index,
                            parseInt(event.target.value, 10)
                          )
                      "
                      :class="{
                        isError:
                          getPropValue(character.key, index) <
                          getMin(character.key, index - 1)
                      }"
                    />
                  </label>
                  <color-check-box
                    v-if="property.type === 'checkbox'"
                    type="checkbox"
                    :color="property.color"
                    :checked="getPropValue(character.key, index)"
                    @change="
                      checked => setPropValue(character.key, index, checked)
                    "
                  />
                </td>
              </template>

              <!-- その他 -->
              <divider
                :index="3 + propertyList.length"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <td :style="colStyle(4 + propertyList.length)">
                <label>
                  <textarea :value="character.text" readonly></textarea>
                </label>
              </td>
            </tr>
            <tr class="space">
              <!-- 順番 -->
              <td :style="colStyle(0)"></td>

              <!-- イニシアティブ -->
              <divider
                :index="0"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <td :style="colStyle(1)"></td>

              <!-- 修正（イニシアティブ同値時） -->
              <divider
                :index="1"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <td :style="colStyle(2)"></td>

              <!-- 名前 -->
              <divider
                :index="2"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <td :style="colStyle(3)"></td>

              <!-- 追加パラメータ -->
              <template v-for="(property, index) in propertyList">
                <divider
                  :key="`space-${index}-divider`"
                  :index="3 + index"
                  @doubleClick="doubleClick"
                  prop="initiativeWindow"
                />
                <td :key="`space-${index}`" :style="colStyle(4 + index)"></td>
              </template>

              <!-- その他 -->
              <divider
                :index="3 + propertyList.length"
                @doubleClick="doubleClick"
                prop="initiativeWindow"
              />
              <td :style="colStyle(4 + propertyList.length)"></td>
            </tr>
          </tbody>
        </table>
        <span
          class="widthScale"
          ref="widthScale"
          style="visibility: hidden"
        ></span>
      </div>
      <div class="operateArea">
        <ctrl-button @click="editButtonOnClick">変更</ctrl-button>
        <span style="width: 0.5em;"></span>
        <ctrl-button :disabled="true">削除</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowMixin from "../WindowMixin.vue";
import WindowFrame from "../WindowFrame.vue";
import Divider from "../parts/Divider.vue";
import ColorCheckBox from "@/components/parts/ColorCheckBox.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Vue, Watch } from "vue-property-decorator";
import { Action, Getter, Mutation } from "vuex-class";
import { sum } from "@/components/common/Utility";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame,
    Divider,
    ColorCheckBox
  }
})
export default class InitiativeWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("setProperty") private setProperty: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("changeListObj") private changeListObj: any;
  @Getter("getMapObjectList") private getMapObjectList: any;
  @Getter("getObj") private getObj: any;
  @Getter("round") private round: any;
  @Getter("roundPlayerKey") private roundPlayerKey: any;
  @Getter("propertyList") private propertyList: any;

  private windowWidth: number = 0;
  private windowPadding: number = 0;
  private isWindowViewScroll: boolean = false;

  private get titleText(): string {
    const initiateCharacter: any = this.getObj(this.roundPlayerKey);
    if (this.round === 0 || !initiateCharacter) return "イニシアティブ表";
    const initiative: number = initiateCharacter.property.initiative;
    return `ラウンド：${this.round}／イニシアティブ：${initiative}`;
  }

  private openSettingWindow() {
    this.windowOpen("private.display.initiativeSettingWindow");
  }

  private selectLine(selectLineKey: string | null) {
    this.setProperty({
      property: "private.display.initiativeWindow.selectLineKey",
      value: selectLineKey,
      logOff: true
    });
    if (selectLineKey) {
      this.changeListObj({
        key: selectLineKey,
        isNotice: false,
        viewHighlight: true
      });
    }
  }

  private moveDev(event: any) {
    if (this.movingIndex < 0) return;
    const diff = event.clientX - this.startX;
    const afterLeftWidth = this.startLeftWidth + diff;
    if (afterLeftWidth < 10) return;
    this.widthList.splice(this.movingIndex, 1, afterLeftWidth);

    const sumWidth = sum(this.widthList) + this.widthList.length - 1;

    const minWidth = 30;
    const lastWidth =
      this.windowWidth -
      this.windowPadding -
      (sumWidth - this.widthList[this.widthList.length - 1]);
    this.isWindowViewScroll = lastWidth < minWidth;
    this.widthList.splice(
      this.widthList.length - 1,
      1,
      Math.max(lastWidth, minWidth)
    );
  }

  private doubleClick() {
    window.console.log("doubleClick", this.movedIndex);

    const TEXT_PADDING = 8;
    const NUMBER_PADDING = 20;
    const CHECK_BOX_WIDTH = 20;

    let maxWidth = this.getWidth("aaa");
    if (this.movedIndex === 0) {
      // 順番
      maxWidth = this.getWidth("順番");
    }
    if (this.movedIndex === 1) {
      // イニシアティブ
      maxWidth = this.getWidth("0") + NUMBER_PADDING;
      this.characterList.forEach((character: any) => {
        maxWidth = Math.max(
          maxWidth,
          this.getWidth(character.property.initiative) + NUMBER_PADDING
        );
      });
    }
    if (this.movedIndex === 2) {
      // 修正（イニシアティブ同値時）
      maxWidth = this.getWidth("0") + NUMBER_PADDING;
      this.characterList.forEach((character: any) => {
        maxWidth = Math.max(
          maxWidth,
          this.getWidth(character.property.subInitiative) + NUMBER_PADDING
        );
      });
    }
    if (this.movedIndex === 3) {
      // 名前
      maxWidth = this.getWidth("名前") + TEXT_PADDING;
      this.characterList.forEach((character: any) => {
        maxWidth = Math.max(
          maxWidth,
          this.getWidth(character.name) + TEXT_PADDING
        );
      });
    }
    if (this.movedIndex > 3) {
      const formatIndex = this.movedIndex - 4;
      const prop = this.propertyList[formatIndex];
      switch (prop.type) {
        case "min":
        case "number":
        case "max":
          this.characterList.forEach((character: any) => {
            maxWidth = Math.max(
              maxWidth,
              this.getWidth(character.property[prop.refStr]) + NUMBER_PADDING
            );
          });
          break;
        case "checkbox":
          maxWidth = Math.max(maxWidth, CHECK_BOX_WIDTH);
          break;
        default:
          maxWidth = this.getWidth(prop.property) + TEXT_PADDING;
      }
    }
    this.widthList.splice(this.movedIndex, 1, maxWidth);

    const sumWidth = sum(this.widthList) + this.widthList.length - 1;
    const lastWidth = Math.max(
      this.windowWidth -
        this.windowPadding -
        (sumWidth - this.widthList[this.widthList.length - 1]),
      this.getWidth("その他")
    );

    this.widthList.splice(this.widthList.length - 1, 1, lastWidth);

    this.moveDevEnd();
  }

  private moveDevEnd() {
    this.setProperty({
      property: "private.display.initiativeWindow",
      value: {
        hoverDevIndex: -1,
        movingIndex: -1,
        startX: -1,
        startLeftWidth: -1,
        startRightWidth: -1
      },
      logOff: true
    });
  }

  private get characterList() {
    return this.getMapObjectList({ kind: "character" });
  }

  /* Start 列幅可変テーブルのプロパティ */
  private get selectLineKey(this: any) {
    return this.$store.state.private.display.initiativeWindow.selectLineKey;
  }

  private get widthList(this: any) {
    return this.$store.state.private.display.initiativeWindow.widthList;
  }

  private get movingIndex(this: any) {
    return this.$store.state.private.display.initiativeWindow.movingIndex;
  }

  private get movedIndex(this: any) {
    return this.$store.state.private.display.initiativeWindow.movedIndex;
  }

  private get startX(this: any) {
    return this.$store.state.private.display.initiativeWindow.startX;
  }

  private get startLeftWidth(this: any) {
    return this.$store.state.private.display.initiativeWindow.startLeftWidth;
  }

  private get baseWindowWidth(this: any) {
    return this.$store.state.private.display.initiativeWindow.baseWindowWidth;
  }

  private get startRightWidth(this: any) {
    return this.$store.state.private.display.initiativeWindow.startRightWidth;
  }

  private get colStyle() {
    return (index: number) => ({
      width: `${this.widthList[index]}px`
      // display: "inline-block"
    });
  }
  /* End 列幅可変テーブルのプロパティ */

  /**
   * 指定された文字列の表示幅を取得する
   * @param text
   */
  private getWidth(text: string): number {
    const widthScale: HTMLSpanElement = this.$refs
      .widthScale! as HTMLSpanElement;
    widthScale.innerText = text;
    const width: number = widthScale.offsetWidth;
    widthScale.innerText = "";
    return width;
  }

  @Watch("propertyList", { deep: true })
  private onChangeDataLabels(propertyList: any[]) {
    this.characterList.forEach((character: any) => {
      propertyList.forEach((prop: any, index: number) => {
        let newValue: any = null;
        let propName: string = prop.refStr;
        if (prop.type === "min") {
          newValue = 0;
        } else if (prop.type === "max") {
          newValue = 99;
        } else if (prop.type === "number") {
          if (prop.min > 0) newValue = prop.min;
          else if (prop.max < 0) newValue = prop.max;
          else newValue = 0;
        } else if (prop.type === "checkbox") {
          newValue = false;
        } else {
          newValue = null;
        }
        if (character.property[propName] === undefined) {
          // character.property[propName] = newValue;
          Vue.set(character.property, propName, newValue);
        }
      });
    });
  }

  @Watch("windowWidth", { immediate: true })
  private onChangeWindowWidth(windowWidth: number, oldWidth: number) {
    const sumWidth = sum(this.widthList) + this.widthList.length - 1;
    if (oldWidth === 0 && !this.windowPadding) {
      this.windowPadding = windowWidth - sumWidth;
      return;
    }
    if (!oldWidth || !windowWidth) return;
    const minWidth = 30;
    const lastWidth =
      windowWidth -
      this.windowPadding -
      (sumWidth - this.widthList[this.widthList.length - 1]);
    this.isWindowViewScroll = lastWidth < minWidth;
    this.widthList.splice(
      this.widthList.length - 1,
      1,
      Math.max(lastWidth, minWidth)
    );
  }

  private onChangeWindowStyle(windowStyle: any) {
    const widthMatchResult: string[] = windowStyle.width.match(/^[0-9]+/);
    if (widthMatchResult) {
      this.windowWidth = parseInt(widthMatchResult[0], 10);
    }
  }

  private arrangeWindowSize(isWide: boolean) {
    const windowFrame: WindowFrame = this.$refs.window as WindowFrame;
    const width = this.windowWidth;
    if (!isWide) {
      const newWidth: number = this.baseWindowWidth;
      const diff: number = newWidth - width;
      windowFrame.windowFactor.w += diff;
    } else {
      this.setProperty({
        property: "private.display.initiativeWindow.baseWindowWidth",
        value: width,
        logOff: true
      });
      const newWidth: number =
        sum(this.widthList) + this.widthList.length - 1 + this.windowPadding;
      const diff: number = newWidth - width;
      windowFrame.windowFactor.w += diff;
    }
  }

  private setInitiative(objKey: string, value: number) {
    this.changeListObj({
      key: objKey,
      isNotice: true,
      property: {
        initiative: value
      }
    });
  }

  private setSubInitiative(objKey: string, value: number) {
    this.changeListObj({
      key: objKey,
      isNotice: true,
      property: {
        subInitiative: value
      }
    });
  }

  private setMin(objKey: string, index: number, value: number) {
    const propertyObj: any = {};
    propertyObj[this.propertyList[index].refStr] = value;
    this.changeListObj({
      key: objKey,
      isNotice: true,
      property: propertyObj
    });
  }

  private arrangeMin(this: any, objKey: string, index: number, value: number) {
    if (this.getPropValue(objKey, index + 1) < value) {
      const propertyObj: any = {};
      propertyObj[this.propertyList[index + 1].refStr] = value;
      this.changeListObj({
        key: objKey,
        isNotice: true,
        property: propertyObj
      });
    }
  }

  private setMax(objKey: string, index: number, value: number) {
    // window.console.log("setMax", index, value);
    const propertyObj: any = {};
    propertyObj[this.propertyList[index].refStr] = value;
    this.changeListObj({
      key: objKey,
      isNotice: true,
      property: propertyObj
    });
  }

  private arrangeMax(this: any, objKey: string, index: number, value: number) {
    if (value < this.getPropValue(objKey, index - 1)) {
      const propertyObj: any = {};
      propertyObj[this.propertyList[index - 1].refStr] = value;
      this.changeListObj({
        key: objKey,
        isNotice: true,
        property: propertyObj
      });
    }
  }

  private setPropValue(objKey: string, index: number, value: any) {
    const prop: any = this.propertyList[index];

    const propertyObj: any = {};
    propertyObj[prop.property] = value;

    window.console.log(objKey, prop.property, value);

    this.changeListObj({
      key: objKey,
      isNotice: true,
      property: propertyObj
    });
  }

  private getMin(objKey: string, index: number): number | null {
    const prevProp: any = this.propertyList[index - 1];
    if (!prevProp || prevProp.type !== "min") {
      return this.propertyList[index].min || 0;
    } else {
      // 別プロパティ値を返却
      return <number>this.getPropValue(objKey, index - 1);
    }
  }

  private getMax(objKey: string, index: number): number | null {
    const nextProp: any = this.propertyList[index + 1];
    if (!nextProp || nextProp.type !== "max") {
      return this.propertyList[index].max || 99;
    } else {
      // 別プロパティ値を返却
      return <number>this.getPropValue(objKey, index + 1);
    }
  }

  private getInitiative(objKey: string) {
    return this.getObj(objKey).property.initiative;
  }

  private getSubInitiative(objKey: string) {
    return this.getObj(objKey).property.subInitiative;
  }

  private getPropValue(objKey: string, index: number): number | boolean | null {
    return this.getObj(objKey).property[this.propertyList[index].refStr];
  }

  private get sortCharacterList(): any[] {
    return this.characterList
      .concat()
      .filter((character: any) => character.place === "field")
      .sort((char1: any, char2: any) => {
        const prop1: any = char1.property;
        const prop2: any = char2.property;

        if (prop1.initiative > prop2.initiative) return -1;
        if (prop1.initiative < prop2.initiative) return 1;
        if (prop1.subInitiative > prop2.subInitiative) return -1;
        if (prop1.subInitiative < prop2.subInitiative) return 1;
        return 0;
      });
  }

  private get backDisabled(): boolean {
    const index: number = this.sortCharacterList.findIndex(
      (character: any) => character.key === this.roundPlayerKey
    );
    return index === 0 && this.round === 1;
  }

  private roundBack() {
    if (!this.roundPlayerKey) return;
    const index: number = this.sortCharacterList.findIndex(
      (character: any) => character.key === this.roundPlayerKey
    );
    const isPrevRound: boolean = index === 0;
    this.updateInitiative(
      isPrevRound ? this.round - 1 : this.round,
      this.sortCharacterList[
        isPrevRound ? this.sortCharacterList.length - 1 : index - 1
      ].key
    );
  }

  private roundNext() {
    if (!this.roundPlayerKey) return;
    const index: number = this.sortCharacterList.findIndex(
      (character: any) => character.key === this.roundPlayerKey
    );
    const isNextRound: boolean = index === this.sortCharacterList.length - 1;
    this.updateInitiative(
      isNextRound ? this.round + 1 : this.round,
      this.sortCharacterList[isNextRound ? 0 : index + 1].key
    );
  }

  private battleStart() {
    const character = this.sortCharacterList[0];
    this.updateInitiative(character ? 1 : 0, character ? character.key : null);
  }

  private battleEnd() {
    this.updateInitiative(0, null);
  }

  private updateInitiative(round: number, roundPlayerKey: string | null) {
    this.setProperty({
      property: "public.initiative",
      value: { round, roundPlayerKey },
      isNotice: true,
      logOff: true
    });
    this.selectLine(roundPlayerKey);
  }

  private editButtonOnClick() {
    alert("未実装です。");
  }
}
</script>

<style scoped lang="scss">
@import "../common.scss";

.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
  @include flex-box(column, normal, normal);

  .playOperationArea {
    @include flex-box(row, normal, normal);

    button {
      font-size: 10px;
      padding: 1px 3px;
      min-width: 4em;
      box-sizing: content-box;

      &.back,
      &.start {
        margin-right: 1em;
      }

      &.next {
        margin-right: 2em;
      }
    }
  }

  .operateArea {
    @include flex-box(row, center, center);
  }
}

.isError {
  background-color: orange !important;
}

button {
  border-radius: 0.5em;

  &:disabled {
    background-color: lightgrey;
  }
}

td {
  label {
    width: 100%;
    height: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input[type="number"],
  textarea {
    width: 100%;
    padding: 2px;
    height: 2em;
    box-sizing: border-box;
    border: none;
    background-color: transparent;
  }
  textarea {
    resize: none;
    outline: none;
    overflow: hidden;
    line-height: 2em;
    padding-top: 0.2em;
    padding-left: 0.2em;
  }
}

.tableContainer {
  overflow-y: scroll;
  position: relative;
  flex: 1;
  width: 100%;
  height: 216px;
  border: 1px solid rgb(183, 186, 188);
  font-size: 8px;
  box-sizing: border-box;
}

table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  background-image: linear-gradient(
    0deg,
    white 0%,
    white 50%,
    rgb(247, 247, 247) 51%,
    rgb(247, 247, 247) 100%
  );
  background-size: 4em 4em;

  td {
    &.dev {
      background-color: rgb(183, 186, 188);
      cursor: col-resize;
      position: relative;
      width: 1px;

      &:after {
        position: absolute;
        height: 100%;
        top: 0;
        left: -2px;
        content: "";
        width: 5px;
      }
    }

    i {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  tr {
    height: 2em;

    &.space {
      height: auto;
    }
  }
  th,
  td {
    padding: 0;
    white-space: nowrap;
    cursor: default;
  }

  th,
  td:not(.divider) {
    overflow: hidden;
  }

  tbody {
    height: 100%;

    tr {
      height: 2em;

      &:not(.space) {
        &.isActive {
          background-color: rgb(127, 206, 255) !important;
        }

        &:nth-child(odd):hover {
          background: rgb(178, 225, 255);
        }

        &:nth-child(even):hover {
          background: rgb(178, 225, 255);
        }
      }
    }

    td {
      text-align: center;
    }
  }

  thead {
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 1) 0%,
      rgba(234, 234, 234, 1) 100%
    );

    tr {
      border-bottom: 1px solid rgb(183, 186, 188);

      th:hover {
        background: rgb(178, 225, 255);
      }
    }
  }
}
</style>
