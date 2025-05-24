'use client'

import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as THREE from 'three'
import { vertexShader } from './shaders/ember.vert'
import { fragmentShader } from './shaders/ember.frag'


export default function ParticleMesh() {

    const modelPath = '/mockingjay-packed-amlu.glb'
    const pointsRef = useRef<THREE.Points>(null)
    const pointThreshold = 0.6
    const [hovered, setHovered] = useState(false)

    // Switch to lower poly model if performance drops
    // (PerformanceMonitor must be rendered in your Canvas)
    // You can also debounce or guard this if you want to avoid rapid switching
    // See: https://github.com/pmndrs/drei#performancemonitor

    const gltf = useLoader(
        GLTFLoader,
        modelPath,
        (loader) => {
            const dracoLoader = new DRACOLoader()
            dracoLoader.setDecoderPath('/draco/')
            loader.setDRACOLoader(dracoLoader)
        }
    )

    // const geometryData = useMemo<THREE.BufferGeometry | null>(() => {
    //     let found: THREE.BufferGeometry | null = null
    //     console.log(gltf);
    //     gltf.scene.traverse((child: any) => {
    //         if (child.isMesh && child.geometry && !found) {
    //             found = child.geometry
    //         }
    //     })
    //     return found
    // }, [gltf])

    const geometryData = useMemo<THREE.BufferGeometry | null>(() => {
        let found: THREE.Mesh | null = null
        gltf.scene.updateMatrixWorld(true)
        gltf.scene.traverse((child: THREE.Object3D) => {
            if ((child instanceof THREE.Mesh) && !found) {
                found = child
            }
        })
        if (found && (found as THREE.Mesh).geometry) {
            const mesh = found as THREE.Mesh
            const geo = mesh.geometry.clone()
            geo.applyMatrix4(mesh.matrixWorld)
            return geo
        }
        return null

    }, [gltf])
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseVelocity: { value: new THREE.Vector2(0, 0) }, // <-- Add this
        uHover: { value: 1 },
    }), [])

    const geometry = useMemo(() => {
        if (!geometryData) return null
        geometryData.computeBoundingBox()
        const boundingBox = geometryData.boundingBox
        const center = new THREE.Vector3()
        boundingBox?.getCenter(center)

        const position = geometryData.getAttribute('position')
        const tempVec = new THREE.Vector3()
        const particles: number[] = []
        const scales: number[] = []
        const phases: number[] = []

        for (let i = 0; i < position.count; i++) {
            if (Math.random() > pointThreshold) {
                tempVec.set(position.getX(i), position.getY(i), position.getZ(i))
                tempVec.sub(center)
                particles.push(tempVec.x, tempVec.y, tempVec.z)
                scales.push(Math.random())
                phases.push(Math.random() * Math.PI * 2)
            }
        }

        const particleGeo = new THREE.BufferGeometry()
        particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particles, 3))
        particleGeo.setAttribute('aScale', new THREE.Float32BufferAttribute(scales, 1))
        particleGeo.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1))
        particleGeo.setDrawRange(0, particles.length / 3)
        particleGeo.attributes.position.needsUpdate = false

        return particleGeo
    }, [geometryData])


    // const geometry = useMemo(() => {
    //     if (!geometryData) return null
    //     geometryData.computeBoundingBox()
    //     const boundingBox = geometryData.boundingBox
    //     const center = new THREE.Vector3()
    //     boundingBox?.getCenter(center)

    //     const position = geometryData.getAttribute('position')
    //     const tempVec = new THREE.Vector3()
    //     for (let i = 0; i < position.count; i++) {
    //         tempVec.set(position.getX(i), position.getY(i), position.getZ(i))
    //         tempVec.sub(center)
    //         position.setXYZ(i, tempVec.x, tempVec.y, tempVec.z)
    //     }

    //     const particles: number[] = []
    //     const scales: number[] = []
    //     const phases: number[] = []
    //     let count = 0

    //     for (let i = 0; i < position.count; i++) {
    //         if (Math.random() > 0.85 && count < 354000) {
    //             tempVec.set(
    //                 position.getX(i),
    //                 position.getY(i),
    //                 position.getZ(i)
    //             )
    //             particles.push(tempVec.x, tempVec.y, tempVec.z)
    //             scales.push(Math.random())
    //             phases.push(Math.random() * Math.PI * 2)
    //             count++
    //         }
    //     }

    //     const particleGeo = new THREE.BufferGeometry()
    //     particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particles, 3))
    //     particleGeo.setAttribute('aScale', new THREE.Float32BufferAttribute(scales, 1))
    //     particleGeo.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1))
    //     particleGeo.setDrawRange(0, particles.length / 3)
    //     particleGeo.attributes.position.needsUpdate = false

    //     return particleGeo
    // }, [geometryData])

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })
    }, [uniforms])

    const mouseTarget = useRef(new THREE.Vector2(0, 0))
    const lastMouse = useRef(new THREE.Vector2(0, 0))

    useFrame((state) => {
        mouseTarget.current.set(state.pointer.x, state.pointer.y)
        // Calculate velocity
        const velocity = mouseTarget.current.clone().sub(lastMouse.current)
        uniforms.uMouseVelocity.value.lerp(velocity, 0.3) // Smooth the velocity
        lastMouse.current.copy(mouseTarget.current)

        uniforms.uMouse.value.lerp(mouseTarget.current, 0.2)
        uniforms.uTime.value = state.clock.getElapsedTime()
        uniforms.uHover.value += ((hovered ? 1 : 0) - uniforms.uHover.value) * 0.1
        if (pointsRef.current) {
            const t = state.clock.getElapsedTime()
            pointsRef.current.position.y = Math.sin(t * 0.7) * 0.3
            pointsRef.current.position.x = Math.cos(t * 0.5) * 0.3 - 4.5
        }
    })
    const onPointerOver = useCallback(() => setHovered(true), [])
    const onPointerOut = useCallback(() => setHovered(false), [])

    if (!geometry) return null

    return <points onPointerOver={onPointerOver} onPointerOut={onPointerOut} ref={pointsRef} geometry={geometry} material={material} rotation={[Math.PI / 2, 0, 0]} />
}
