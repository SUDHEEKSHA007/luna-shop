
"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Reveal content when section enters viewport
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Three.js pearl sculpture
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      38,
      1,
      0.1,
      100
    );

    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Main sculpture group
    const sculpture = new THREE.Group();
    scene.add(sculpture);

    // Main pearl
    const pearlGeometry = new THREE.SphereGeometry(1.15, 96, 96);

    const pearlMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xeee3d1,
      metalness: 0.12,
      roughness: 0.19,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 0.85,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [250, 550],
    });

    const pearl = new THREE.Mesh(pearlGeometry, pearlMaterial);
    sculpture.add(pearl);

    // Sculptural gold ring
    const ringGeometry = new THREE.TorusGeometry(
      1.62,
      0.055,
      20,
      160
    );

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xb8976c,
      metalness: 0.95,
      roughness: 0.2,
    });

    const ring = new THREE.Mesh(ringGeometry, goldMaterial);
    ring.rotation.set(0.9, 0.3, 0.45);
    sculpture.add(ring);

    // Secondary orbit
    const secondRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.018, 12, 160),
      new THREE.MeshStandardMaterial({
        color: 0xdac29f,
        metalness: 0.9,
        roughness: 0.25,
      })
    );

    secondRing.rotation.set(1.2, 0.7, -0.5);
    sculpture.add(secondRing);

    // Small pearl
    const smallPearl = new THREE.Mesh(
      new THREE.SphereGeometry(0.23, 48, 48),
      pearlMaterial
    );

    smallPearl.position.set(1.7, 0.9, 0.3);
    sculpture.add(smallPearl);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));

    const keyLight = new THREE.DirectionalLight(0xffe5c1, 3);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffffff, 35);
    fillLight.position.set(-4, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xc49b69, 25);
    rimLight.position.set(2, 3, -4);
    scene.add(rimLight);

    // Interaction
    let targetX = 0;
    let targetY = 0;
    let scrollProgress = 0;
    let animationId = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handlePointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();

      targetX =
        ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;

      targetY =
        ((event.clientY - rect.top) / rect.height - 0.5) * 0.5;
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const progress =
        (window.innerHeight - rect.top) /
        (window.innerHeight + rect.height);

      scrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
    };

    container.addEventListener("pointermove", handlePointer);
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        sculpture.rotation.y +=
          (targetX * 0.5 + elapsed * 0.055 -
            sculpture.rotation.y) * 0.025;

        sculpture.rotation.x +=
          (targetY * 0.35 -
            sculpture.rotation.x) * 0.025;

        sculpture.position.y =
          Math.sin(elapsed * 0.65) * 0.09;

        sculpture.rotation.z =
          Math.sin(elapsed * 0.3) * 0.035;

        ring.rotation.z += 0.0015;
        secondRing.rotation.y += 0.001;
      }

      sculpture.position.x = THREE.MathUtils.lerp(
        sculpture.position.x,
        (scrollProgress - 0.5) * 0.22,
        0.025
      );

      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();

      container.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("scroll", handleScroll);

      pearlGeometry.dispose();
      pearlMaterial.dispose();
      ringGeometry.dispose();
      goldMaterial.dispose();

      sculpture.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
        }
      });

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => material.dispose());
        }
      });

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const reveal = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translateY(0)"
      : "translateY(35px)",
    transition: `opacity 900ms ease ${delay}ms, transform 1000ms cubic-bezier(0.2,0.7,0.2,1) ${delay}ms`,
  });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F7F4EF] text-[#29231D]"
    >

      {/* Intro */}
      <div className="mx-auto max-w-[1600px] px-6 pt-24 sm:px-10 md:pt-32 lg:px-20">

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">

          <div style={reveal(0)}>

            <p className="mb-5 text-[9px] uppercase tracking-[0.35em] text-[#A18460]">
              A philosophy of adornment
            </p>

            <h2 className="max-w-3xl font-serif text-5xl font-normal leading-[1.04] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[90px]">
              Beyond the
              <br />
              <span className="italic text-[#A18460]">
                ornament.
              </span>
            </h2>

          </div>

          <p
            style={reveal(200)}
            className="max-w-[260px] pb-2 text-xs font-light leading-7 text-[#82796F]"
          >
            An exploration of natural forms, precious materials
            and the quiet beauty of things made to last.
          </p>

        </div>

      </div>

      {/* Main editorial composition */}
      <div className="mx-auto mt-16 grid max-w-[1600px] grid-cols-1 items-center gap-8 px-6 sm:px-10 md:mt-24 lg:grid-cols-12 lg:gap-12 lg:px-20">

        {/* Left editorial image */}
        <div
          className="relative order-2 overflow-hidden lg:order-1 lg:col-span-3"
          style={reveal(200)}
        >

          <div className="aspect-[4/5] overflow-hidden bg-[#DED5C8]">

            <img
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85"
              alt="Sculptural gold jewellery"
              className="h-full w-full object-cover transition-transform duration-[1500ms] hover:scale-105"
            />

          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#928477]">
              Form / 001
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#928477]">
              Gold
            </span>
          </div>

        </div>

        {/* Three.js centerpiece */}
        <div className="relative order-1 flex min-h-[380px] items-center justify-center lg:order-2 lg:col-span-6 lg:min-h-[620px]">

          {/* Background atmosphere */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8AD88]/20 blur-[90px] md:h-[450px] md:w-[450px]" />

          <div
            ref={canvasRef}
            className="relative z-10 h-[380px] w-full cursor-grab active:cursor-grabbing md:h-[540px] lg:h-[620px]"
            style={reveal(350)}
          />

          {/* Small annotations */}
          <div className="pointer-events-none absolute left-0 top-[15%] hidden md:block">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#A18460]">
              Natural beauty
            </p>
            <div className="mt-3 h-px w-12 bg-[#BDA17E]" />
          </div>

          <div className="pointer-events-none absolute bottom-[15%] right-0 hidden text-right md:block">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#A18460]">
              Timeless form
            </p>
            <div className="ml-auto mt-3 h-px w-12 bg-[#BDA17E]" />
          </div>

        </div>

        {/* Right editorial image */}
        <div
          className="relative order-3 lg:col-span-3"
          style={reveal(500)}
        >

          <div className="aspect-[4/5] overflow-hidden bg-[#DED5C8]">

            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85"
              alt="Pearl and gold jewellery"
              className="h-full w-full object-cover transition-transform duration-[1500ms] hover:scale-105"
            />

          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#928477]">
              Form / 002
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#928477]">
              Pearls
            </span>
          </div>

        </div>

      </div>

      {/* Story section */}
      <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-20 sm:px-10 md:pb-32 md:pt-28 lg:px-20">

        <div className="grid grid-cols-1 gap-12 border-t border-[#DCD4C9] pt-12 md:grid-cols-12 md:gap-10">

          <div
            className="md:col-span-4"
            style={reveal(150)}
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#A18460]">
              The Luna perspective
            </p>

            <h3 className="mt-6 font-serif text-3xl leading-tight sm:text-4xl">
              Beauty is never
              <br />
              <span className="italic text-[#A18460]">
                just decoration.
              </span>
            </h3>
          </div>

          <div
            className="md:col-span-4"
            style={reveal(300)}
          >
            <p className="text-[13px] font-light leading-[2.1] text-[#766E65]">
              We find inspiration in the imperfect symmetry of
              nature, the soft luminosity of pearls and the
              enduring character of gold.
            </p>

            <p className="mt-6 text-[13px] font-light leading-[2.1] text-[#766E65]">
              Each piece is an exercise in restraint — considered
              proportions, thoughtful materials and details that
              reveal themselves over time.
            </p>
          </div>

          <div
            className="md:col-span-4"
            style={reveal(450)}
          >
            <p className="text-[13px] font-light leading-[2.1] text-[#766E65]">
              From the first sketch to the final finish, our
              approach is simple: create jewellery that feels
              personal, effortless and worth keeping.
            </p>

            <div className="mt-8 border-t border-[#DCD4C9] pt-5">
              <p className="font-serif text-2xl italic text-[#A18460]">
                Luna Atelier
              </p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-[#928477]">
                The art of everyday adornment
              </p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
