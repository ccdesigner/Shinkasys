(function(){
  const html = `
  <div id="floatWidget" style="position:fixed;top:250px;left:50px;z-index:9999;background:rgba(0,0,0,0.4);padding:10px;border-radius:10px;cursor:move;display:grid;grid-template-columns:repeat(2,40px);gap:10px;">
    ${[1,2,3,4,5].map(n=>`<a href="../${n}/index.html" style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:hsl(${n*40},70%,60%);color:#fff;text-decoration:none;font-weight:bold;">${n}</a>`).join('')}
  </div>
  `;
  const style = document.createElement('style');
  style.textContent = `
    #floatWidget a:hover { filter: brightness(1.2); }
  `;
  document.head.appendChild(style);
  const el = document.createElement('div');
  el.innerHTML = html;
  document.body.appendChild(el);

  const w = document.getElementById("floatWidget");
  let drag = false, offsetX = 0, offsetY = 0;
  w.addEventListener("mousedown", e => {
    drag = true;
    offsetX = e.clientX - w.offsetLeft;
    offsetY = e.clientY - w.offsetTop;
  });
  document.addEventListener("mousemove", e => {
    if (drag) {
      w.style.left = (e.clientX - offsetX) + "px";
      w.style.top = (e.clientY - offsetY) + "px";
    }
  });
  document.addEventListener("mouseup", () => drag = false);
})();
