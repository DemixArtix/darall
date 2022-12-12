<template lang="pug">
.editor-list.m-1
  CategoryForm
  template(v-for="category in list" :key="category.id")
    .editor__list_row.category-item.flex.items-center.appearance
      .arrow.mr-5.cursor-pointer.transition-transform.origin-center.duration-300(
        @click="toggleExpandCategory(category.id)"
        :class="{'!rotate-[135deg] ': expandValues.some(item => item === category.id)}"
        )
      span.text-blue(class="text-[12px] mr-5") Категория: {{category.dishes.length}}
      | {{category.title}}
      .btn.btn-sm.btn-danger.ml-auto(@click="removeCategory(category, $event)") Удалить
    transition-group(
      name="dish"
      @before-enter="onBeforeEnter"
      @before-leave="onBeforeLeave"
      @enter="onEnter"
      @leave="onLeave"
      )
      .wrapper.overflow-y-hidden(
        v-if="expandValues.some(item => item === category.id)"
        key="dish"
        data-index="0"
      )
        DishForm(:categoryId="category.id")
      .wrapper.editor__list_row.overflow-y-hidden(
        v-if="expandValues.some(item => item=== category.id)"
        v-for="(dish, index) in category.dishes"
        :key="dish.id"
        :data-index="index + 1"
      )
        .dish-item.flex.items-center(
          )
          span.text-red(class="text-[12px] mr-5") Блюдо:
          | {{dish.name}}
          .btn.btn-sm.btn-danger.ml-auto(@click="removeDish(dish.id, category.id)") Удалить

</template>

<script lang="ts">
  //@ts-ignore
  import anime from 'animejs/lib/anime.es.js';

  import DishForm from 'components/dish-form/index.vue';
  import CategoryForm from 'components/category-form/index.vue';

  import {defineComponent, ref, computed} from "vue";
  import {useStore} from "vuex";

  import {Ref} from "vue";
  import IListItem from "interfaces/IListItem";
  import { cloneDeep } from 'lodash'

  export default defineComponent({
    name: "index",
    components: { DishForm, CategoryForm },
    setup() {
      const store = useStore()

      const list = computed<IListItem[]>(() => {
        return store.getters['editor/list'];
      });

      const expandValues: Ref<number[]> = ref([]);

      function toggleExpandCategory(id: number) {
        let result = expandValues.value.findIndex(item => item == Number(id));
        result !== -1 ? expandValues.value.splice(result, 1) : expandValues.value.push(id);
      }

      async function removeCategory({id, dishes}: IListItem, e: any) {
        if(dishes.length === 0) {
          let parent = e.target.parentNode;
          parent.classList.remove('appearance');
          parent.classList.add('deletion');
          let timer: any = null;
          parent.ontransitionend = (event: any) => {
            if(timer) {
              clearTimeout(timer)
            }
            timer = setTimeout(async () => {
              let success = await store.dispatch('editor/onRemoveCategory', id);
            }, 500)
          };
        }
      }

      async function removeDish(id: number, categoryId: number) {
        let success = await store.dispatch('editor/onRemoveDish', {id, categoryId});
      }

      function onBeforeEnter(el: any) {
        el.style.opacity = 0
        el.style.height = 0
        el.classList.add('animation')
      }

      function onBeforeLeave(el: any) {
        el.style.height = el.dataset.index == 0 ? '3.05rem' : '3rem';
        el.classList.remove('animation')
      }
      function onEnter(el: any, done: any) {
        anime({
          targets: el,
          opacity: 1,
          height: el.dataset.index == 0 ? '3.05rem' : '3rem',
          delay: el.dataset.index * 50,
          easing: 'easeInOutCirc',
          update: function(anim: any) {
            if(anim.progress > 2 && anim.progress < 3) {
              el.classList.remove('animation')
            }
          },
          complete: function () {
            el.style.height = 'auto'
            done()
          }
        })
      }

      function onLeave(el: any, done: any) {
        anime({
          targets: el,
          opacity: 0,
          height: 0,
          delay: el.dataset.index * 50,
          easing: 'easeInOutCirc',
          complete: done
        })
      }

      return {
        list,
        expandValues,
        toggleExpandCategory,
        onBeforeEnter,
        onBeforeLeave,
        onEnter,
        onLeave,
        removeCategory,
        removeDish
      }
    }
  })
</script>

<style scoped lang="sass">
.editor
  &__
    &list
      &_row
        border-style: solid
        border-color: rgba(#495057, .3)
        border-width: 0 1px 1px 1px
        text-align: left
        &.animation
          border-bottom-width: 0
        &:first-child
          border-top-width: 1px
        &.category-item
          overflow-y: hidden
          padding: 1rem .5rem 1rem 1rem
          &.appearance
            animation: 1s appearance
          &.deletion
            animation: 1s disappearance
            height: 0
            padding: 0
            border: none
        .dish-item
          padding: .5rem .5rem .5rem 2.75rem
          //&:not(:last-child)


.arrow
  width: .5rem
  height: .5rem
  position: relative
  border-style: solid
  border-color: #495057
  border-width: 1px 1px 0 0
  transform: rotate(45deg)

@keyframes appearance
  0%
    opacity: 0
    height: 0
    padding: 0 .5rem 0 1rem
  100%
    opacity: 1
    height: 4rem
    padding: 1rem .5rem 1rem 1rem


@keyframes disappearance
  0%
    opacity: 1
    height: 4rem
    padding: 1rem .5rem 1rem 1rem
  100%
    opacity: 0
    height: 0
    padding: 0 .5rem 0 1rem




</style>