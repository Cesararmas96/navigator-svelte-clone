import { formats } from "$lib/helpers/common/formats";

type FunctionMapType = {
  [key: string]: number[]
}

export class CustomRowRenderer {
  el: HTMLElement;
  def: FunctionMapType;
  index: number;

  constructor(props) {
    const el = document.createElement('div');
    el.classList.add('px-2');
    const { definitions, idx } = props.columnInfo.renderer.options;

    this.el = el;
    this.def = definitions;
    this.index = idx;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    for (const [fnName, indices] of Object.entries(this.def)) {
      if (indices.includes(this.index)) {
        const fn = formats[fnName]
        this.el.classList.add('text-right')
        this.el.innerHTML = fn(props.value)
        return
      }
    }
    this.el.innerHTML = String(props.value);
  }
}