<template>
  <SelectBase defaultLabel="権限" v-model="localValue">
    <option :key="role.value" :value="role.value" v-for="role in roles">{{role.label}}</option>
  </SelectBase>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
import SelectMixin from "./base/SelectMixin.vue";
import SelectBase from "./base/SelectBase.vue";

@Component<PlayerTypeSelect>({
  name: "playerTypeSelect",
  mixins: [SelectMixin],
  components: { SelectBase }
})
export default class PlayerTypeSelect extends Vue {
  @Getter("roles") roles: any;
}
</script>
