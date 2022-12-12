<template lang="pug">
.container.flex.justify-center
  form(class="max-w-[400px] min-w-[300px]" @submit.prevent="auth($event)" novalidate )
    Input.mb-3(
      placeholder="Логин"
      :error="v$.login.$error"
      label="Логин"
      id="login"
      v-model="form.login"
    )
    Input.mb-3(
      placeholder="Пароль"
      :error="v$.password.$error"
      label="Пароль"
      id="password"
      v-model="form.password"
      type="password"
    )
    Input.mb-3(
      v-if="$route.name === 'register'"
      placeholder="Повторить пароль"
      :error="v$.passwordRepeat.$error"
      label="Повторить пароль"
      id="password-repeat"
      v-model="form.passwordRepeat"
      type="password"
    )
    button.btn.btn-success.w-100( type="submit") {{$route.name === 'login' ? 'Вход' : 'Регистрация'}}
    router-link.text-green.block.mt-2(:to="`${$route.name === 'register' ? '/login' : '/register'}`") {{$route.name === 'register' ? 'Вход' : 'Регистрация'}}
</template>

<script lang="ts">
  //@ts-ignore
  import Input from "includes/input";

  import { defineComponent, ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
  import { useVuelidate } from '@vuelidate/core'
  import { required, minLength } from '@vuelidate/validators'
  import {useStore} from 'vuex'
  import { useRouter, useRoute } from 'vue-router'
  import { Ref } from 'vue';

  import IUser from "interfaces/IUser";



  interface IRules {
    login: any,
    password: any,
    passwordRepeat?: any
  }

  export default defineComponent({
    name: "index",
    components: {Input},
    setup(props, context) {

      const router = useRouter();
      const route = useRoute();
      const store = useStore();

      const form: IUser = reactive({
        login: '',
        password: '',
        passwordRepeat: ''
      });

      const rules = computed<IRules>(() => {
        let rules: IRules = {
          login: {
            required,
            minLengthValue: minLength(2),
          },
          password: {
            required,
            minLengthValue: minLength(4),
          },
        };
        if(route.name === 'register') {
          rules.passwordRepeat = {
            minLengthValue: minLength(4),
            isEqual: (value: string) => {
              return value == form.password
            },
            required
          }
        }
        return rules
      });

      let v$ = useVuelidate(rules, form);

      async function auth(e: any) {
        await v$.value.$validate();
        if(!v$.value.$invalid) {
          if(route.name === 'register') {
            let success = await store.dispatch('user/onRegister', form);
            if(success) v$.value.$reset();
          } else {
            let success = await store.dispatch('user/onLogin', form);
            if(success) v$.value.$reset();
            e.target.reset()
            await store.dispatch('init')
          }
        }
      }

      return {
        form,
        auth,
        v$
      }
    }
  })
</script>

<style scoped lang="sass">

</style>