import { gsap } from "gsap";

export function entry() {
  const tl = gsap.timeline()
  tl.from(".wave", {
    x: -20
  })
  .from(".letter", {
    opacity: 0,
    stagger: .2,
  })
  .from(".chinese", {
    y: 20,
    opacity: 0,
  },"<1")
  .to(".entry-animate", {
    yPercent: 100,
    duration: 1,
    ease: "power4.out",
    onComplete: self => {
      const entry = document.querySelector(".entry-animate")
      entry.classList.add("d-none")
    }
  })
}