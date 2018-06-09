let node = {
  a: {
    b: {
      c: 10
    },
    d: 20
  }
};
let {a: {b: {c}}} = node;
console.log(c); // 10