export const fragmentShader = `
    precision mediump float;
    uniform float uTime;
    varying float vScale;
    varying float vPhase;

    void main() {
        float twinkle = 0.6 + 0.4 * sin(uTime * 3.0 * vScale + vPhase);
        gl_FragColor = vec4(1.0, 0.3, 0.05, twinkle);
        if (gl_FragColor.a < 0.2) discard;
    }
`;
