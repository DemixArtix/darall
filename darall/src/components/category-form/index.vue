<template lang="pug">
form.form.flex.items-center( @submit.prevent="createCategory($event)" novalidate )
  span.text-blue(class="text-[12px] !mr-5") Новая категория:
  Input(
    placeholder="Название категории"
    :error="v$.title.$error"
    label="Название категории"
    id="categoryTitle"
    v-model="form.title"
  )
  button.btn.btn-success.btn-sm.py-1.px-3.ml-auto( type="submit") Добавить
</template>

<script lang="ts">
  //@ts-ignore
  import Input from "includes/input";

  import { defineComponent, reactive } from 'vue'

  import { useVuelidate } from '@vuelidate/core'
  import { required, minLength } from '@vuelidate/validators'
  import { useStore } from 'vuex';

  interface IRules {
    title: any,
  }

  export default defineComponent({
    name: "index",
    components: {Input},
    setup() {
      const store = useStore();

      const form: { title: string }  = reactive({
        title: '',
      });

      const rules: IRules = {
        title: {
          required,
          minLengthValue: minLength(2),
        },
      };

      async function createCategory(e: any) {
        await v$.value.$validate();
        if(!v$.value.$invalid)  {
          let success = await store.dispatch('editor/onCreateCategory', form);
          if(success) {
            v$.value.$reset();
            e.target.reset()
          }
        }
      }

      const v$ = useVuelidate(rules, form);


      return {
        form,
        rules,
        v$,
        createCategory
      }
    }
  })
</script>

<style scoped lang="sass">
.form
  border: solid rgba(#495057, .3)
  border-width: 1px 1px 1px 1px
  padding: 0.3rem 0.5rem 0.3rem 2.75rem
  width: 100%
  & > *
    &:not(:last-child)
      margin-right: 0.5rem
</style>