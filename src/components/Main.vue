<template >
  <b-container class="main-body" >
    <b-row class="main-row">
      <b-col >
        <div
          :class="{ flashing: flash_left }"
          @animationend="flash_left = false"
        >
          <partial
            v-touch="()=>touchHandler('left')" 
           
            :content="left_content"
            :controlledLetter="left_letter"
          ></partial>
        </div>
      </b-col>
      <b-col><Q :q="q_content"></Q></b-col>
      <b-col>
        <div
          :class="{ flashing: flash_right }"
          @animationend="flash_right = false"
        >
          <partial
             v-touch="()=>touchHandler('right')" 
            :content="right_content"
            :controlledLetter="right_letter"
          ></partial>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div
          class="alert alert-info"
          :class="{ flashing: animated }"
          @animationend="animated = false"
          v-html="currentKey"
        ></div>
      </b-col>
    </b-row>
    <b-row class="results"  v-if="answers.length > 0">
      <b-col>
        <h4>Results:</h4>
        <table class="results table">
          <thead>
            <tr>
              <th>Answer</th>
              <th>ID</th>
              <th>Shown</th>
              <th>Answered</th>
              <th>Time to answer</th>
            </tr>
          </thead>
          <tr v-for="(answer, idx) in answers.slice().reverse()" :key="idx">
            <td>{{ idx }}</td>
            <td>{{ answer.question }}</td>
            <td>{{ formatDate(answer.shown) }}</td>
            <td>{{ formatDate(answer.answered) }}</td>
            <td>{{ formatTimeDiff(answer.answered, answer.shown) }}</td>
          </tr>
        </table>
      </b-col>
    </b-row>
    <b-row>
      <b-alert
        v-model="error"
        class="position-fixed fixed-top m-0 rounded-0"
        style="z-index: 2000;"
        variant="danger"
        dismissible
        >Wrong answer!</b-alert
      >
    </b-row>
  </b-container>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import Q from "./Q.vue";
import partial from "./Partial.vue";
import {  format, formatDistanceStrict } from "date-fns";

export default {
  components: {
    Q,
    partial,
  },
  created() {
    window.addEventListener("keypress", this.hitButton);
    this.currentQ = {
      question: this.questions[this.qpointer].id,
      shown: new Date(),
    };
  },
  destroyed() {
    window.removeEventListener("keypress", this.hitButton);
  },
  data() {
    const left_letter = "a",
      right_letter = "s";
    return {
      currentKey: "&nbsp;",
      show: true,
      error: false,
      wrong_key_errors: [],
      animated: false,
      flash_left: false,
      flash_right: false,
      left_letter: left_letter,
      right_letter: right_letter,
      allowedKeys: [left_letter, right_letter],
      maxToasts: 3,
      delay: 1000,
      typeCorrespondance: {
        [left_letter]: "left",
        [right_letter]: "right",
      },
      questions: [
        {
          id: 0,
          left: "Insect",
          right: "Flower",
          q: { type: "text", content: "Ant" },
          correct: "left",
        },
        {
          id: 1,
          left: "Insect",
          right: "Flower",
          q: { type: "text", content: "Orchid" },
          correct: "right",
        },
        {
          id: 2,
          left: "Insect",
          right: "Flower",
          q: { type: "text", content: "Violet" },
          correct: "right",
        },
        {
          id: 3,
          left: "Insect",
          right: "Flower",
          q: { type: "text", content: "Wasp" },
          correct: "left",
        },
        {
          id: 4,
          left: "Insect",
          right: "Flower",
          q: { type: "text", content: "Bee" },
          correct: "left",
        },
      ],
      qpointer: 0,
      currentQ: {},
      answers: [],
    };
  },
  computed: {
    left_content() {
      return this.questions[this.qpointer].left;
    },
    right_content() {
      return this.questions[this.qpointer].right;
    },
    q_content() {
      return this.questions[this.qpointer].q;
    },
    right_answer() {
      return this.questions[this.qpointer].correct;
    },
    input_is_correct() {
      return this.right_answer === this.typeCorrespondance[this.currentKey];
    },
  },
  watch: {
    qpointer(newValue) {
      this.currentQ = {
        question: this.questions[newValue].id,
        shown: new Date(),
      };
    },
    currentQ() {
      console.debug("QQQQ", JSON.stringify(this.answers));
    },
  },
  methods: {
    onClick(){console.debug("CLICK");this.$emit('leftEvent')},
    touchHandler(side){ 
      if (side === 'left') { this.hitButton({keyCode:97})}
      if (side === 'right') { this.hitButton({keyCode:115})}
      
      },
    formatDate(t) {
      return format(t, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    },
    formatTimeDiff(t1, t2) {
      return formatDistanceStrict(t1, t2);
    },
    hitButton(e) {
      this.error = false;
      console.debug('KEYCODE', e.keyCode)
      this.currentKey = String.fromCharCode(e.keyCode).toLowerCase();
      this.animated = true;
      switch (this.typeCorrespondance[this.currentKey]) {
        case "left":
          this.flash_left = true;
          break;
        case "right":
          this.flash_right = true;
          break;
      }
      if (!this.allowedKeys.includes(this.currentKey)) {
        this.makeWrongLetterToast(this.currentKey);
        return;
      }
      if (this.input_is_correct) {
        this.currentQ.answered = new Date();
        this.currentQ.time_to_answer =
          this.currentQ.answered - this.currentQ.shown;
        this.answers.push(this.currentQ);
        this.qpointer = (this.qpointer + 1) % this.questions.length;
      } else {
        this.error = true;
      }
    },

    makeWrongLetterToast() {
      const newError = {
        letter: this.currentKey,
        visible: true,
        id: uuidv4(),
      };
      this.wrong_key_errors.push(newError);
      this.$bvToast.toast("This letter is not allowed", {
        title: `You typed   ${newError.letter}`,
        id: newError.id,
        solid: true,
        variant: "warning",
        autoHideDelay: this.delay,
        toaster: "b-toaster-bottom-left",
      });
      if (this.errors.length > this.maxToasts) {
        const remEl = this.wrong_key_errors.shift();
        this.$bvToast.hide(remEl.id);
      }
    },
  },
};
</script>

<style lang="scss">
.main-row {
  height: 400px;
}
.flashing {
  animation: flash 0.2s;
}

@keyframes flash {
  0% {
    border: none;
  }
  50% {
    border: 1px solid red;
  }
  100% {
    border: none;
  }
}
</style>
