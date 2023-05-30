precision mediump float;

uniform vec3 uColor;
uniform float uTime;
uniform float uOpacity;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vWave;

void main() {
  float wave = -tan(vWave * 0.8)*2.0;
  vec3 texture = texture2D(uTexture, vUv + wave).rgb;
  // float luma = -tan(vWave * 0.8)*4.0;
  gl_FragColor = vec4(texture, uOpacity); 
  // gl_FragColor.a = 0.5
  // gl_FragColor = vec4(luminance, luminance, luminance, 1.0);
}


