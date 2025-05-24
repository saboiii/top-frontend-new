export const vertexShader = `
    precision mediump float;
    attribute float aScale;
    attribute float aPhase;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uMouseVelocity;
    varying float vScale;
    varying float vPhase;

    void main() {
        vScale = aScale;
        vPhase = aPhase;

        // Project position to screen space
        vec4 projected = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec2 screenPos = projected.xy / projected.w;

        // Mouse direction and distance
        vec2 dir = normalize(screenPos - uMouse);
        float dist = length(screenPos - uMouse);

        // Mouse attraction strength
        float strength = 1.4 * aScale * exp(-dist);

        // Flying offset
        float flyStrength = 0.2 * (0.5 + 0.9 * cos(uTime * (1.0 + aScale * 2.0) + aPhase * 3.0));
        vec3 flyDir = normalize(vec3(
            sin(aPhase * 2.0), 
            cos(aPhase * 2.0), 
            sin(aScale * 6.0)
        ));
        float flyDist = 2.0 + aScale * 3.0;
        vec3 flyOffset = flyDir * flyStrength * flyDist;

        // Mouse velocity offset
        float velocityStrength = 0.8 * aScale * exp(-dist * 2.0);
        float velocityOsc = 0.5 * sin(uTime + aPhase * 2.0);
        vec2 velocityOffset = uMouseVelocity * velocityStrength * velocityOsc;

        // Final displacement
        vec3 displaced = position + vec3(dir * strength + velocityOffset, 0.0) + flyOffset;

        // Twinkle and size
        float twinkle = 1.0 + 0.4 * sin(uTime * 10.0 * aScale + aPhase);
        float size = (8.0 + 84.0 * aScale) * twinkle;

        vec4 finalPosition = modelViewMatrix * vec4(displaced, 1.0);
        gl_PointSize = size / -finalPosition.z;
        gl_Position = projectionMatrix * finalPosition;
    }
`;
