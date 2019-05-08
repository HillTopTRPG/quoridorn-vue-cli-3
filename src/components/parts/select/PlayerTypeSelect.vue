<template>
  <select-base
    defaultLabel="権限"
    v-model="localValue"
    :optionValueList="optionValueStrList"
  >
    <option :key="role.value" :value="role.value" v-for="role in roles">{{role.label}}</option>
  </select-base>
</template>

<script lang="ts">
import { Getter } from "vuex-class";
import SelectMixin from "./base/SelectMixin.ts";
import SelectBase from "./base/SelectBase.vue";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: { SelectBase }
})
export default class PlayerTypeSelect extends Mixins<SelectMixin>(SelectMixin) {
  @Getter("roles") private roles: any;

  protected get optionValueStrList(): string[] {
    return this.roles.map(role => role.value);
  }
}
</script>
