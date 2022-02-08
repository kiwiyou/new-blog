import { render, h } from "https://unpkg.com/preact@latest?module";
import { useState, useCallback } from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";
import htm from "https://unpkg.com/htm@latest?module";
import { Map, Stack } from "https://unpkg.com/immutable@latest?module";
import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp, RefreshCcw } from "https://unpkg.com/preact-feather@latest?module";
const html = htm.bind(h);

function Control(props) {
  return html`<a href="#" class="vis-control" onClick=${props.onClick}>
    ${props.children}
  </a>`;
}

function ControlBox(props) {
  const buttons = [
    [ChevronUp, props.onStepBack],
    [ChevronDown, props.onStepOver],
    [ChevronsUp, props.onToBeginning],
    [ChevronsDown, props.onToEnd],
    [RefreshCcw, props.onReset],
  ];
  const controls = buttons.map(([icon, onClick]) => {
    return html`<${Control} onClick=${onClick}><${icon} /></Control>`;
  });
  return html`<div class="vis-controls-box">${controls}</div>`;
}

function StepBox(props) {
  let SHOW_COUNT = 7;

  const { steps, cursor, fixed } = props;
  const fixedLines = fixed.map(
    (i) =>
      html`<pre class="vis-step-line vis-step-fixed">
        ${i + 1}. ${steps[i][0]}
      </pre>`
  );
  let up = cursor;
  let down = cursor;
  let count = 1;
  let added = true;
  while (added) {
    added = false;
    if (up > 0 && count < SHOW_COUNT - fixed.length) {
      up -= 1;
      count += 1;
      added = true;
    }
    if (down < steps.length - 1 && count < SHOW_COUNT - fixed.length) {
      down += 1;
      count += 1;
      added = true;
    }
  }
  const lines = steps.slice(up, down + 1).map(([step, _], i) => {
    const className =
      i + up === cursor ? "vis-step-line vis-step-active" : "vis-step-line";
    return html`<pre class=${className}>${i + up + 1}. ${step}</pre>`;
  });
  return html`<div class="vis-step-box">${fixedLines}${lines}</div>`;
}

function Container(props) {
  const { steps, algorithm } = props;
  const [history, setHistory] = useState([
    Map({ step: 0, "fixed-steps": Stack() }),
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const stepOver = useCallback(() => {
    if (historyIndex === history.length - 1) {
      const context = history[historyIndex];
      const newContext = context.withMutations(steps[context.get("step")][1]);
      if (newContext === context) {
        return;
      }
      setHistory([...history, newContext]);
    }
    setHistoryIndex(historyIndex + 1);
  }, [steps, history, historyIndex]);
  const stepBack = useCallback(() => {
    if (historyIndex === 0) {
      return;
    }
    setHistoryIndex(historyIndex - 1);
  }, [historyIndex]);
  const toBeginning = useCallback(() => {
    setHistoryIndex(0);
  }, []);
  const toEnd = useCallback(() => {
    let context = history[history.length - 1];
    const newHistory = [...history];
    while (true) {
      const newContext = context.withMutations(steps[context.get("step")][1]);
      if (context === newContext) {
        break;
      }
      newHistory.push(newContext);
      context = newContext;
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [steps, history, historyIndex]);
  const reset = useCallback(() => {
    setHistory([Map({ step: 0, "fixed-steps": Stack() })]);
    setHistoryIndex(0);
  }, []);
  return html`<div class="vis-container">
    <${StepBox}
      steps=${steps}
      cursor=${history[historyIndex].get("step")}
      fixed=${history[historyIndex].get("fixed-steps").toArray()}
    />
    <${algorithm} context=${history[historyIndex]} />
    <${ControlBox}
      onStepOver=${stepOver}
      onStepBack=${stepBack}
      onToBeginning=${toBeginning}
      onToEnd=${toEnd}
      onReset=${reset}
    />
  </div>`;
}

function attach(div, steps, algorithm) {
  render(html`<${Container} steps=${steps} algorithm=${algorithm} />`, div);
}

export default attach;
