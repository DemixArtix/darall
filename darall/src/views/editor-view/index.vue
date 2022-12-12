<template lang="pug">
.flex.container.justify-center
  EditorList(class="basis-6/12")
</template>

<script lang="ts">
  import DishForm from 'components/dish-form/index.vue';
  import CategoryForm from 'components/category-form/index.vue';
  import EditorList from 'components/editor-list/index.vue';

  import {defineComponent, computed} from "vue";
  import {useStore} from "vuex";

  import ICategory from "interfaces/ICategory";

  export default defineComponent({
    name: "index",
    components: { DishForm, CategoryForm, EditorList },
    setup() {
      const store = useStore();
      const categories = computed<ICategory[]>(() => {
        return store.getters['editor/categories']
      })

      return {
        categories
      }
    }
  })
</script>

<style scoped>

</style>