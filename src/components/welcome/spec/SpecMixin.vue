<script>
import SpecFrame from "./SpecFrame";
import SpecItem from "./SpecItem";
import SpecLink from "./SpecLink";
export default {
  components: { SpecFrame, SpecItem, SpecLink },
  methods: {
    openLink(id) {
      const elm = document
        .getElementById("welcomeWindowContents")
        .querySelector("#" + id);
      if (!elm) {
        window.console.error(`Not found => #${id}`);
        return;
      }
      if (!elm.checked) elm.click();
    }
  }
};
</script>
