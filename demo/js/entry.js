import { gsap } from "gsap";
import { ScrollToPlugin } from 'gsap/all'
gsap.registerPlugin(ScrollToPlugin)

export function entry() {
  const topAnimate = () => {
    const tl = gsap.timeline()
    tl.from(".oval",{
      opacity: 0,
      xPercent: -100,
      stagger: .2,
    })
    .from(".ball", {
      opacity: 0
    })
    return tl
  }
  const topTextAnimate = () => {
    const tl = gsap.timeline()
    tl
    .from(".navbar", {
      opacity: 0,
      y: -20,
    })
    .from(".section-top .entry-text",{
      opacity: 0,
      y: -20,
      stagger: .2,
    })
    .from(".arrow-wrap",{
      opacity: 0,
      x: 20,
    })
    return tl
  }
  gsap.set(window, {scrollTo: {y: 0},})
  const tl = gsap.timeline()

  tl
  .to(window, {scrollTo: {y: 0},})
  .from(".wave", {
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
  .add(topAnimate())
  .add(topTextAnimate())
}