import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ChristmasTree() {

  const mountRef = useRef(null);
  const initialized = useRef(false);
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {

    if (initialized.current) return;
    initialized.current = true;
    if (!mountRef.current) return;

    // ============================
    // 📱 检测是否手机
    // ============================
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

    // ============================
    // 场景
    // ============================
    const scene = new THREE.Scene();

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    // ============================
    // 渲染器（关键优化）
    // ============================
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile, // 手机关闭抗锯齿
      alpha: true
    });

    // 手机必须限制像素比！！！
    renderer.setPixelRatio(isMobile ? 1 : window.devicePixelRatio);

    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // ============================
    // 控制器
    // ============================
    const controls = new OrbitControls(camera, renderer.domElement);

    if (isMobile) {
      controls.enableDamping = false;
      controls.enableZoom = false;
      controls.enablePan = false;
    } else {
      controls.enableDamping = true;
    }

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // ============================
    // 树参数
    // ============================
    const treeHeight = 10;
    const baseRadius = 4;
    const topRadius = 0.5;

    // 手机照片数量必须减少
    const photoCount = isMobile ? 80 : 400;

    const loader = new THREE.TextureLoader();
    const photoSprites = [];

    let index = 1;
    const batchSize = isMobile ? 5 : 20;

    function loadBatch() {

      for (let i = 0; i < batchSize && index <= photoCount; i++, index++) {

        const num = String(index).padStart(3, "0");

        loader.load(`/photos/photo${num}.jpg`, (texture) => {

          // 限制纹理尺寸（关键）
          texture.minFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;

          const material = new THREE.SpriteMaterial({ map: texture });

          const sprite = new THREE.Sprite(material);

          const t = Math.random();
          const y = t * treeHeight;

          const r = baseRadius - (baseRadius - topRadius) * (y / treeHeight);
          const theta = Math.random() * Math.PI * 2;

          sprite.position.set(
            r * Math.cos(theta),
            y - treeHeight / 2,
            r * Math.sin(theta)
          );

          const scale = isMobile ? 0.9 : Math.random() * 0.6 + 0.8;
          sprite.scale.set(scale, scale, scale);

          sprite.userData.pulse = Math.random() * Math.PI * 2;

          scene.add(sprite);
          photoSprites.push(sprite);
        });
      }

      if (index <= photoCount) {
        setTimeout(loadBatch, isMobile ? 200 : 120);
      }
    }

    loadBatch();

    // ============================
    // 点击检测
    // ============================
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

    camera.position.z = 12;

    // ============================
    // 动画（手机禁用呼吸动画）
    // ============================
    function animate() {

      requestAnimationFrame(animate);

      scene.rotation.y += 0.001;

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

    // ============================
    // Resize
    // ============================
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
      scene.clear();
      renderer.dispose();
    };

  }, []);

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
              borderRadius: "20px"
            }}
          />
        </div>
      )}
    </>
  );
}
