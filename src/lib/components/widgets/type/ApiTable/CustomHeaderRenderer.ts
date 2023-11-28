import { formats } from "$lib/helpers/common/formats";

export class CustomHeaderRenderer {
  el: HTMLElement;

  constructor(props) {
    const el = document.createElement('div');
    el.classList.add('px-2');

    this.el = el;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    this.el.innerHTML = String(props.value);
  }
}