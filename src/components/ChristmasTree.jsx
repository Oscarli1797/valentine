import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ChristmasTree() {

  const mountRef = useRef(null);
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {

    if (!mountRef.current) return;

    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // ================= 场景 =================
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile
    });

    // 手机限制像素比（防炸）
    renderer.setPixelRatio(isMobile ? 1 : window.devicePixelRatio);
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // ================= 控制器 =================
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableZoom = true;      // ✅ 允许缩放
    controls.enablePan = false;      // ❌ 禁止平移
    controls.zoomSpeed = isMobile ? 0.6 : 1.0;
    controls.enableDamping = !isMobile;
    controls.dampingFactor = 0.05;

    // 限制缩放范围（非常重要）
    controls.minDistance = 10;
    controls.maxDistance = 30;

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // ================= 照片加载 =================
    const loader = new THREE.TextureLoader();
    const photoSprites = [];

    const photoCount = isMobile ? 50 : 200; // ❤️ 爱心不需要太多

    for (let i = 0; i < photoCount; i++) {

      const t = (i / photoCount) * Math.PI * 2;

      // ❤️ 心形公式
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

      const texture = loader.load(
        `/photos/photo${String(i + 1).padStart(3, "0")}.jpg`
      );

      // 性能优化
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: texture })
      );

      sprite.position.set(x * 0.25, y * 0.25, (Math.random() - 0.5) * 2);

      const scale = isMobile ? 1.2 : 1.4;
      sprite.scale.set(scale, scale, scale);

      sprite.userData.pulse = Math.random() * Math.PI * 2;

      photoSprites.push(sprite);
      scene.add(sprite);
    }

    // ================= 点击检测 =================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(e) {

      const rect = renderer.domElement.getBoundingClientRect();

      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(photoSprites);

      if (hits.length > 0) {
        setActiveImg(hits[0].object.material.map.image.src);
      }
    }

    renderer.domElement.addEventListener("click", onClick);

    // ================= 动画 =================
    function animate() {

      requestAnimationFrame(animate);

      // ❤️ 整体慢慢旋转
      scene.rotation.y += 0.002;

      // ❤️ 呼吸效果（桌面才开）
      if (!isMobile) {
        photoSprites.forEach(sprite => {
          sprite.userData.pulse += 0.02;
          const s = 1 + Math.sin(sprite.userData.pulse) * 0.05;
          sprite.scale.setScalar(s);
        });
      }

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // ================= Resize =================
    const handleResize = () => {
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", onClick);
      controls.dispose();
      renderer.dispose();
    };

  }, []);

  // ================= JSX =================
  return (
    <>
      <div ref={mountRef} style={{ width: "100%", height: "70vh" }} />

      {activeImg && (
        <div
          onClick={() => setActiveImg(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999
          }}
        >
          <img
            src={activeImg}
            style={{
              maxWidth: "80%",
              maxHeight: "80%",
              borderRadius: "20px",
              boxShadow: "0 0 40px pink"
            }}
          />
        </div>
      )}
    </>
  );
}
