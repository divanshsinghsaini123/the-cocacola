"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

interface CanvasCard {
  id: string | number;
  title: string;
  tagline: string;
  description: string;
  image: string;
  button: {
    buttonLink: string;
    buttonText: string;
    disablebutton: boolean;
  };
  bgColor: string;
  accentColor: string;
}

interface LandingThreeCanvasProps {
  activeIndex: number;
  onChangeActiveIndex: (index: number) => void;
  cards: CanvasCard[];
}

export default function LandingThreeCanvas({
  activeIndex,
  onChangeActiveIndex,
  cards,
}: LandingThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const N = cards.length;
    const step = (2 * Math.PI) / N;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    // --- CARDS CREATION CONFIG ---
    let radiusX = 6.2;
    let radiusZ = 3.0;
    let compressionFactor = 0.38;
    let tiltFactor = 0.08;
    let archFactor = 0.45;
    let zOffset = -1.5;
    let baseCardScale = 1.0;
    let yOffset = 0.0;
    let yBoostAmount = 0.0; // Dynamic Y elevation for only the active front card

    // Adjust camera position and card layout based on screen ratio for responsiveness
    const adjustCamera = () => {
      const aspect = container.clientWidth / container.clientHeight;
      if (aspect < 1) {
        // Portrait (mobile)
        camera.position.set(0, 0.05, 9.0);
        radiusX = 1.35;
        radiusZ = 2.0;
        compressionFactor = 0.45;
        tiltFactor = 0.05;
        archFactor = 0.20;
        zOffset = 0.2;
        baseCardScale = 0.62;
        yOffset = 1.0; // Keeps other stacked cards down
        yBoostAmount = 0.22; // Elevates only the front active card (toned down)
      } else {
        // Landscape (desktop)
        camera.position.set(0, 0.15, 11.5);
        radiusX = 6.2;
        radiusZ = 2.4;
        compressionFactor = 0.30;
        tiltFactor = 0.12;
        archFactor = 0.45;
        zOffset = 0.3;
        baseCardScale = 1.0;
        yOffset = 1.5;
        yBoostAmount = 0.3;
      }
    };
    adjustCamera();

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // Transparent background to allow CSS gradients
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight1.position.set(0, 5, 10);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -2, 5);
    scene.add(directionalLight2);

    // --- CARDS CREATION ---
    // --- CARDS CREATION ---
    const cardWidth = 2.2;
    const cardHeight = 3.0;
    const cardRadius = 0.10;

    // Helper: Rounded Rectangle shape for card base
    const createRoundedRectShape = (w: number, h: number, r: number) => {
      const shape = new THREE.Shape();
      const x = -w / 2;
      const y = -h / 2;
      shape.moveTo(x, y + r);
      shape.lineTo(x, y + h - r);
      shape.quadraticCurveTo(x, y + h, x + r, y + h);
      shape.lineTo(x + w - r, y + h);
      shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
      shape.lineTo(x + w, y + r);
      shape.quadraticCurveTo(x + w, y, x + w - r, y);
      shape.lineTo(x + r, y);
      shape.quadraticCurveTo(x, y, x, y + r);
      return shape;
    };

    const cardShapeGeo = new THREE.ShapeGeometry(
      createRoundedRectShape(cardWidth, cardHeight, cardRadius)
    );

    // Loading manager to coordinate assets and prevent intro animation stutter
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    // Store card group references
    const cardGroups: THREE.Group[] = [];

    cards.forEach((card, index) => {
      const cardGroup = new THREE.Group();
      cardGroup.userData = { cardIndex: index };

      // 1. Card Base (Neutral Dark Background to prevent color shade/bleed on image fade)
      const baseMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1c1c1e"),
        roughness: 0.18,
        metalness: 0.08,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const baseMesh = new THREE.Mesh(cardShapeGeo, baseMat);
      cardGroup.add(baseMesh);

      // 3. Product Image (rendered on a PlaneGeometry to prevent any uneven stretching, positioned higher in the Y direction)
      const imageTexture = textureLoader.load(card.image);
      imageTexture.colorSpace = THREE.SRGBColorSpace;

      const imgWidth = cardWidth - 0.08; // Thin margin to keep it borderless but hide square corners inside rounded base
      const imgHeight = cardHeight - 0.08;
      const imgGeo = new THREE.PlaneGeometry(imgWidth, imgHeight);

      const imgMat = new THREE.MeshBasicMaterial({
        map: imageTexture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const imgMesh = new THREE.Mesh(imgGeo, imgMat);
      imgMesh.position.set(0, 0, 0.005); // Centered on the card
      cardGroup.add(imgMesh);

      scene.add(cardGroup);
      cardGroups.push(cardGroup);
    });

    // --- ANIMATION & PHYSICS INTERACTION STATE ---
    // We animate this object using GSAP for premium momentum
    // Start with a spin offset of 2.2 * PI (about 396 degrees) for a beautiful load intro spin
    const animState = { angle: -activeIndex * step + Math.PI * 2.2 };
    let targetAngle = -activeIndex * step;

    // Run intro spin animation after textures load (or fallback after 1.5s) to prevent frame drop stutter
    let introStarted = false;
    const startIntro = () => {
      if (introStarted) return;
      introStarted = true;
      gsap.killTweensOf(animState);
      gsap.to(animState, {
        angle: targetAngle,
        duration: 2.0,
        ease: "power4.out",
        delay: 0.1,
      });
    };

    loadingManager.onLoad = () => {
      // Force render to warm up GPU cache (prevents stutter when texturing meshes mid-spin)
      renderer.render(scene, camera);
      startIntro();
    };

    const fallbackTimeout = setTimeout(startIntro, 1500);

    let isDragging = false;
    let startX = 0;
    let startAngle = 0;
    let lastX = 0;
    let velocity = 0;
    let lastTime = performance.now();
    let clickStartX = 0;
    let clickStartY = 0;

    let snapTimeout: NodeJS.Timeout | null = null;

    // Trigger smooth snapping to nearest card slot
    const triggerSnap = () => {
      targetAngle = Math.round(targetAngle / step) * step;

      gsap.to(animState, {
        angle: targetAngle,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const startSnapTimeout = () => {
      if (snapTimeout) clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        triggerSnap();
      }, 250);
    };

    // --- INTERACTION EVENT LISTENERS ---

    // 1. Wheel Scroll (captures left/right swipes primarily, fallbacks to vertical)
    const handleWheel = (e: WheelEvent) => {
      // Prioritize horizontal scroll (e.deltaX)
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      // Stop active snapping
      gsap.killTweensOf(animState);

      targetAngle += delta * 0.0018;

      // Animate current angle towards the target angle using GSAP
      gsap.to(animState, {
        angle: targetAngle,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });

      startSnapTimeout();
    };

    // 2. Keyboard Arrow Navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        gsap.killTweensOf(animState);
        targetAngle += step;
        triggerSnap();
      } else if (e.key === "ArrowRight") {
        gsap.killTweensOf(animState);
        targetAngle -= step;
        triggerSnap();
      }
    };

    // 3. Pointer Down (Start Drag / Touch Swipe)
    const raycaster = new THREE.Raycaster();

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return; // Left click only
      isDragging = true;
      startX = e.clientX;
      startAngle = targetAngle;
      lastX = e.clientX;
      lastTime = performance.now();
      velocity = 0;

      clickStartX = e.clientX;
      clickStartY = e.clientY;

      gsap.killTweensOf(animState);
      if (snapTimeout) clearTimeout(snapTimeout);
    };

    // 4. Pointer Move (Dragging / Swiping)
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;

      const sensitivity = container.clientWidth < 768 ? 3.0 : 1.8;

      // Calculate new target angle based on drag delta with screen-aware sensitivity
      const rotationDelta = (dx / container.clientWidth) * Math.PI * sensitivity;
      targetAngle = startAngle + rotationDelta;

      // Instantly track with a tiny GSAP damp to prevent direct jitter
      gsap.to(animState, {
        angle: targetAngle,
        duration: 0.15,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Track velocity for swipe release momentum
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const currentDx = e.clientX - lastX;
        velocity = ((currentDx / container.clientWidth) * Math.PI * sensitivity) / (dt / 1000);
      }
      lastX = e.clientX;
      lastTime = now;
    };

    // 5. Pointer Up (Release Drag / Touch Snap)
    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;

      // Apply swipe release flick momentum
      if (Math.abs(velocity) > 0.15) {
        targetAngle += velocity * 0.15;
      }
      triggerSnap();

      // Check click/tap threshold
      const dx = Math.abs(e.clientX - clickStartX);
      const dy = Math.abs(e.clientY - clickStartY);
      if (dx < 6 && dy < 6) {
        // Calculate intersection
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        raycaster.setFromCamera(mouse, camera);

        const flatMeshes: THREE.Object3D[] = [];
        cardGroups.forEach((group) => {
          group.children.forEach((c) => flatMeshes.push(c));
        });

        const intersects = raycaster.intersectObjects(flatMeshes);

        if (intersects.length > 0) {
          let targetObj = intersects[0].object;
          while (targetObj.parent && targetObj.userData.cardIndex === undefined) {
            targetObj = targetObj.parent;
          }

          const cardIndex = targetObj.userData.cardIndex;
          if (cardIndex !== undefined) {
            const calculatedActiveIndex = getActiveCardIndex(animState.angle);

            if (cardIndex === calculatedActiveIndex) {
              // Clicked active center card -> Redirect
              if (!cards[cardIndex].button?.disablebutton && cards[cardIndex].button?.buttonLink) {
                window.location.href = cards[cardIndex].button.buttonLink;
              }
            } else {
              // Clicked side card -> Spin / Slide to center it
              let diff = -cardIndex * step - targetAngle;
              diff = Math.atan2(Math.sin(diff), Math.cos(diff));
              targetAngle += diff;
              triggerSnap();
            }
          }
        }
      }
    };

    // Calculate active card index based on current rotation angle
    const getActiveCardIndex = (angle: number) => {
      let minDiff = Infinity;
      let activeIdx = 0;

      for (let i = 0; i < N; i++) {
        let cardAngle = (i * step + angle) % (2 * Math.PI);
        cardAngle = Math.atan2(Math.sin(cardAngle), Math.cos(cardAngle));

        if (Math.abs(cardAngle) < minDiff) {
          minDiff = Math.abs(cardAngle);
          activeIdx = i;
        }
      }
      return activeIdx;
    };

    // Attach interaction listeners
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let lastActiveIdx = activeIndex;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Render cards along the fanned-out cylinder dome/arch shape
      cardGroups.forEach((group, index) => {
        const cardAngle = index * step + animState.angle;

        let normalizedAngle = cardAngle % (2 * Math.PI);
        normalizedAngle = Math.atan2(Math.sin(normalizedAngle), Math.cos(normalizedAngle));

        const compressedAngle = normalizedAngle * compressionFactor;

        // X, Z Cylindrical coordinates with offsets
        const x = Math.sin(compressedAngle) * radiusX;
        const z = Math.cos(compressedAngle) * radiusZ + zOffset;

        // Facing Y inwards to form circular arch (reduced for flat appearance)
        group.rotation.y = compressedAngle * 0.18;

        // Face tilt (roll)
        group.rotation.z = -compressedAngle * tiltFactor;

        // Compute scaling highlights for center card
        const frontFactor = Math.max(0, 1 - Math.abs(normalizedAngle) / (Math.PI / 2.5));
        const scale = (1.0 + frontFactor * 0.28) * baseCardScale;
        group.scale.set(scale, scale, scale);

        // Arch downward curve shape + dynamic front card Y boost
        const yBoost = frontFactor * yBoostAmount;
        const y = -Math.pow(compressedAngle, 2) * archFactor + yOffset + yBoost;
        group.position.set(x, y, z);

        // Opacities & Render overlapping order (Center card overlaps side cards)
        const opacityFactor = Math.pow(Math.max(0, 1 - Math.abs(normalizedAngle) / Math.PI), 0.75);
        const order = Math.round(opacityFactor * 100);

        group.children.forEach((mesh) => {
          mesh.renderOrder = order;
          const mat = (mesh as THREE.Mesh).material as THREE.Material;
          if (mat) {
            mat.opacity = opacityFactor;
            mat.transparent = true;
          }
        });
      });

      // Track active index and notify parent component
      const currentActiveIdx = getActiveCardIndex(animState.angle);
      if (currentActiveIdx !== lastActiveIdx) {
        lastActiveIdx = currentActiveIdx;
        onChangeActiveIndex(currentActiveIdx);
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      adjustCamera();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (snapTimeout) clearTimeout(snapTimeout);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);

      // Kill any active GSAP tweens
      gsap.killTweensOf(animState);

      // Dispose geometries and materials
      cardGroups.forEach((group) => {
        group.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          } else if (child instanceof THREE.Line) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });

      scene.clear();
      renderer.dispose();
    };
  }, [onChangeActiveIndex, cards]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none outline-none relative overflow-hidden touch-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
