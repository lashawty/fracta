import './style.sass'
import { entry } from './js/entry'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import CANNON from 'cannon'
// import { ConeEquation } from 'conequation'

//進場動畫
entry()

//下方動畫

//物理lib
// const world = new CANNON.World()
// world.gravity.set(0, - 9.82, 0)
// const sphereShape = new CANNON.ConeEquation(0.5)
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape
// })
// world.addBody(sphereBody)
// debug
const gui = new dat.GUI()
gui.onChange(() =>
{
  // cone.rotation.set(cone.rotation._x, cone.rotation._y, cone.rotation._z);
  // cone.position.set(cone.position.x, cone.position.y, cone.position.z);
})

//random number
const renderNumber = (max, min, delta) => {
  return gsap.utils.random(max, min, delta)
}

// Canvas
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// 物件
const coneGeo = new THREE.ConeGeometry( 2, 2, 64, 1, true )
const coneMat = new THREE.MeshBasicMaterial({
wireframe: true} )
const cone = new THREE.Mesh(coneGeo,coneMat)
cone.rotation.set(3.4, 2.1, 0.5)
cone.position.set(1.1, -0.9, 1.1)
scene.add( cone );


const ballGeo = new THREE.DodecahedronGeometry(1,10)
const ballMat = new THREE.MeshBasicMaterial({
  color: '#003F97'} )
const ball = new THREE.Mesh(ballGeo, ballMat)
gui.add(ballMat, 'wireframe')
scene.add( ball )
// ball.position.set(1.1, -10, 1.2)
let number = renderNumber(1,.2,.01)
ball.scale.set(number ,number ,number )
const ballTl = gsap.timeline()
ballTl.from(ball.position, {
  x: renderNumber(1,.2,.01),
  y: renderNumber(1,.2,.01),
  duration: 10,
  delay: 5,
})
.to(ball.scale, {
  x: 0,
  y: 0,
  z: 0,
}, "<")
// Lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
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
    // camera.aspect = sizes.width / sizes.height
    // camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// camera
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
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

    
    // Animate camera
    // camera.position.y = - scrollY / sizes.height * objectsDistance

    // const parallaxX = cursor.x * 0.5
    // const parallaxY = - cursor.y * 0.5
    // cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    // cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    // for(const mesh of sectionMeshes)
    // {
    //     mesh.rotation.x += deltaTime * 0.1
    //     mesh.rotation.y += deltaTime * 0.12
    // }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()