let head = document.querySelector(".card-header");
let card_body = document.querySelector(".card-body");

let item = JSON.parse(localStorage.getItem("about"));

console.log(item.name);
console.log(item.src);
head.innerHTML = "";
head.innerHTML = `<h2 class="h2 card-title"> ${item.name} </h2>`;

card_body.innerHTML = "";
card_body.innerHTML = `
<img src=${item.src} height="50vh" width="50vh" class="shadow"/>
<div class="info mt-3">
Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa iusto
aut obcaecati quaerat cupiditate magni culpa velit harum
exercitationem nemo?
</div>
`;
