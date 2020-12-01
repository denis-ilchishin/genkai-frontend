<template>
  <div>
    <b v-if="comment.reply_to">{{ `@${comment.reply_to.user.username}, ` }}</b>
    {{ comment.text }}
  </div>
</template>

<script>
export default {
  props: { comment: { type: Object, required: true } }
}
</script>

<style></style>
