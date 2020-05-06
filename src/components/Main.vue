<template>
  <div class="main d-flex flex-column justify-content-center">
    <b-toast
      v-if="error"
      id="error-toast"
      :title="error_obj.title"
      :variant="error_obj.variant"
      toaster="b-toaster-bottom-left"
      class="error-toast"
      toast-class="error-toast"
      :visible="true"
      no-auto-hide="true"
    >
      {{ error_obj.message }}
    </b-toast>

    <div class="main-row flex-fill d-flex flex-md-row ">
      <div class="left d-flex">
        <div class="partial-content flex-fill d-flex flex-column">
          <div
            :class="{
              flashing: flash_left,
              card_wrapper: true,
            }"
            @animationend="flash_left = false"
          >
            <partial
              class="flex-fill"
              v-touch="() => touchHandler('left')"
              :content="left_content"
              :controlledLetter="left_letter"
              :mobile="mobile"
            ></partial>
          </div>
        </div>
      </div>
      <div
        class="q align-items-center d-flex flex-column justify-content-center flex-fill "
      >
        <div class="q-body">
          <Q :q="q_content"></Q>
        </div>
      </div>
      <div class="right d-flex">
        <div class="flex-fill">
          <div
            :class="{ flashing: flash_right }"
            @animationend="flash_right = false"
          >
            <partial
              v-touch="() => touchHandler('right')"
              :content="right_content"
              :controlledLetter="right_letter"
              :mobile="mobile"
            ></partial>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Q from "./Q.vue";
import partial from "./Partial.vue";
import { format, formatDistanceStrict } from "date-fns";
import { isMobile } from "mobile-device-detect";
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
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keypress", this.hitButton);
  },
  data() {
    const left_letter = "a",
      right_letter = "s";
    return {
      currentKey: "&nbsp;",
      mobile: isMobile,
      show: true,
      error: false,
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
    error_obj() {
      let msg = {};
      if (this.currentKey && !this.allowedKeys.includes(this.currentKey)) {
        msg = this.showWrongLetterToast();
      } else if (!this.input_is_correct) msg = this.showErrorToast();

      return msg;
    },
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
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    showWrongLetterToast() {
      return {
        message: `This letter ${this.currentKey} is now allowed`,
        title: "Attention!",
        variant: "warning",
      };
    },
    showErrorToast() {
      return {
        message: "Wrong asnwer",
        title: "error!",
        variant: "danger",
      };
    },
    touchHandler(side) {
      if (side === "left") {
        this.hitButton({ keyCode: 97 });
      }
      if (side === "right") {
        this.hitButton({ keyCode: 115 });
      }
    },
    formatDate(t) {
      return format(t, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    },
    formatTimeDiff(t1, t2) {
      return formatDistanceStrict(t1, t2);
    },
    hitButton(e) {
      this.$bvToast.hide("error-toast");
      this.error = false;
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
      if (this.wrong_letter || !this.input_is_correct) {
        this.error = true;
        this.$bvToast.show("error-toast");
        return;
      }
      if (this.input_is_correct) {
        this.currentQ.answered = new Date();
        this.currentQ.time_to_answer =
          this.currentQ.answered - this.currentQ.shown;
        this.answers.push(this.currentQ);
        this.qpointer = (this.qpointer + 1) % this.questions.length;
      }
    },
  },
};
</script>

<style lang="scss">
.error-toast {
  @media (min-height: 400px) {
    margin-bottom: 120px;
  }
  @media (orientation: landscape) {
    max-width: 200px;
  }
}
html,
body,
#app,
.main {
  height: 100%;
  background: gray;
  display: flex;
  flex-flow: column;
}
.main-row {
  background: yellow;
  @media (min-width: 768px) {
    max-height: 500px;
  }
  @media (max-width: 768px) and(orientation: portrait) {
    flex-direction: column !important;
  }
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
