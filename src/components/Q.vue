<template>
  <div>
    <h2 v-if="q.type === 'text'">{{ q.content }}</h2>
    <img :src="q.content" alt="img" v-if="q.type === 'image'" height="300px" />
  </div>
</template>

<script>
 
export default {
  props: {
    q: [String, Object],
  },

  computed: {
    text_content() {
      return false;
    },
  },
};
</script>

<style scoped lang="scss"></style>
