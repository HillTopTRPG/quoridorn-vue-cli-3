<template>
  <input
    type="checkbox"
    @change="event => changeProperty(event.target.checked)"
    :checked="storePropertyValue"
    @dblclick.stop
    @contextmenu.prevent
    @keydown.enter.stop
    @keyup.enter.stop
    @keydown.229.stop
    @keyup.229.stop
  />
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "propCheckBox",
  props: {
    baseProperty: { type: String, required: true },
    objKey: { type: String, required: true },
    property: { type: String, required: true }
  },
  methods: {
    ...mapActions(["setProperty"]),
    changeProperty(value) {
      const useProperty = this.useProperty;
      if (!useProperty) return;
      this.setProperty({
        property: useProperty,
        value: value,
        isNotice: true,
        logOff: true
      });
    }
  },
  computed: mapState({
    ...mapGetters(["getStateValue"]),
    useProperty(state) {
      const index = this.getStateValue(this.baseProperty).findIndex(
        obj => obj.key === this.objKey
      );
      if (index === -1) return;
      return `${this.baseProperty}.${index}.${this.property}`;
    },
    storePropertyValue(state) {
      const useProperty = this.useProperty;
      if (!useProperty) return false;
      return this.getStateValue(useProperty);
    }
  })
};
</script>
