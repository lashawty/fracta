import './style.sass'
import { entry } from './js/entry'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import CANNON from 'cannon'

//進場動畫
entry()

//下方動畫

//加入物理世界
const world = new CANNON.World()
world.gravity.set(0, -9, 0) //地心引力

//物理 材質
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: .5
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
const sphereMaterial = new THREE.MeshBasicMaterial({
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
    body.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(-150, 0, 0))

    //更新陣列
    objectsToUpdate.push({
      mesh: mesh,
      body: body
  })
}

//物理地板
const floorShape = new CANNON.Plane()

const floorBody = new CANNON.Body()
const secFloorBody = new CANNON.Body()
const thirdFloorBody = new CANNON.Body()

floorBody.addShape(floorShape)
secFloorBody.addShape(floorShape)
thirdFloorBody.addShape(floorShape)

thirdFloorBody.mass = 0
secFloorBody.mass = 0
floorBody.mass = 0


world.addBody(floorBody)
world.addBody(secFloorBody)
// world.addBody(thirdFloorBody)

floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
secFloorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * .5 )
thirdFloorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI * .5 )

// floorBody.position.y = 10
// secFloorBody.position.y = -10
// floorBody.position.x = 0
floorBody.material = defaultMaterial
secFloorBody.material = defaultMaterial
thirdFloorBody.material = defaultMaterial
thirdFloorBody.position.x = -10
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
    createSphere(renderNumber(1,0.1,0.01), { x:renderNumber(1,-1,0.1), y: 3, z: 0})
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

// tick()
const bottomAnimate = () => {
  const tl = gsap.timeline()
  tl.from(".cone-line",{
    scale: 1.3,
    opacity: 0,
    xPercent: 100,
    stagger: .1,
    delay: 5,
    onComplete: self => {
      tick()
      tl.reverse()
    },
  })
  return tl
}

bottomAnimate()

