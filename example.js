class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }
  get html() {
    return this.element;
  }
  set html(value) {
    this.element = value + 'hello';
  }
}

let obj = new CustomHTMLElement('<div></div>');
console.log(obj.html); // <div></div>
obj.html = '<div>hello</div>';
console.log(obj.html); // <div>hello</div>hello