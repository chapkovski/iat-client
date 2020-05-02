<template>
       <b-card header-tag="header">
          <template v-slot:header>
            <h6 class="mb-0">Press <span class='font-weight-bold'>"{{ controlledLetter.toUpperCase() }}"</span> for</h6>
          </template>
    <div v-for="(item, ind) in items" :key="ind">
      <div :class="styles[ind]">{{ item }}</div>
      <div v-if="ind + 1 < items.length">OR</div>
    </div>
       </b-card>
</template>

<script>
import _ from "lodash";
export default {
  props: {
    content: [String, Array],
    controlledLetter:String
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
