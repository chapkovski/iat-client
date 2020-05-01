<template>
  <div>
    <div v-for="(item, ind) in items" :key="ind">
      <div :class="styles[ind]">{{ item }}</div>
      <div v-if="ind + 1 < items.length">OR</div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  props: {
    content: [String, Array],
  },
  watch: {
    content: {
      immediate: true,
      handler: function(newVal){
      if (_.isArray(newVal)) {
        this.items = this.content;
      } else {
        this.items = [this.content];
      }
    },
    }
  },
  data() {
    return {
      items: [],
      styles: ["text-primary", "text-success"],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
