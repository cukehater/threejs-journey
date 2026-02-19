uniform vec3 uColor;
uniform sampler2D uTexture;
varying vec2 vUv;
varying float vElevation;
// varying float vRandom;

void main() {
    vec4 textureCorlor = texture2D(uTexture, vUv);
    textureCorlor.rgb *= vElevation * 2.0 + 0.9;
    gl_FragColor = textureCorlor;
}
