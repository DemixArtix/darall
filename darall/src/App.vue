<template lang="pug">
.loader(v-if="$store.getters['loader']")
  .loader-ring
    div
    div
    div
    div
nav.flex.gap-2.justify-center.p-3.relative.w-fit.mx-auto
  router-link.link.btn.btn-light(class="w-[150px]" to="/") Меню
  router-link.link.btn.btn-light(class="w-[150px]" to="/editor") Редактор
  a.text-green.block.mt-2.cursor-pointer.absolute.left-full(v-if="$store.getters['user/auth']" @click.prevent="$store.dispatch('user/logOut')") Выход
router-view
</template>

<style lang="sass">
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

.loader
  position: absolute
  left: 0
  top: 0
  height: 100vh
  width: 100vw
  background-color: rgba(darkgrey, .5)
  .loader-ring
    display: inline-block
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
    width: 80px
    height: 80px

  .loader-ring div
    box-sizing: border-box
    display: block
    position: absolute
    width: 64px
    height: 64px
    margin: 8px
    border: 8px solid
    border-radius: 50%
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite
    border-color: #000 transparent transparent transparent

  .loader-ring div:nth-child(1)
    animation-delay: -0.45s

  .loader-ring div:nth-child(2)
    animation-delay: -0.3s

  .loader-ring div:nth-child(3)
    animation-delay: -0.15s

  @keyframes lds-ring
    0%
      transform: rotate(0deg)

    100%
      transform: rotate(360deg)




nav
  .link
    &.router-link-active
      background-color: black
      color: white

.form-label
  @apply text-[14px]
</style>
