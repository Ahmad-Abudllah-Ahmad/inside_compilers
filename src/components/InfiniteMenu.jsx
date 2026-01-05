import React, { useEffect, useRef, useState } from 'react';
import { mat4, quat, vec2, vec3 } from 'gl-matrix';
import './InfiniteMenu.css';

const discVertShaderSource = `#version 300 es

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uCameraPosition;
uniform vec4 uRotationAxisVelocity;

in vec3 aModelPosition;
in vec3 aModelNormal;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;

out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;

#define PI 3.141593

void main() {
    vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);

    vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;
    float radius = length(centerPos.xyz);

    if (gl_VertexID > 0) {
        vec3 rotationAxis = uRotationAxisVelocity.xyz;
        float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);
        vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
        vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
        float strength = dot(stretchDir, relativeVertexPos);
        float invAbsStrength = min(0., abs(strength) - 1.);
        strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);
        worldPosition.xyz += stretchDir * strength;
    }

    worldPosition.xyz = radius * normalize(worldPosition.xyz);

    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;
    vUvs = aModelUvs;
    vInstanceId = gl_InstanceID;
}
`;

const discFragShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;

out vec4 outColor;

in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;

void main() {
    int itemIndex = vInstanceId % uItemCount;
    int cellsPerRow = uAtlasSize;
    int cellX = itemIndex % cellsPerRow;
    int cellY = itemIndex / cellsPerRow;
    vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
    vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;

    ivec2 texSize = textureSize(uTex, 0);
    float imageAspect = float(texSize.x) / float(texSize.y);
    float containerAspect = 1.0;
    
    float scale = max(imageAspect / containerAspect, 
                     containerAspect / imageAspect);
    
    vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
    st = (st - 0.5) * scale + 0.5;
    
    st = clamp(st, 0.0, 1.0);
    
    st = st * cellSize + cellOffset;
    
    outColor = texture(uTex, st);
    outColor.a *= vAlpha;
}
`;

class Face {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

class Vertex {
  constructor(x, y, z) {
    this.position = vec3.fromValues(x, y, z);
    this.normal = vec3.create();
    this.uv = vec2.create();
  }
}

class Geometry {
  constructor() {
    this.vertices = [];
    this.faces = [];
  }

  addVertex(...args) {
    for (let i = 0; i < args.length; i += 3) {
      this.vertices.push(new Vertex(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  addFace(...args) {
    for (let i = 0; i < args.length; i += 3) {
      this.faces.push(new Face(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  get lastVertex() {
    return this.vertices[this.vertices.length - 1];
  }

  subdivide(divisions = 1) {
    const midPointCache = {};
    let f = this.faces;

    for (let div = 0; div < divisions; ++div) {
      const newFaces = new Array(f.length * 4);

      f.forEach((face, ndx) => {
        const mAB = this.getMidPoint(face.a, face.b, midPointCache);
        const mBC = this.getMidPoint(face.b, face.c, midPointCache);
        const mCA = this.getMidPoint(face.c, face.a, midPointCache);

        const i = ndx * 4;
        newFaces[i + 0] = new Face(face.a, mAB, mCA);
        newFaces[i + 1] = new Face(face.b, mBC, mAB);
        newFaces[i + 2] = new Face(face.c, mCA, mBC);
        newFaces[i + 3] = new Face(mAB, mBC, mCA);
      });

      f = newFaces;
    }

    this.faces = f;
    return this;
  }

  spherize(radius = 1) {
    this.vertices.forEach(vertex => {
      vec3.normalize(vertex.normal, vertex.position);
      vec3.scale(vertex.position, vertex.normal, radius);
    });
    return this;
  }

  get data() {
    return {
      vertices: this.vertexData,
      indices: this.indexData,
      normals: this.normalData,
      uvs: this.uvData
    };
  }

  get vertexData() {
    return new Float32Array(this.vertices.flatMap(v => Array.from(v.position)));
  }

  get normalData() {
    return new Float32Array(this.vertices.flatMap(v => Array.from(v.normal)));
  }

  get uvData() {
    return new Float32Array(this.vertices.flatMap(v => Array.from(v.uv)));
  }

  get indexData() {
    return new Uint16Array(this.faces.flatMap(f => [f.a, f.b, f.c]));
  }

  getMidPoint(ndxA, ndxB, cache) {
    const cacheKey = ndxA < ndxB ? `k_${ndxB}_${ndxA}` : `k_${ndxA}_${ndxB}`;
    if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
      return cache[cacheKey];
    }
    const a = this.vertices[ndxA].position;
    const b = this.vertices[ndxB].position;
    const ndx = this.vertices.length;
    cache[cacheKey] = ndx;
    this.addVertex((a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5, (a[2] + b[2]) * 0.5);
    return ndx;
  }
}

class IcosahedronGeometry extends Geometry {
  constructor() {
    super();
    const t = Math.sqrt(5) * 0.5 + 0.5;
    this.addVertex(
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      0,
      0,
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      t,
      0,
      -1,
      t,
      0,
      1,
      -t,
      0,
      -1,
      -t,
      0,
      1
    ).addFace(
      0,
      11,
      5,
      0,
      5,
      1,
      0,
      1,
      7,
      0,
      7,
      10,
      0,
      10,
      11,
      1,
      5,
      9,
      5,
      11,
      4,
      11,
      10,
      2,
      10,
      7,
      6,
      7,
      1,
      8,
      3,
      9,
      4,
      3,
      4,
      2,
      3,
      2,
      6,
      3,
      6,
      8,
      3,
      8,
      9,
      4,
      9,
      5,
      2,
      4,
      11,
      6,
      2,
      10,
      8,
      6,
      7,
      9,
      8,
      1
    );
  }
}

class DiscGeometry extends Geometry {
  constructor(steps = 4, radius = 1) {
    super();
    steps = Math.max(4, steps);

    const alpha = (2 * Math.PI) / steps;

    this.addVertex(0, 0, 0);
    this.lastVertex.uv[0] = 0.5;
    this.lastVertex.uv[1] = 0.5;

    for (let i = 0; i < steps; ++i) {
      const x = Math.cos(alpha * i);
      const y = Math.sin(alpha * i);
      this.addVertex(radius * x, radius * y, 0);
      this.lastVertex.uv[0] = x * 0.5 + 0.5;
      this.lastVertex.uv[1] = y * 0.5 + 0.5;

      if (i > 0) {
        this.addFace(0, i, i + 1);
      }
    }
    this.addFace(0, steps, 1);
  }
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(gl, shaderSources, transformFeedbackVaryings, attribLocations) {
  const program = gl.createProgram();

  [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx]);
    if (shader) gl.attachShader(program, shader);
  });

  if (transformFeedbackVaryings) {
    gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.SEPARATE_ATTRIBS);
  }

  if (attribLocations) {
    for (const attrib in attribLocations) {
      gl.bindAttribLocation(program, attribLocations[attrib], attrib);
    }
  }

  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function makeVertexArray(gl, bufLocNumElmPairs, indices) {
  const va = gl.createVertexArray();
  gl.bindVertexArray(va);

  for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
    if (loc === -1) continue;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, numElem, gl.FLOAT, false, 0, 0);
  }

  if (indices) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  }

  gl.bindVertexArray(null);
  return va;
}

function resizeCanvasToDisplaySize(canvas) {
  const dpr = Math.min(2, window.devicePixelRatio);
  const displayWidth = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);
  const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize;
}

function makeBuffer(gl, sizeOrData, usage) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buf;
}

function createAndSetupTexture(gl, minFilter, magFilter, wrapS, wrapT) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  return texture;
}

class ArcballControl {
  isPointerDown = false;
  orientation = quat.create();
  pointerRotation = quat.create();
  rotationVelocity = 0;
  rotationAxis = vec3.fromValues(1, 0, 0);
  snapDirection = vec3.fromValues(0, 0, -1);
  snapTargetDirection;
  EPSILON = 0.1;
  IDENTITY_QUAT = quat.create();

  constructor(canvas, updateCallback) {
    this.canvas = canvas;
    this.updateCallback = updateCallback || (() => null);

    this.pointerPos = vec2.create();
    this.previousPointerPos = vec2.create();
    this._rotationVelocity = 0;
    this._combinedQuat = quat.create();

    // Unified pointer handling that works for both mouse and touch
    const handlePointerStart = (x, y) => {
      vec2.set(this.pointerPos, x, y);
      vec2.copy(this.previousPointerPos, this.pointerPos);
      this.isPointerDown = true;
    };

    const handlePointerMove = (x, y) => {
      if (this.isPointerDown) {
        vec2.set(this.pointerPos, x, y);
      }
    };

    const handlePointerEnd = () => {
      this.isPointerDown = false;
    };

    // Mouse events
    canvas.addEventListener('mousedown', e => {
      handlePointerStart(e.clientX, e.clientY);
    });
    canvas.addEventListener('mouseup', handlePointerEnd);
    canvas.addEventListener('mouseleave', handlePointerEnd);
    canvas.addEventListener('mousemove', e => {
      handlePointerMove(e.clientX, e.clientY);
    });

    // Touch events with explicit handling for mobile
    canvas.addEventListener('touchstart', e => {
      e.preventDefault(); // Prevent scroll
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerStart(touch.clientX, touch.clientY);
      }
    }, { passive: false });

    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      handlePointerEnd();
    }, { passive: false });

    canvas.addEventListener('touchcancel', e => {
      e.preventDefault();
      handlePointerEnd();
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
      e.preventDefault(); // Prevent scroll while dragging
      if (e.touches.length > 0 && this.isPointerDown) {
        const touch = e.touches[0];
        handlePointerMove(touch.clientX, touch.clientY);
      }
    }, { passive: false });

    // Also keep pointer events for browsers that support them
    canvas.addEventListener('pointerdown', e => {
      handlePointerStart(e.clientX, e.clientY);
    });
    canvas.addEventListener('pointerup', handlePointerEnd);
    canvas.addEventListener('pointerleave', handlePointerEnd);
    canvas.addEventListener('pointermove', e => {
      handlePointerMove(e.clientX, e.clientY);
    });

    canvas.style.touchAction = 'none';
  }

  update(deltaTime, targetFrameDuration = 16) {
    const timeScale = deltaTime / targetFrameDuration + 0.00001;
    let angleFactor = timeScale;
    let snapRotation = quat.create();

    if (this.isPointerDown) {
      const INTENSITY = 0.3 * timeScale;
      const ANGLE_AMPLIFICATION = 5 / timeScale;

      const midPointerPos = vec2.sub(vec2.create(), this.pointerPos, this.previousPointerPos);
      vec2.scale(midPointerPos, midPointerPos, INTENSITY);

      if (vec2.sqrLen(midPointerPos) > this.EPSILON) {
        vec2.add(midPointerPos, this.previousPointerPos, midPointerPos);

        const p = this.#project(midPointerPos);
        const q = this.#project(this.previousPointerPos);
        const a = vec3.normalize(vec3.create(), p);
        const b = vec3.normalize(vec3.create(), q);

        vec2.copy(this.previousPointerPos, midPointerPos);

        angleFactor *= ANGLE_AMPLIFICATION;

        this.quatFromVectors(a, b, this.pointerRotation, angleFactor);
      } else {
        quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, INTENSITY);
      }
    } else {
      const INTENSITY = 0.1 * timeScale;
      quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, INTENSITY);

      if (this.snapTargetDirection) {
        const SNAPPING_INTENSITY = 0.2;
        const a = this.snapTargetDirection;
        const b = this.snapDirection;
        const sqrDist = vec3.squaredDistance(a, b);
        const distanceFactor = Math.max(0.1, 1 - sqrDist * 10);
        angleFactor *= SNAPPING_INTENSITY * distanceFactor;
        this.quatFromVectors(a, b, snapRotation, angleFactor);
      }
    }

    const combinedQuat = quat.multiply(quat.create(), snapRotation, this.pointerRotation);
    this.orientation = quat.multiply(quat.create(), combinedQuat, this.orientation);
    quat.normalize(this.orientation, this.orientation);

    const RA_INTENSITY = 0.8 * timeScale;
    quat.slerp(this._combinedQuat, this._combinedQuat, combinedQuat, RA_INTENSITY);
    quat.normalize(this._combinedQuat, this._combinedQuat);

    const rad = Math.acos(this._combinedQuat[3]) * 2.0;
    const s = Math.sin(rad / 2.0);
    let rv = 0;
    if (s > 0.000001) {
      rv = rad / (2 * Math.PI);
      this.rotationAxis[0] = this._combinedQuat[0] / s;
      this.rotationAxis[1] = this._combinedQuat[1] / s;
      this.rotationAxis[2] = this._combinedQuat[2] / s;
    }

    const RV_INTENSITY = 0.5 * timeScale;
    this._rotationVelocity += (rv - this._rotationVelocity) * RV_INTENSITY;
    this.rotationVelocity = this._rotationVelocity / timeScale;

    this.updateCallback(deltaTime);
  }

  quatFromVectors(a, b, out, angleFactor = 1) {
    const axis = vec3.cross(vec3.create(), a, b);
    vec3.normalize(axis, axis);
    const d = Math.max(-1, Math.min(1, vec3.dot(a, b)));
    const angle = Math.acos(d) * angleFactor;
    quat.setAxisAngle(out, axis, angle);
    return { q: out, axis, angle };
  }

  #project(pos) {
    const r = 2;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const s = Math.max(w, h) - 1;

    const x = (2 * pos[0] - w - 1) / s;
    const y = (2 * pos[1] - h - 1) / s;
    let z = 0;
    const xySq = x * x + y * y;
    const rSq = r * r;

    if (xySq <= rSq / 2.0) {
      z = Math.sqrt(rSq - xySq);
    } else {
      z = rSq / Math.sqrt(xySq);
    }
    return vec3.fromValues(-x, y, z);
  }
}

class InfiniteGridMenu {
  TARGET_FRAME_DURATION = 1000 / 60;
  SPHERE_RADIUS = 2;

  #time = 0;
  #deltaTime = 0;
  #deltaFrames = 0;
  #frames = 0;

  // Mobile detection - initially false, updated in resize()
  isMobile = false;

  // Visibility tracking for performance optimization
  isVisible = true;

  camera = {
    matrix: mat4.create(),
    near: 0.1,
    far: 40,
    fov: Math.PI / 4,
    aspect: 1,
    position: vec3.fromValues(0, 0, 3), // Will be updated in resize()
    up: vec3.fromValues(0, 1, 0),
    matrices: {
      view: mat4.create(),
      projection: mat4.create(),
      inversProjection: mat4.create()
    }
  };

  nearestVertexIndex = null;
  smoothRotationVelocity = 0;
  scaleFactor = 1.0;
  movementActive = false;

  constructor(canvas, items, onActiveItemChange, onMovementChange, onInit = null) {
    this.canvas = canvas;
    this.items = items || [];
    this.onActiveItemChange = onActiveItemChange || (() => { });
    this.onMovementChange = onMovementChange || (() => { });
    this.#init(onInit);
  }

  resize() {
    this.viewportSize = vec2.set(this.viewportSize || vec2.create(), this.canvas.clientWidth, this.canvas.clientHeight);

    // Update mobile detection dynamically
    this.isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Update camera position based on device
    const targetCameraZ = this.isMobile ? 4.5 : 3;
    this.camera.position[2] = targetCameraZ;

    const gl = this.gl;
    const needsResize = resizeCanvasToDisplaySize(gl.canvas);
    if (needsResize) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    this.#updateProjectionMatrix(gl);
    this.#updateCameraMatrix();
  }

  run(time = 0) {
    // Stop if destroyed
    if (this.destroyed) return;

    // Skip rendering if not visible (performance optimization)
    if (!this.isVisible) {
      requestAnimationFrame(t => this.run(t));
      return;
    }

    this.#deltaTime = Math.min(32, time - this.#time);
    this.#time = time;
    this.#deltaFrames = this.#deltaTime / this.TARGET_FRAME_DURATION;
    this.#frames += this.#deltaFrames;

    this.#animate(this.#deltaTime);
    this.#render();

    requestAnimationFrame(t => this.run(t));
  }

  #init(onInit) {
    this.gl = this.canvas.getContext('webgl2', { antialias: true, alpha: false });
    const gl = this.gl;
    if (!gl) {
      throw new Error('No WebGL 2 context!');
    }

    this.viewportSize = vec2.fromValues(this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawBufferSize = vec2.clone(this.viewportSize);

    this.discProgram = createProgram(gl, [discVertShaderSource, discFragShaderSource], null, {
      aModelPosition: 0,
      aModelNormal: 1,
      aModelUvs: 2,
      aInstanceMatrix: 3
    });

    this.discLocations = {
      aModelPosition: gl.getAttribLocation(this.discProgram, 'aModelPosition'),
      aModelUvs: gl.getAttribLocation(this.discProgram, 'aModelUvs'),
      aInstanceMatrix: gl.getAttribLocation(this.discProgram, 'aInstanceMatrix'),
      uWorldMatrix: gl.getUniformLocation(this.discProgram, 'uWorldMatrix'),
      uViewMatrix: gl.getUniformLocation(this.discProgram, 'uViewMatrix'),
      uProjectionMatrix: gl.getUniformLocation(this.discProgram, 'uProjectionMatrix'),
      uCameraPosition: gl.getUniformLocation(this.discProgram, 'uCameraPosition'),
      uScaleFactor: gl.getUniformLocation(this.discProgram, 'uScaleFactor'),
      uRotationAxisVelocity: gl.getUniformLocation(this.discProgram, 'uRotationAxisVelocity'),
      uTex: gl.getUniformLocation(this.discProgram, 'uTex'),
      uFrames: gl.getUniformLocation(this.discProgram, 'uFrames'),
      uItemCount: gl.getUniformLocation(this.discProgram, 'uItemCount'),
      uAtlasSize: gl.getUniformLocation(this.discProgram, 'uAtlasSize')
    };

    this.discGeo = new DiscGeometry(56, 0.8);
    this.discBuffers = this.discGeo.data;
    this.discVAO = makeVertexArray(
      gl,
      [
        [makeBuffer(gl, this.discBuffers.vertices, gl.STATIC_DRAW), this.discLocations.aModelPosition, 3],
        [makeBuffer(gl, this.discBuffers.uvs, gl.STATIC_DRAW), this.discLocations.aModelUvs, 2]
      ],
      this.discBuffers.indices
    );

    this.icoGeo = new IcosahedronGeometry();
    this.icoGeo.subdivide(1).spherize(this.SPHERE_RADIUS);
    this.instancePositions = this.icoGeo.vertices.map(v => v.position);
    this.DISC_INSTANCE_COUNT = this.icoGeo.vertices.length;
    this.#initDiscInstances(this.DISC_INSTANCE_COUNT);

    this.worldMatrix = mat4.create();
    this.#initTexture();

    this.control = new ArcballControl(this.canvas, deltaTime => this.#onControlUpdate(deltaTime));

    this.#updateCameraMatrix();
    this.#updateProjectionMatrix(gl);
    this.resize();

    if (onInit) onInit(this);
  }

  #initTexture() {
    const gl = this.gl;
    this.tex = createAndSetupTexture(gl, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);

    const itemCount = Math.max(1, this.items.length);
    this.atlasSize = Math.ceil(Math.sqrt(itemCount));
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 512;

    canvas.width = this.atlasSize * cellSize;
    canvas.height = this.atlasSize * cellSize;

    Promise.all(
      this.items.map(
        item =>
          new Promise(resolve => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.src = item.image;
          })
      )
    ).then(images => {
      images.forEach((img, i) => {
        const x = (i % this.atlasSize) * cellSize;
        const y = Math.floor(i / this.atlasSize) * cellSize;
        ctx.drawImage(img, x, y, cellSize, cellSize);
      });

      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
      gl.generateMipmap(gl.TEXTURE_2D);
    });
  }

  #initDiscInstances(count) {
    const gl = this.gl;
    this.discInstances = {
      matricesArray: new Float32Array(count * 16),
      matrices: [],
      buffer: gl.createBuffer()
    };
    for (let i = 0; i < count; ++i) {
      const instanceMatrixArray = new Float32Array(this.discInstances.matricesArray.buffer, i * 16 * 4, 16);
      instanceMatrixArray.set(mat4.create());
      this.discInstances.matrices.push(instanceMatrixArray);
    }
    gl.bindVertexArray(this.discVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.discInstances.matricesArray.byteLength, gl.DYNAMIC_DRAW);
    const mat4AttribSlotCount = 4;
    const bytesPerMatrix = 16 * 4;
    for (let j = 0; j < mat4AttribSlotCount; ++j) {
      const loc = this.discLocations.aInstanceMatrix + j;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, j * 4 * 4);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  #animate(deltaTime) {
    const gl = this.gl;
    this.control.update(deltaTime, this.TARGET_FRAME_DURATION);

    let positions = this.instancePositions.map(p => vec3.transformQuat(vec3.create(), p, this.control.orientation));
    // Mobile: LARGER discs for better visibility
    const scale = this.isMobile ? 0.30 : 0.25;
    const SCALE_INTENSITY = this.isMobile ? 0.4 : 0.6;
    positions.forEach((p, ndx) => {
      const s = (Math.abs(p[2]) / this.SPHERE_RADIUS) * SCALE_INTENSITY + (1 - SCALE_INTENSITY);
      const finalScale = s * scale;
      const matrix = mat4.create();
      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), vec3.negate(vec3.create(), p)));
      mat4.multiply(matrix, matrix, mat4.targetTo(mat4.create(), [0, 0, 0], p, [0, 1, 0]));
      mat4.multiply(matrix, matrix, mat4.fromScaling(mat4.create(), [finalScale, finalScale, finalScale]));
      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), [0, 0, -this.SPHERE_RADIUS]));

      mat4.copy(this.discInstances.matrices[ndx], matrix);
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.discInstances.matricesArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.smoothRotationVelocity = this.control.rotationVelocity;
  }

  #render() {
    const gl = this.gl;
    gl.useProgram(this.discProgram);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(this.discLocations.uWorldMatrix, false, this.worldMatrix);
    gl.uniformMatrix4fv(this.discLocations.uViewMatrix, false, this.camera.matrices.view);
    gl.uniformMatrix4fv(this.discLocations.uProjectionMatrix, false, this.camera.matrices.projection);
    gl.uniform3f(
      this.discLocations.uCameraPosition,
      this.camera.position[0],
      this.camera.position[1],
      this.camera.position[2]
    );
    gl.uniform4f(
      this.discLocations.uRotationAxisVelocity,
      this.control.rotationAxis[0],
      this.control.rotationAxis[1],
      this.control.rotationAxis[2],
      this.smoothRotationVelocity * 1.1
    );

    gl.uniform1i(this.discLocations.uItemCount, this.items.length);
    gl.uniform1i(this.discLocations.uAtlasSize, this.atlasSize);

    gl.uniform1f(this.discLocations.uFrames, this.#frames);
    gl.uniform1f(this.discLocations.uScaleFactor, this.scaleFactor);
    gl.uniform1i(this.discLocations.uTex, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.bindVertexArray(this.discVAO);
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      this.discBuffers.indices.length,
      gl.UNSIGNED_SHORT,
      0,
      this.DISC_INSTANCE_COUNT
    );
  }

  #updateCameraMatrix() {
    mat4.targetTo(this.camera.matrix, this.camera.position, [0, 0, 0], this.camera.up);
    mat4.invert(this.camera.matrices.view, this.camera.matrix);
  }

  #updateProjectionMatrix(gl) {
    this.camera.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    // Use same height multiplier for both, let camera distance handle mobile
    const height = this.SPHERE_RADIUS * 0.4;
    const distance = this.camera.position[2];
    if (this.camera.aspect > 1) {
      // Landscape
      this.camera.fov = 2 * Math.atan(height / distance);
    } else {
      // Portrait (mobile) - limit how much we divide by aspect to prevent extreme zoom
      const adjustedAspect = Math.max(0.6, this.camera.aspect);
      this.camera.fov = 2 * Math.atan(height / adjustedAspect / distance);
    }
    mat4.perspective(
      this.camera.matrices.projection,
      this.camera.fov,
      this.camera.aspect,
      this.camera.near,
      this.camera.far
    );
    mat4.invert(this.camera.matrices.inversProjection, this.camera.matrices.projection);
  }

  #onControlUpdate(deltaTime) {
    const timeScale = deltaTime / this.TARGET_FRAME_DURATION + 0.0001;
    let damping = 5 / timeScale;
    // Base camera distance - different for mobile
    let cameraTargetZ = this.isMobile ? 4.5 : 3;

    const isMoving = this.control.isPointerDown || Math.abs(this.smoothRotationVelocity) > 0.01;

    if (isMoving !== this.movementActive) {
      this.movementActive = isMoving;
      this.onMovementChange(isMoving);
    }

    if (!this.control.isPointerDown) {
      const nearestVertexIndex = this.#findNearestVertexIndex();
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);
      const snapDirection = vec3.normalize(vec3.create(), this.#getVertexWorldPosition(nearestVertexIndex));
      this.control.snapTargetDirection = snapDirection;
    } else {
      // Zoom in slightly while dragging - less extreme on mobile
      cameraTargetZ += this.control.rotationVelocity * (this.isMobile ? 30 : 80) + (this.isMobile ? 0.5 : 2.5);
      damping = 7 / timeScale;
    }

    this.camera.position[2] += (cameraTargetZ - this.camera.position[2]) / damping;
    this.#updateCameraMatrix();
  }

  #findNearestVertexIndex() {
    const n = this.control.snapDirection;
    const inversOrientation = quat.conjugate(quat.create(), this.control.orientation);
    const nt = vec3.transformQuat(vec3.create(), n, inversOrientation);

    let maxD = -1;
    let nearestVertexIndex;
    for (let i = 0; i < this.instancePositions.length; ++i) {
      const d = vec3.dot(nt, this.instancePositions[i]);
      if (d > maxD) {
        maxD = d;
        nearestVertexIndex = i;
      }
    }
    return nearestVertexIndex;
  }

  #getVertexWorldPosition(index) {
    const nearestVertexPos = this.instancePositions[index];
    return vec3.transformQuat(vec3.create(), nearestVertexPos, this.control.orientation);
  }

  // CRITICAL: Properly destroy WebGL resources to prevent context accumulation
  destroy() {
    const gl = this.gl;
    if (!gl) return;

    // Stop the animation loop
    this.destroyed = true;

    // Delete textures
    if (this.tex) {
      gl.deleteTexture(this.tex);
      this.tex = null;
    }

    // Delete buffers
    if (this.discInstances && this.discInstances.buffer) {
      gl.deleteBuffer(this.discInstances.buffer);
    }

    // Delete VAO
    if (this.discVAO) {
      gl.deleteVertexArray(this.discVAO);
      this.discVAO = null;
    }

    // Delete program
    if (this.discProgram) {
      gl.deleteProgram(this.discProgram);
      this.discProgram = null;
    }

    // Lose the WebGL context to free GPU resources
    const loseContext = gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }

    this.gl = null;
  }
}

const defaultItems = [
  {
    image: 'https://picsum.photos/900/900?grayscale',
    link: 'https://google.com/',
    title: 'Default Item',
    description: 'Default description'
  }
];

/**
 * @typedef {Object} MenuItem
 * @property {string} image - URL of the image
 * @property {string} link - URL to navigate to
 * @property {string} title - Title of the item
 * @property {string} description - Description of the item
 */

/**
 * @param {{ items?: MenuItem[] }} props
 */
function InfiniteMenuBase({ items = [] }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isVisibleRef = useRef(true); // Track visibility for performance
  const [activeItem, setActiveItem] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [webglError, setWebglError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFocusedView, setIsFocusedView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload images for smooth experience
  useEffect(() => {
    const itemsToUse = items.length ? items : defaultItems;
    const imagePromises = itemsToUse.map(item => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // Still resolve to not block loading
        img.src = item.image;
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
      setIsInitializing(false);
    });
  }, [items]);

  useEffect(() => {
    const canvas = canvasRef.current;
    let sketch;
    const itemsToUse = items.length ? items : defaultItems;

    // Wait for images to load before initializing
    if (!imagesLoaded) return;

    if (!canvas) {
      // Canvas not found, using fallback UI
      setWebglError(true);
      return;
    }

    // Try WebGL first, fallback to CSS if it fails
    try {
      const gl = canvas.getContext('webgl2', { antialias: true, alpha: false });
      if (!gl) {
        // WebGL2 not available, using fallback UI
        setWebglError(true);
        return;
      }
    } catch (error) {
      // WebGL context failed, using fallback UI
      setWebglError(true);
      return;
    }

    // Set initial active item immediately
    setActiveItem(itemsToUse[0]);
    setIsFocusedView(true);

    const handleActiveItem = index => {
      const itemIndex = index % itemsToUse.length;
      setActiveItem(itemsToUse[itemIndex]);
      setIsFocusedView(true);
    };

    try {
      // Creating WebGL menu
      sketch = new InfiniteGridMenu(
        canvas,
        itemsToUse,
        handleActiveItem,
        (moving) => {
          setIsMoving(moving);
          if (!moving) {
            setIsFocusedView(true);
          }
        },
        sk => {
          // WebGL menu initialized
          setActiveItem(itemsToUse[0]);
          setIsFocusedView(true);
          sk.run();
        }
      );
    } catch (error) {
      // Error creating WebGL menu, using fallback
      setWebglError(true);
      // Set up fallback with first item
      setActiveItem(itemsToUse[0]);

      // Auto-rotate items for fallback
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = (prev + 1) % itemsToUse.length;
          setActiveItem(itemsToUse[nextIndex]);
          return nextIndex;
        });
      }, 4000);

      return () => clearInterval(interval);
    }

    const handleResize = () => {
      if (sketch && !webglError) {
        sketch.resize();
      }
    };

    // PERFORMANCE: IntersectionObserver to pause WebGL when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (sketch) {
          sketch.isVisible = entry.isIntersecting;
        }
      },
      { rootMargin: '200px' }
    );
    if (canvas) {
      observer.observe(canvas);
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (sketch && sketch.destroy) {
        sketch.destroy();
      }
    };
  }, [items, imagesLoaded]);

  const handleButtonClick = () => {
    if (!activeItem?.link) return;
    if (activeItem.link.startsWith('http')) {
      window.open(activeItem.link, '_blank');
    } else {
      // Handle internal navigation
    }
  };

  const itemsToUse = items.length ? items : defaultItems;

  // Fallback UI when WebGL fails
  if (webglError) {
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        background: 'radial-gradient(circle at center, rgba(32, 128, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 40%, rgba(0, 0, 0, 0.8) 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Circular layout fallback */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(400px, 90vw)',
          height: 'min(400px, 90vw)',
          maxWidth: '400px',
          maxHeight: '400px'
        }}>
          {itemsToUse.map((item, index) => {
            const angle = (index / itemsToUse.length) * Math.PI * 2;
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const radius = isMobile ? 80 : 120;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isActive = index === currentIndex;

            return (
              <div
                key={index}
                onClick={() => {
                  setActiveItem(item);
                  setCurrentIndex(index);
                  if (item.link) {
                    window.open(item.link, '_blank');
                  }
                }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(${x - (isMobile ? 25 : 35)}px, ${y - (isMobile ? 25 : 35)}px)`,
                  width: isMobile ? '50px' : '70px',
                  height: isMobile ? '50px' : '70px',
                  borderRadius: '12px',
                  background: isActive
                    ? 'rgba(82, 39, 255, 0.9)'
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: isActive
                    ? '2px solid rgba(82, 39, 255, 1)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onLoad={(e) => e.target.style.opacity = '1'}
                  onError={(e) => e.target.style.opacity = '0.5'}
                />
              </div>
            );
          })}
        </div>

        {/* Active item info */}
        {activeItem && (
          <div style={{
            position: 'absolute',
            bottom: isMobile ? '60px' : '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: 'white',
            maxWidth: '90%',
            opacity: activeItem ? 1 : 0,
            transition: 'opacity 0.4s ease',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontSize: isMobile ? '16px' : '20px',
              margin: '0 0 8px 0',
              fontWeight: '600',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)'
            }}>
              {activeItem.title}
            </h3>
            <div style={{
              fontSize: isMobile ? '11px' : '13px',
              margin: '0 0 16px 0',
              opacity: 0.9,
              lineHeight: 1.4,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
              maxHeight: isMobile ? '60px' : '80px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: isMobile ? 3 : 4,
              WebkitBoxOrient: 'vertical'
            }}>
              {activeItem.description}
            </div>
            <button
              onClick={handleButtonClick}
              style={{
                background: 'linear-gradient(45deg, #5227ff, #7c4dff)',
                border: 'none',
                borderRadius: '20px',
                padding: isMobile ? '8px 16px' : '10px 20px',
                color: 'white',
                fontSize: isMobile ? '12px' : '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px rgba(82, 39, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(82, 39, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 4px 16px rgba(82, 39, 255, 0.3)';
              }}
            >
              View Project →
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      data-lenis-prevent
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        background: 'transparent',
        overflow: 'visible',
        touchAction: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}>
      {/* Canvas container with explicit dimensions */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
      }}>
        <canvas
          id="infinite-grid-menu-canvas"
          ref={canvasRef}
          data-lenis-prevent
          style={{
            display: webglError ? 'none' : 'block',
            width: '100%',
            height: '100%',
            background: 'transparent',
            willChange: 'transform',
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        />
      </div>

      {/* WebGL overlay text - show when not moving and has active item */}
      {!webglError && activeItem && (
        <h2
          className={`face-title ${!isMoving ? 'active' : 'inactive'}`}
          style={{
            position: 'absolute',
            left: isMobile ? '1rem' : 'clamp(0.8rem, 3vw, 2rem)',
            top: isMobile ? '15%' : 'clamp(25%, 35%, 45%)',
            transform: 'translateY(-50%)',
            fontSize: isMobile ? 'clamp(1.2rem, 4vw, 1.6rem)' : 'clamp(1.5rem, 3.5vw, 2.8rem)',
            fontWeight: '700',
            color: '#fff',
            zIndex: 200,
            pointerEvents: 'none',
            maxWidth: isMobile ? 'calc(100vw - 2rem)' : 'clamp(160px, 20vw, 300px)',
            lineHeight: isMobile ? '1.2' : '1.1',
            textShadow: '0 3px 15px rgba(0,0,0,0.8)',
            opacity: !isMoving ? 1 : 0,
            transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {activeItem.title}
        </h2>
      )}

      {/* WebGL description text */}
      {!webglError && activeItem && (
        <div
          className={`face-description ${!isMoving ? 'active' : 'inactive'}`}
          style={{
            position: 'absolute',
            left: isMobile ? '0.75rem' : 'auto',
            right: isMobile ? '0.75rem' : 'clamp(1rem, 4vw, 3rem)',
            bottom: isMobile ? '20px' : 'clamp(2rem, 8vh, 6rem)',
            top: isMobile ? 'auto' : 'auto',
            fontSize: isMobile ? '0.85rem' : 'clamp(0.7rem, 1.2vw, 0.95rem)',
            color: '#fff',
            zIndex: 200,
            maxWidth: isMobile ? 'calc(100vw - 1.5rem)' : 'clamp(200px, 25vw, 350px)',
            lineHeight: '1.5',
            pointerEvents: 'none',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            opacity: !isMoving ? 1 : 0,
            transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: isMobile ? '0.875rem 1rem' : 'clamp(0.5rem, 1vw, 1rem)',
            background: isMobile
              ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(20, 20, 30, 0.9) 100%)'
              : 'rgba(0, 0, 0, 0.6)',
            borderRadius: isMobile ? '12px' : '8px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: isMobile
              ? '1px solid rgba(159, 107, 255, 0.2)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isMobile
              ? '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : 'none',
            maxHeight: isMobile ? '100px' : 'clamp(100px, 15vh, 150px)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: isMobile ? 4 : 5,
            WebkitBoxOrient: 'vertical',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {activeItem.description}
        </div>
      )}

      {/* Action button - positioned at bottom on mobile */}
      <div
        onClick={handleButtonClick}
        className={`action-button ${!isMoving && activeItem ? 'visible' : 'hidden'}`}
        style={{
          position: 'absolute',
          left: '50%',
          top: isMobile ? 'auto' : '50%',
          bottom: isMobile ? '20px' : 'auto',
          transform: !isMoving && activeItem
            ? (isMobile ? 'translateX(-50%)' : 'translateX(-50%) translateY(calc(18vh + 10px))')
            : (isMobile ? 'translateX(-50%) translateY(20px)' : 'translateX(-50%) translateY(calc(18vh + 80px))'),
          zIndex: 300,
          width: isMobile ? '50px' : 'clamp(45px, 5vw, 60px)',
          height: isMobile ? '50px' : 'clamp(45px, 5vw, 60px)',
          background: 'linear-gradient(135deg, rgba(159, 107, 255, 0.9), rgba(35, 209, 248, 0.9))',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(159, 107, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.1)',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease',
          opacity: !isMoving && activeItem ? 1 : 0,
          pointerEvents: !isMoving && activeItem ? 'auto' : 'none'
        }}
        onMouseEnter={(e) => {
          if (activeItem) {
            e.target.style.transform = isMobile ? 'translateX(-50%) scale(1.15)' : 'translateX(-50%) translateY(calc(18vh + 10px)) scale(1.15)';
            e.target.style.boxShadow = '0 12px 48px rgba(159, 107, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (activeItem) {
            e.target.style.transform = isMobile ? 'translateX(-50%) scale(1)' : 'translateX(-50%) translateY(calc(18vh + 10px)) scale(1)';
            e.target.style.boxShadow = '0 8px 32px rgba(159, 107, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.1)';
          }
        }}
      >
        <p className="action-button-icon" style={{
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          margin: 0,
          color: '#fff',
          fontWeight: 'bold',
          lineHeight: 1,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>&#x2197;</p>
      </div>
    </div>
  );
}

// Wrap in React.memo to prevent re-renders from parent state changes
export default React.memo(InfiniteMenuBase);
