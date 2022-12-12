<template lang="pug">
form.form.flex.items-center(@submit.prevent="addDish($event)" novalidate )
  span.text-red(class="text-[12px] !mr-5") Новое блюдо:
  Input(
    placeholder="Название блюда"
    :error="v$.name.$error"
    label="Название блюда"
    id="name"
    v-model="form.name"
  )
  button.btn.btn-success.btn-sm.py-1.px-3.ml-auto( type="submit") Добавить

</template>

<script lang="ts">
  //@ts-ignore
  import Input from "includes/input";

  import { defineComponent, reactive, computed } from 'vue'
  import { useStore } from 'vuex';

  import useVuelidate from '@vuelidate/core';
  import { required, minLength } from '@vuelidate/validators'

  import IDish from "interfaces/IDish";
  import ICategory from "interfaces/ICategory";
  interface IRules {
    name: any,
    categoryId: any,
  }

  export default defineComponent({
    name: "index",
    components: { Input },
    props: {
      categoryId: {
        type: Number,
      }
    },
    setup(props) {
      const store = useStore();

      const categories = computed<ICategory[]>(() => {
        return store.getters['editor/categories']
      })



      const form: IDish  = reactive({
        name: '',
        categoryId: Number(props.categoryId),
      });


      let rules: IRules = {
        name: {
          required,
          minLengthValue: minLength(2),
        },
        categoryId: {
          required,
        },
      };
      let v$ = useVuelidate(rules, form);


      async function addDish(e: any) {
        await v$.value.$validate();
        if(!v$.value.$invalid) {
          let success = await store.dispatch('editor/onAddDish', form);
          if(success) {
            v$.value.$reset();
            form.name = ''
          }
        }
      }

      return {
        form,
        categories,
        v$,
        addDish,
      }
    }
  })
</script>

<style scoped lang="sass">
.form
  border: solid rgba(#495057, .3)
  border-width: 0 1px 1px 1px
  padding: 0.3rem 0.5rem 0.3rem 2.75rem
  width: 100%
  & > *
    &:not(:last-child)
      margin-right: 0.5rem
</style>