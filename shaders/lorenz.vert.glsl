uniform float u_time;
uniform vec3 u_pointer; // Mouse position in 3D
uniform float u_progress; // 0 to 1

attribute vec3 a_attractor;

varying vec3 v_color;
varying float v_depth;

// Color palette
const vec3 COLOR_CYAN = vec3(0.024, 0.714, 0.831);   // hsl(198, 70%, 55%)
const vec3 COLOR_VIOLET = vec3(0.659, 0.333, 0.969); // hsl(260, 70%, 65%)

void main() {
    // 1. Initial chaos position (random per particle, based on current position buffer)
    vec3 startPos = position;

    // 2. Animate from chaos to attractor shape over `u_progress`
    vec3 currentPos = mix(startPos, a_attractor, u_progress);

    // 3. Cursor repulsion
    float dist = distance(currentPos, u_pointer);
    float repulsionRadius = 1.5;

    if (dist < repulsionRadius) {
        vec3 dir = normalize(currentPos - u_pointer);
        // Force scaled by 1/d^2 (clamped to avoid infinity)
        float force = clamp(0.1 / (dist * dist + 0.01), 0.0, 1.0);
        // Fade out repulsion if progress is low so they don't jump around initially
        currentPos += dir * force * u_progress * 0.5;
    }

    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation based on depth
    gl_PointSize = (10.0 / -mvPosition.z);

    // Color mapping based on Z position of attractor
    // Lorenz Z ranges roughly 0 to 50. We mapped it to * 0.3, so 0 to 15.
    float normalizedZ = clamp(a_attractor.z / 10.0, 0.0, 1.0);
    v_color = mix(COLOR_CYAN, COLOR_VIOLET, normalizedZ);

    // For depth fog calculation in fragment shader
    v_depth = -mvPosition.z;
}
