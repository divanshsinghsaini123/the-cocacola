"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { brandCards as pageCards, BrandCardData as PageCardData } from "./data";

interface LandingThreeCanvasProps {
  activeIndex: number;
  onChangeActiveIndex: (index: number) => void;
}

export default function LandingThreeCanvas({
  activeIndex,
  onChangeActiveIndex,
}: LandingThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const N = pageCards.length;
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
    let radius = 6.2;
    let compressionFactor = 0.38;
    let tiltFactor = 0.08;
    let archFactor = 0.45;
    let zOffset = -1.5;
    let baseCardScale = 1.0;
    let yOffset = 0.0;

    // Adjust camera position based on screen ratio for responsiveness
    const adjustCamera = () => {
      const aspect = container.clientWidth / container.clientHeight;
      if (aspect < 1) {
        // Portrait (mobile)
        camera.position.set(0, 0.4, 15.0);
        radius = 5.5;
        compressionFactor = 0.45;
        tiltFactor = 0.15;
        archFactor = 0.5;
        zOffset = -3.0;
        baseCardScale = 0.65;
        yOffset = 2.0;
      } else {
        // Landscape (desktop)
        camera.position.set(0, 0.3, 13.5);
        radius = 7.5;
        compressionFactor = 0.4;
        tiltFactor = 0.18;
        archFactor = 0.65;
        zOffset = -4.2;
        baseCardScale = 1.0;
        yOffset = 2.0;
      }
    };
    adjustCamera();

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // transparent background so CSS transitions handle gradients
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(0, 5, 10);
    scene.add(directionalLight1);

    const spotlight = new THREE.SpotLight(0xffffff, 2);
    spotlight.position.set(0, 4, 10);
    spotlight.angle = Math.PI / 4;
    spotlight.penumbra = 0.5;
    spotlight.decay = 2;
    scene.add(spotlight);

    // --- CARDS CREATION ---
    // radius is declared dynamically above
    const cardWidth = 2.8;
    const cardHeight = 3.9;
    const cardRadius = 0.12;

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

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Store card group references
    const cardGroups: THREE.Group[] = [];

    pageCards.forEach((card, index) => {
      const cardGroup = new THREE.Group();
      cardGroup.userData = { cardIndex: index };

      // 1. Card Base (Colored Background)
      const baseMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(card.bgColor),
        side: THREE.DoubleSide,
      });
      const baseMesh = new THREE.Mesh(cardShapeGeo, baseMat);
      cardGroup.add(baseMesh);

      // 2. Product Image
      const imageTexture = textureLoader.load(card.image);
      const imgWidth = 2.2;
      const imgHeight = 2.2;
      const imgGeo = new THREE.PlaneGeometry(imgWidth, imgHeight);
      const imgMat = new THREE.MeshBasicMaterial({
        map: imageTexture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const imgMesh = new THREE.Mesh(imgGeo, imgMat);
      imgMesh.position.set(0, 0.45, 0.015); // Slightly raised in front of the base
      cardGroup.add(imgMesh);

      // 3. Card Title and Tagline (Canvas Texture)
      const canvasText = document.createElement("canvas");
      canvasText.width = 512;
      canvasText.height = 256;
      const ctx = canvasText.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 512, 256);

        // Determine text color based on background brightness
        const color = card.bgColor.toLowerCase();
        const isYellow = color.includes("d8") || color.includes("e9") || color.includes("f7") || color.includes("ff");
        const textColor = isYellow ? "#111111" : "#ffffff";
        const tagColor = isYellow ? "rgba(17,17,17,0.65)" : "rgba(255,255,255,0.7)";

        // Draw title
        ctx.font = "bold 44px sans-serif";
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.fillText(card.title, 256, 110);

        // Draw tagline
        ctx.font = "26px sans-serif";
        ctx.fillStyle = tagColor;
        ctx.fillText(card.tagline, 256, 175);
      }

      const textTexture = new THREE.CanvasTexture(canvasText);
      const textGeo = new THREE.PlaneGeometry(2.3, 1.15);
      const textMat = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const textMesh = new THREE.Mesh(textGeo, textMat);
      textMesh.position.set(0, -1.0, 0.015);
      cardGroup.add(textMesh);

      scene.add(cardGroup);
      cardGroups.push(cardGroup);
    });

    // --- INTERACTION PHYSICS STATES ---
    let targetAngle = 0;
    let currentAngle = 0;
    let isDragging = false;
    let startX = 0;
    let startAngle = 0;
    let lastX = 0;
    let velocity = 0;
    let lastTime = performance.now();
    let clickStartX = 0;
    let clickStartY = 0;

    let snapTimeout: NodeJS.Timeout | null = null;

    const startSnapTimeout = () => {
      if (snapTimeout) clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        // Snap to nearest slot
        targetAngle = Math.round(targetAngle / step) * step;
      }, 250);
    };

    // --- INTERACTION EVENT LISTENERS ---

    // 1. Wheel and Touchpad Scroll
    const handleWheel = (e: WheelEvent) => {
      // Choose deltaX or deltaY depending on scroll direction
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      targetAngle += delta * 0.0018;

      startSnapTimeout();
    };

    // 2. Keyboard Arrow Keys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        targetAngle -= step;
        startSnapTimeout();
      } else if (e.key === "ArrowRight") {
        targetAngle += step;
        startSnapTimeout();
      }
    };

    // 3. Pointer Dragging and Clicks (Raycaster)
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

      if (snapTimeout) clearTimeout(snapTimeout);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;

      // Calculate rotation change. Adjust sensitivity as needed (increased for compressed layout)
      const rotationDelta = (dx / container.clientWidth) * Math.PI * 2.2;
      targetAngle = startAngle + rotationDelta;

      // Track speed for inertia
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const currentDx = e.clientX - lastX;
        velocity = ((currentDx / container.clientWidth) * Math.PI * 2.2) / (dt / 1000);
      }
      lastX = e.clientX;
      lastTime = now;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;

      // Add push from flicking
      if (Math.abs(velocity) > 0.15) {
        targetAngle += velocity * 0.15;
      }
      startSnapTimeout();

      // Check click tap
      const dx = Math.abs(e.clientX - clickStartX);
      const dy = Math.abs(e.clientY - clickStartY);
      if (dx < 6 && dy < 6) {
        // Find click intersection
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        raycaster.setFromCamera(mouse, camera);

        // Find intersections with all card group contents
        const flatMeshes: THREE.Object3D[] = [];
        cardGroups.forEach((group) => {
          group.children.forEach((c) => flatMeshes.push(c));
        });

        const intersects = raycaster.intersectObjects(flatMeshes);

        if (intersects.length > 0) {
          // Find root group parent
          let targetObj = intersects[0].object;
          while (targetObj.parent && targetObj.userData.cardIndex === undefined) {
            targetObj = targetObj.parent;
          }

          const cardIndex = targetObj.userData.cardIndex;
          if (cardIndex !== undefined) {
            // Read activeIndex ref via event or closure
            // In Three.js, check current activeIndex
            const calculatedActiveIndex = getActiveCardIndex(targetAngle);

            if (cardIndex === calculatedActiveIndex) {
              // Clicked the active card -> Redirect!
              window.location.href = pageCards[cardIndex].link;
            } else {
              // Clicked inactive card -> Rotate to center it
              let diff = -cardIndex * step - targetAngle;

              // Find shortest path
              diff = Math.atan2(Math.sin(diff), Math.cos(diff));
              targetAngle += diff;
              startSnapTimeout();
            }
          }
        }
      }
    };

    const getActiveCardIndex = (angle: number) => {
      let minDiff = Infinity;
      let activeIdx = 0;

      for (let i = 0; i < N; i++) {
        let cardAngle = (i * step + angle) % (2 * Math.PI);
        // Normalize angle to -PI to PI
        cardAngle = Math.atan2(Math.sin(cardAngle), Math.cos(cardAngle));

        if (Math.abs(cardAngle) < minDiff) {
          minDiff = Math.abs(cardAngle);
          activeIdx = i;
        }
      }
      return activeIdx;
    };

    // Attach listeners
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

      // Inertia interpolation (damping)
      currentAngle += (targetAngle - currentAngle) * 0.075;

      // Update cards positions/scales
      cardGroups.forEach((group, index) => {
        const cardAngle = index * step + currentAngle;

        // Normalize angle to -PI to PI
        let normalizedAngle = cardAngle % (2 * Math.PI);
        normalizedAngle = Math.atan2(Math.sin(normalizedAngle), Math.cos(normalizedAngle));

        // Compress the angle so they all fit in the front fanned-out view
        const compressedAngle = normalizedAngle * compressionFactor;

        // 1. Position on cylinder using compressedAngle
        const x = Math.sin(compressedAngle) * radius;
        const z = Math.cos(compressedAngle) * radius + zOffset; // Offset cylinder center

        // 2. Y-position creates an arch/dome shape, shifted upwards closer to the navbar
        const y = -Math.pow(compressedAngle, 2) * archFactor + yOffset;
        group.position.set(x, y, z);

        // 3. Rotate around Y to face slightly inwards/outwards
        group.rotation.y = compressedAngle;

        // 4. Tilt/Roll around Z-axis to form a curved arch
        group.rotation.z = -compressedAngle * tiltFactor;

        // 5. Highlight/Scale active card
        // Compute factor based on how close the card is to center front (0 angle)
        const frontFactor = Math.max(0, 1 - Math.abs(normalizedAngle) / (Math.PI / 2.5)); // focus zone

        // Scale active card up smoothly
        const scale = (1.0 + frontFactor * 0.28) * baseCardScale;
        group.scale.set(scale, scale, scale);

        // Adjust materials opacity/brightness of inner objects
        // Cards at the far edges fade out smoothly before wrapping.
        // We set renderOrder based on opacity to ensure proper overlapping rendering.
        const opacityFactor = Math.pow(Math.max(0, 1 - Math.abs(normalizedAngle) / Math.PI), 0.75);
        const order = Math.round(opacityFactor * 100);

        group.children.forEach((mesh) => {
          mesh.renderOrder = order;
          const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.opacity = opacityFactor;
            mat.transparent = true;
          }
        });
      });

      // Track active card index in loop
      const currentActiveIdx = getActiveCardIndex(currentAngle);
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

      // Dispose resources
      scene.clear();
      renderer.dispose();
    };
  }, [onChangeActiveIndex]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none outline-none relative overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
