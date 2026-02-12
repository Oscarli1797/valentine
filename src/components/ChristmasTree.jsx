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

    // ===== 场景 =====
    const scene = new THREE.Scene();

    // ===== 相机 =====
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth /
      mountRef.current.clientHeight,
      0.1,
      1000
    );

    // ===== 渲染器 =====
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );

    mountRef.current.appendChild(renderer.domElement);

    // ===== 控制器 =====
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // ===== 光 =====
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // ===== 树参数 =====
    const treeHeight = 10;
    const baseRadius = 4;
    const topRadius = 0.5;

    // =================================================
    // 📸 照片精灵（分批加载）
    // =================================================

    const loader = new THREE.TextureLoader();
    const photoSprites = [];
    const photoCount = 400; // 改成你的真实数量

    let index = 1;
    const batchSize = 20;

    function loadBatch() {

      for (let i = 0; i < batchSize && index <= photoCount; i++, index++) {

        const num = String(index).padStart(3, "0");

        loader.load(
          `/photos/photo${num}.jpg`,

          (texture) => {

            const material = new THREE.SpriteMaterial({
              map: texture
            });

            const sprite = new THREE.Sprite(material);

            const t = Math.random();
            const y = t * treeHeight;

            const r =
              baseRadius -
              (baseRadius - topRadius) * (y / treeHeight);

            const theta = Math.random() * Math.PI * 2;

            sprite.position.set(
              r * Math.cos(theta),
              y - treeHeight / 2,
              r * Math.sin(theta)
            );

            const scale = Math.random() * 0.6 + 0.8;
            sprite.scale.set(scale, scale, scale);

            sprite.userData.pulse = Math.random() * Math.PI * 2;

            scene.add(sprite);
            photoSprites.push(sprite);
          },

          undefined,

          () => console.warn("图片加载失败:", num)
        );
      }

      if (index <= photoCount) {
        setTimeout(loadBatch, 120);
      }
    }

    loadBatch();

    // =================================================
    // 🖱 点击检测
    // =================================================

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(e) {

      const rect = renderer.domElement.getBoundingClientRect();

      mouse.x =
        ((e.clientX - rect.left) / rect.width) * 2 - 1;

      mouse.y =
        -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const hits = raycaster.intersectObjects(photoSprites);

      if (hits.length > 0) {
        setActiveImg(hits[0].object.material.map.image.src);
      }
    }

    renderer.domElement.addEventListener("click", onClick);

    // ===== 相机位置 =====
    camera.position.z = 12;

    // =================================================
    // 🎬 动画
    // =================================================

    function animate() {

      requestAnimationFrame(animate);

      scene.rotation.y += 0.001;

      // 呼吸动画
      photoSprites.forEach(sprite => {
        sprite.userData.pulse += 0.02;
        const s = 1 + Math.sin(sprite.userData.pulse) * 0.05;
        sprite.scale.setScalar(s);
      });

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // =================================================
    // 🔁 Resize
    // =================================================

    const handleResize = () => {

      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // =================================================
    // 🧹 清理
    // =================================================

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
      <div
        ref={mountRef}
        style={{ width: "100%", height: "70vh" }}
      />

      {/* 放大预览 */}
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
