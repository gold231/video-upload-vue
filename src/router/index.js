import Vue from "vue";
import VueRouter from "vue-router";
import Credential from "../views/Credential.vue"
import Videos from "../views/Videos.vue"
import Gallery from "../views/Gallery.vue"
import Folders from "../views/Folders.vue"

Vue.use(VueRouter);

export default new VueRouter({
  routes:  [
    {
      path: "",
      name: "Credential",
      component: Credential
    },
    {
      path: "/videos",
      name: "Videos",
      component: Videos
    },
    {
      path: "/gallery",
      name: "Gallery",
      component: Gallery
    },
    {
      path: "/folders/:id",
      name: "Folders",
      component: Folders
    }
  ],
});
