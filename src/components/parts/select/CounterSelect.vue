<template>
  <select-base defaultLabel="" :defaultSelectable="true" v-model="localValue">
    <option v-for="(property, index) in usePropertyList" :key="index" :value="property.property">{{property.property}}</option>
  </select-base>
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.vue";
import SelectBase from "./base/SelectBase.vue";

import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: { SelectBase }
})
export default class CounterSelect extends Mixins<SelectMixin>(SelectMixin) {
  @Getter("propertyList") private propertyList: any;

  private get usePropertyList(): any[] {
    const resultList = this.propertyList.filter((property: any) => {
      let result = true;
      if (property.type === "checkbox") result = false;
      return result;
    });

    resultList.unshift({
      property: "修正（イニシアティブ同値時比較用）"
    });

    resultList.unshift({
      property: "イニシアティブ"
    });

    return resultList;
  }
}
</script>
