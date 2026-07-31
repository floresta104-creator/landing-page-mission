(() => {
  const form = document.getElementById("inviteForm");
  const msg = document.getElementById("formMsg");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    const list = JSON.parse(localStorage.getItem("orbiroom-waitlist") || "[]");
    if (email && !list.includes(email)) list.push(email);
    localStorage.setItem("orbiroom-waitlist", JSON.stringify(list));
    msg.textContent = "첫 관측 소식을 남겨둘게요.";
    e.currentTarget.reset();
  });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const targets = document.querySelectorAll(".section .wrap, .product-card, .door-grid article");
  targets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  targets.forEach((el) => io.observe(el));
})();
