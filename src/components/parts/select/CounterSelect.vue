<template>
  <select-base defaultLabel="カウンター名" v-model="localValue">
    <option v-for="(property, index) in propertyList" :key="index" :value="property.property">{{property.property}}</option>
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
}
</script>
