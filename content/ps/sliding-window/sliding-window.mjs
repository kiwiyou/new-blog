import { h } from "https://unpkg.com/preact@latest?module";
import {
  useState,
  useEffect,
} from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";
import htm from "https://unpkg.com/htm@latest?module";
import { List } from "https://unpkg.com/immutable@latest?module";
const html = htm.bind(h);

const useOrientation = () => {
  const [orientation, setOrientation] = useState(
    window.screen.orientation.type
  );
  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.screen.orientation.type);
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);
  return orientation;
};

function SlidingWindow(props) {
  const { context } = props;
  const a = context.get("a");
  const w = context.get("w");
  const k = context.get("k");
  const i = context.get("i");
  const minList = context.get("min-list");
  const aView =
    a &&
    a.map((x, index) => {
      const classList = ["sw-a-item"];
      if (index === i) {
        classList.push("sw-i");
      }
      if (index <= i && i < index + k) {
        classList.push("sw-managed");
      }
      return html`<div class="${classList.join(" ")}" key=${index}>${x}</div>`;
    });
  const aHeader = a && html`<h6 class="sw-header">a</div>`;
  let wView;
  if (w) {
    wView = [];
    const ww = w.toArray();
    let j = 0;
    for (let i = 0; i < aView.length; ++i) {
      let value;
      if (j < ww.length && ww[j][0] === i) {
        value = ww[j][1];
        j += 1;
      }
      wView.push(html`<div class="sw-w-item" key=${i}>${value}</div>`);
    }
  }
  const wHeader = w && html`<h6 class="sw-header">w</div>`;
  let minListView;
  if (minList) {
    const minListArray = minList.toArray();
    minListView = aView.map((_, index) => {
      wView.push(
        html`<div class="sw-min-item" key=${index}>${minListArray[index]}</div>`
      );
    });
  }
  const minHeader = minList && html`<h6 class="sw-header">min_list</div>`;
  return html`<div class="sw-view">${aHeader}${wHeader}${minHeader}${aView}${wView}${minListView}</div>`;
}

export const steps = [
  [
    "a = input_array() // 입력 배열",
    (context) => {
      const array = Array.from(
        { length: 7 },
        () => 10 + Math.floor(Math.random() * 90)
      );
      context.set("a", array);
      context.set("step", 1);
    },
  ],
  [
    "w = deque() // 슬라이딩 윈도우",
    (context) => {
      context.set("w", List([]));
      context.set("step", 2);
    },
  ],
  [
    "k = 4 // 구간의 길이",
    (context) => {
      context.set("k", 4);
      context.set("step", 3);
    },
  ],
  [
    "i = 0",
    (context) => {
      context.set("i", 0);
      context.set("step", 4);
    },
  ],
  [
    "min_list = [] // 최솟값을 출력할 배열",
    (context) => {
      context.set("min-list", List([]));
      context.set("step", 5);
    },
  ],
  [
    "while i < a.length:",
    (context) => {
      const i = context.get("i");
      const a = context.get("a");
      const fixedSteps = context.get("fixed-steps");
      if (i < a.length) {
        context.set("step", 6);
        context.set("fixed-steps", fixedSteps.push(5));
      } else {
        context.set("step", 19);
      }
    },
  ],
  [
    "  while not w.is_empty():",
    (context) => {
      const w = context.get("w");
      const fixedSteps = context.get("fixed-steps");
      if (w.isEmpty()) {
        context.set("step", 11);
      } else {
        context.set("step", 7);
        context.set("fixed-steps", fixedSteps.push(6));
      }
    },
  ],
  [
    "    if w.back.value >= a[i]:",
    (context) => {
      const w = context.get("w");
      const a = context.get("a");
      const i = context.get("i");
      if (w.last()[1] >= a[i]) {
        context.set("step", 8);
      } else {
        context.set("step", 9);
      }
    },
  ],
  [
    "      w.pop_back()",
    (context) => {
      const w = context.get("w");
      const fixedSteps = context.get("fixed-steps");
      context.set("w", w.pop());
      context.set("step", 6);
      context.set("fixed-steps", fixedSteps.pop());
    },
  ],
  [
    "    else:",
    (context) => {
      context.set("step", 10);
    },
  ],
  [
    "      break",
    (context) => {
      const fixedSteps = context.get("fixed-steps");
      context.set("step", 11);
      context.set("fixed-steps", fixedSteps.pop());
    },
  ],
  [
    "  w.push_back({ index: i, value: a[i] })",
    (context) => {
      const w = context.get("w");
      const i = context.get("i");
      const a = context.get("a");
      context.set("w", w.push([i, a[i]]));
      context.set("step", 12);
    },
  ],
  [
    "  while not w.is_empty():",
    (context) => {
      const w = context.get("w");
      const fixedSteps = context.get("fixed-steps");
      context.set("fixed-steps", fixedSteps.push(12));
      if (w.isEmpty()) {
        context.set("step", 17);
        context.set("fixed-steps", fixedSteps.pop());
      } else {
        context.set("step", 13);
      }
    },
  ],
  [
    "    if w.front.index + k <= i:",
    (context) => {
      const w = context.get("w");
      const k = context.get("k");
      const i = context.get("i");
      if (w.first()[0] + k <= i) {
        context.set("step", 14);
      } else {
        context.set("step", 15);
      }
    },
  ],
  [
    "      w.pop_front()",
    (context) => {
      const w = context.get("w");
      const fixedSteps = context.get("fixed-steps");
      context.set("w", w.shift());
      context.set("step", 12);
      context.set("fixed-steps", fixedSteps.pop());
    },
  ],
  [
    "    else:",
    (context) => {
      context.set("step", 16);
    },
  ],
  [
    "      break",
    (context) => {
      const fixedSteps = context.get("fixed-steps");
      context.set("step", 17);
      context.set("fixed-steps", fixedSteps.pop());
    },
  ],
  [
    "  min_list.add(w.front.value)",
    (context) => {
      const w = context.get("w");
      const minList = context.get("min-list");
      context.set("min-list", minList.push(w.first()[1]));
      context.set("step", 18);
    },
  ],
  [
    "  i = i + 1",
    (context) => {
      const i = context.get("i");
      const fixedSteps = context.get("fixed-steps");
      context.set("i", i + 1);
      context.set("step", 5);
      context.set("fixed-steps", fixedSteps.pop());
    },
  ],
  ["end", () => {}],
];

export const algorithm = SlidingWindow;
