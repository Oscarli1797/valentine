import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BubuSprite3D() {

  const mountRef = useRef(null);

  useEffect(() => {

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // 光（Sprite 也吃光，给点层次）
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const loader = new THREE.TextureLoader();

    // ===== 男生熊 =====
    const boyMap = loader.load("/bear/bubu.png");
    const boy = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: boyMap, transparent: true })
    );
    boy.scale.set(3, 3, 1);
    boy.position.x = -4;
    scene.add(boy);

    // ===== 女生熊 =====
    const girlMap = loader.load("/bear/yie.webp");
    const girl = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: girlMap, transparent: true })
    );
    girl.scale.set(3, 3, 1);
    girl.position.x = 4;
    scene.add(girl);

    // ===== 爱心 =====
    const heartMap = loader.load("/bears/heart.png"); // 可选
    const heart = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: heartMap, transparent: true })
    );
    heart.scale.set(0, 0, 1);
    heart.position.y = 2.5;
    scene.add(heart);

    let phase = "walk";

    function animate() {
      requestAnimationFrame(animate);

      if (phase === "walk") {
        boy.position.x += 0.03;
        girl.position.x -= 0.03;

        // 轻微呼吸感
        boy.scale.y = 3 + Math.sin(Date.now() * 0.004) * 0.05;
        girl.scale.y = 3 + Math.sin(Date.now() * 0.004 + 1) * 0.05;

        if (boy.position.x > -1.5) phase = "love";
      }

      if (phase === "love") {
        heart.scale.lerp(new THREE.Vector3(1.2, 1.2, 1), 0.05);
        heart.material.opacity = Math.min(1, heart.material.opacity + 0.05);
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => renderer.dispose();

  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "60vh" }} />;
}
