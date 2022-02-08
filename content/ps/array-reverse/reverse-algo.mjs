import { h } from "https://unpkg.com/preact@latest?module";
import htm from "https://unpkg.com/htm@latest?module";
import { List } from "https://unpkg.com/immutable@latest?module";

const html = htm.bind(h);

function ReverseArray(props) {
  const { context } = props;
  const i = context.get("i");
  const j = context.get("j");
  const array = context.get("array");
  if (array) {
    const rows = array.toArray().map((value, index) => {
      let className;
      let label;
      if (index === i) {
        className = "reverse-array-item reverse-i";
        label = "i";
      } else if (index === j) {
        className = "reverse-array-item reverse-j";
        label = "j";
      } else {
        className = "reverse-array-item";
        label = "";
      }
      return html`<div class=${className}>${value}</div>
        <div class="reverse-array-label">${label}</div>`;
    });
    return html`<div class="reverse-array">${rows}</div>`;
  } else {
    return html`<div class="reverse-array"></div>`;
  }
}

export const steps = [
  [
    "초기 배열을 준비하기",
    (context) => {
      const len = Math.floor(2 + 5 * Math.random());
      const array = Array.from({ length: len }, () =>
        Math.floor(10 + 90 * Math.random())
      );
      context.set("array", List(array));
      context.set("step", 1);
    },
  ],
  [
    "i를 0으로 설정하기",
    (context) => {
      context.set("i", 0);
      context.set("step", 2);
    },
  ],
  [
    "j를 (배열의 길이) - 1로 설정하기",
    (context) => {
      context.set("j", context.get("array").size - 1);
      context.set("step", 3);
    },
  ],
  [
    "i < j일 동안 반복하기",
    (context) => {
      if (context.get("i") < context.get("j")) {
        context.set("step", 4);
        context.set("fixed-steps", context.get("fixed-steps").push(3));
      } else {
        context.set("step", 7);
        context.set("fixed-steps", context.get("fixed-steps").pop());
      }
    },
  ],
  [
    "  i 위치와 j 위치의 값 바꾸기",
    (context) => {
      context.set(
        "array",
        context.get("array").withMutations((array) => {
          const temp = array.get(context.get("i"));
          array.set(context.get("i"), array.get(context.get("j")));
          array.set(context.get("j"), temp);
        })
      );
      context.set("step", 5);
    },
  ],
  [
    "  i를 1 증가시키기",
    (context) => {
      context.set("i", context.get("i") + 1);
      context.set("step", 6);
    },
  ],
  [
    "  j를 1 감소시키기",
    (context) => {
      context.set("j", context.get("j") - 1);
      context.set("step", 3);
      context.set("fixed-steps", context.get("fixed-steps").pop());
    },
  ],
  ["끝", () => { }],
];

export const algorithm = ReverseArray;
