<template lang="pug">
.menu.container.w-50.grid.grid-cols-2.gap-5
  .menu__category(v-for="category in menu").flex.flex-column.items-start
    h4.menu__category-title.text-left.w-full.m-2.pb-2.font-bold.italic
      span.pl-2 {{category.title}}
      .blue-line.w-100
    .menu__item.w-100.text-left.mb-2(v-for="dish in category.dishes")
      span.block.pl-5.italic {{dish.name}}
      .red-line.w-25.ml-3
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import {useStore} from "vuex";
  import IListItem from "interfaces/IListItem";

  export default defineComponent({
    name: "index",
    setup() {
      const store = useStore()

      const menu = computed<IListItem[]>(() => {
        return store.getters['menu/menu']
      })

      return {
        menu
      }
    }
  })
</script>

<style scoped lang="sass">
.blue-line
  margin-top: 0.3rem
  height: 2px
  background: linear-gradient(90deg,#0066FF,#fff 95%)
.red-line
  height: 2px
  background: linear-gradient(90deg,#fff, #dc2626,#fff 95%)

</style>