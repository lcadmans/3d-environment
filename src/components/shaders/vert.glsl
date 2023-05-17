varying vec2 vUv;
uniform float uTime;

void main() {
  vUv = uv;

  vec3 pos = position;
  float noiseFreq = 1;
  float noiseAmp = 1; 
  vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
  pos.z += snoise(noisePos) * noiseAmp;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}