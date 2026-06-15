varying vec3 v_color;
varying float v_depth;

void main() {
    // Make particles circular
    vec2 coord = gl_PointCoord - vec2(0.5);
    if(length(coord) > 0.5) discard;

    // Soft particle edge
    float alpha = 1.0 - smoothstep(0.3, 0.5, length(coord));

    // Depth fog
    // Fog starts fading at distance 2.0, fully faded at 10.0
    float fogFactor = smoothstep(2.0, 10.0, v_depth);
    alpha *= (1.0 - fogFactor * 0.8); // never fully invisible, down to 20%

    gl_FragColor = vec4(v_color, alpha);
}
