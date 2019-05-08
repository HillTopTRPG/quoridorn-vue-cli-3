<template>
  <select-base
    defaultLabel=""
    :defaultSelectable="true"
    v-model="localValue"
    :optionValueList="optionValueStrList"
  >
    <option
      v-for="character in useCharacterList"
      :key="character.key"
      :value="character.key"
    >{{character.name}}</option>
  </select-base>
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.ts";
import SelectBase from "./base/SelectBase.vue";

import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import { Prop } from "vue-property-decorator";

@Component({
  components: { SelectBase }
})
export default class CharacterSelect extends Mixins<SelectMixin>(SelectMixin) {
  @Getter("getMapObjectList") private getMapObjectList: any;

  @Prop({ type: Array, default: [] })
  private placeList!: string[];

  private get useCharacterList(): any[] {
    const resultList: any[] = [];

    // 配置場所の絞り込み
    if (this.placeList.length) {
      this.placeList.forEach(place =>
        Array.prototype.push.apply(
          resultList,
          this.getMapObjectList({
            kind: "character",
            place: place
          })
        )
      );
    } else {
      Array.prototype.push.apply(
        resultList,
        this.getMapObjectList({
          kind: "character"
        })
      );
    }

    return resultList;
  }

  protected get optionValueStrList(): string[] {
    return this.useCharacterList.map(character => character.key);
  }
}
</script>
