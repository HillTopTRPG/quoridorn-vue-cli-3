import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// @ts-ignore
import store from "./store/store.js";

Vue.config.productionTip = false;

Vue.directive("img", (el: any, binding) => {
  const imgData = binding.value;
  if (!imgData) {
    el.src = "";
    return;
  }
  const img = new Image();
  img.src = imgData;

  img.onload = () => {
    el.src = imgData;
    el.style.opacity = "1";
    el.classList.add("loaded");
    if (el.className.indexOf("anime") >= 0) {
      el.style.transition = "all 0.5s ease";
    }
  };
});

Vue.directive("bg-img", (el: any, binding: any) => {
  const imgData = binding.value;

  if (!imgData) return;

  const img = new Image();

  img.onerror = () => {
    setTimeout(() => {
      delete el.style.backgroundImage;
      el.style.opacity = "0";
      el.classList.remove("loaded");
      delete el.style.transition;
    });
  };

  img.onload = () => {
    setTimeout(() => {
      el.style.backgroundImage = `url(${imgData})`;
      el.style.opacity = "1";
      el.classList.add("loaded");
      if (el.className.indexOf("anime") >= 0) {
        el.style.transition = "all 0.5s ease";
      }
    }, 100);
  };
  setTimeout(() => (img.src = imgData));
});

const app = new Vue({
  router,
  store,
  // components: {
  //   App: App
  // },
  render: h => h(App)
  // template: `<App/>`
});
app.$mount("#app");

// const versionWindow = new Vue({ store, components: { VersionWindow }, render: h => h(App)
//   // , template: `<VersionWindow/>`
// })
// versionWindow.$mount('#versionWindow')
