import './style.sass'
import { entry } from './js/entry'
import { scrollUpDown } from './js/arrow'
import * as THREE from 'three'
import gsap from 'gsap'
import CANNON from 'cannon'
import { ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

//加入物理世界
const world = new CANNON.World()
world.gravity.set(0, -3, 0) //地心引力

//物理 材質
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: .1
    }
)
world.addContactMaterial(defaultContactMaterial)

//random number
const renderNumber = (max, min, delta) => {
  return gsap.utils.random(max, min, delta)
}

// Canvas
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// 物件


//球
const objectsToUpdate = []
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: '#003F97',
})

//產生球
const createSphere = (radius, position) =>
{   
    if (objectsToUpdate.length >= 10) return
    // Three
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon
    const shape = new CANNON.Sphere(radius)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 0, 0),
        shape: shape,
        material: defaultMaterial
    })

    body.position.copy(position)
    world.addBody(body)
    // body.applyLocalForce(new CANNON.Vec3(0, 0, 10), new CANNON.Vec3(100, -100, 10))

    //更新陣列
    objectsToUpdate.push({
      mesh: mesh,
      body: body
  })
}

//物理地板
const floorShape = new CANNON.Plane()
const boxShape = new CANNON.Box(new CANNON.Vec3(1,1000,1))

const floorBody = new CANNON.Body()
const secFloorBody = new CANNON.Body()
const thirdFloorBody = new CANNON.Body()
const fourFloorBody = new CANNON.Body()
const fifFloorBody = new CANNON.Body()
const boxBody = new CANNON.Body()

floorBody.addShape(floorShape)
secFloorBody.addShape(floorShape)
thirdFloorBody.addShape(floorShape)
fourFloorBody.addShape(floorShape)
fifFloorBody.addShape(floorShape)
boxBody.addShape(boxShape)

floorBody.mass = 1
secFloorBody.mass = 1
thirdFloorBody.mass = 1
fourFloorBody.mass = 1
fifFloorBody.mass = 1

world.addBody(floorBody)
world.addBody(secFloorBody)
world.addBody(thirdFloorBody)
world.addBody(fourFloorBody)
world.addBody(fifFloorBody)
world.addBody(boxBody)

floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
secFloorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * .5 )
thirdFloorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI * - .5 )
fourFloorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, -1, 0), Math.PI * - .5 )

floorBody.position.y = -6
secFloorBody.position.y = 6
thirdFloorBody.position.x = 10
fourFloorBody.position.x = -10
fifFloorBody.position.z = -30
boxBody.position.z = 10

floorBody.material = defaultMaterial
secFloorBody.material = defaultMaterial
thirdFloorBody.material = defaultMaterial
fourFloorBody.material = defaultMaterial
fifFloorBody.material = defaultMaterial



// Lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1,2,0)
scene.add(directionalLight)

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// camera
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
cameraGroup.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// animate
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
  {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    //更新
    world.step(1 / 60, deltaTime, 3)
    for(const object of objectsToUpdate)
    {
        object.mesh.position.copy(object.body.position)
    }
    createSphere(renderNumber(1,0.1,0.01), { x:renderNumber(1,-1,0.1), y: 5, z: -10})
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}


const bottomAnimate = () => {
  const tl = gsap.timeline()
  tl.to(".cone-line",{
    opacity: 1,
    xPercent: 0,
    stagger: .1,
    delay: 2
  })
  .to(boxBody.position, {
    z: 15,
  })
  .to(".cone-line",{
    y: -50,
    repeat: 2,
    yoyo: true,
    onComplete: self=>{
      world.remove(secFloorBody)
      world.gravity.set(-1, 1, 1)
    }
  })
  return tl
}

// init
entry()
scrollUpDown()

gsap.set(".section-bottom .entry-text",{
  opacity: 0,
  y: -20,
})
gsap.set(".arrow-up",{
  opacity: 0,
  x: 20,
})
gsap.set(".cone-line", {
  opacity: 0,
  xPercent: 100,
})

const sectionBottom = () => {
  const tl = gsap.timeline()
  tl
  .to(".section-bottom .entry-text",{
    opacity: 1,
    y: 0,
    stagger: .2,
  })
  .to(".arrow-up",{
    opacity: 1,
    x: 0,
    onComplete: self => {
      tick()
      bottomAnimate()
    }
  })
  return tl
}

gsap.from(".section-bottom", {
  scrollTrigger: ".section-bottom",
  opacity: 0,
  duration: 1,
  onComplete: self => sectionBottom()
});