import { gsap } from "gsap";
import { ScrollToPlugin } from 'gsap/all'
import { Observer } from 'gsap/Observer'
gsap.registerPlugin(Observer, ScrollToPlugin)

export function scrollUpDown() {
  const arrowDown = document.querySelector('.arrow-wrap')
  const arrowUp = document.querySelector('.arrow-up')
  const sectionTop = document.querySelector('.section-top')
  const sectionDown = document.querySelector('.section-down')
  const scrollTop = () => {
      gsap.to(window, {
        duration: 1,
        scrollTo: {y: 0},
      })
  }
  const scrollDown = () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: '.section-bottom',
    })
  }
  arrowDown.addEventListener('click', scrollDown)
  arrowUp.addEventListener('click', scrollTop)
  // Observer.create({
  //   target: window,
  //   type: "wheel,touch", 
  //   onUp: () => scrollTop(), 
  //   onDown: () => scrollDown(),
  // })
}
