<template lang="pug">
.input
  label.hidden.mb-1.form-label( :for="id") {{label}}
  input.form-control(
    :id="id"
    :class="{'is-invalid': error}"
    @input="$emit('update:modelValue', $event.target.value)"
    :value="modelValue"
    :type="type"
    :placeholder="placeholder")
  #loginFeedback.invalid-feedback(:if="`${id}Feedback`" class="text-left ml-[3px] !text-[10px]" v-if="error") невалидные данные
</template>

<script>
  export default {
    name: "index",
    props: {
      placeholder: String,
      error: {
        type: Boolean,
        default: false
      },
      label: String,
      id: String,
      modelValue: String,
      type: {
        type: String,
        default: 'text'
      }
    },
    setup() {

    }
  }
</script>

<style scoped>

</style>