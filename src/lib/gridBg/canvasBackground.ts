import { get } from "svelte/store";
import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
import { vec2 } from "gl-matrix";
import { RipplePoint } from './ripplePoint';

const vertexSrc = `
attribute vec2 aVertexPosition;

void main() {
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}
`;
const fragSrc = `
precision highp float;

uniform float time;
uniform vec2 mouse_pos;

// Ripple points

uniform float ripple_time_1;
uniform float ripple_time_2;
uniform float ripple_time_3;
uniform float ripple_time_4;
uniform float ripple_time_5;

uniform vec2 ripple_position_1;
uniform vec2 ripple_position_2;
uniform vec2 ripple_position_3;
uniform vec2 ripple_position_4;
uniform vec2 ripple_position_5;

vec2 computeRipple(in vec2 pos, in vec2 ripple_pos, in float ripple_time) {
  const float wave_speed = 400.0;
  const float wave_length = 120.0;
  const float temporal_decay = 2.0;
  const float amplitude = 750.0;
  const float spatial_decay = 0.01;
  const float spatial_cutoff = 0.25;
  const float spatial_scale = 1.0 / (1.0 - spatial_cutoff);
  const float PI = 3.14159265359;

  float dt = (time - ripple_time) * 0.001; // Seconds

  vec2 d = pos - ripple_pos;
  float r = sqrt(d.x * d.x + d.y * d.y);

  float phase = (r - wave_speed * dt) / wave_length;
  float spatial_env = max(0.0, (1.0 / (r * spatial_decay + 1.0) - spatial_cutoff) * spatial_scale);
  float temporal_env = exp(-dt * temporal_decay);

  float wave = sin(phase * PI * 2.0) - 0.75; // Shift to ripple outwards more
  float disp = wave * amplitude * spatial_decay * temporal_env;
  
  return d * disp / r;
}


void main(void) {
  // Constants

  // Colours
  const vec4 dot_color = vec4(0.2, 0.6, 1.0, 1.0);
  const vec4 line_color = vec4(0.47 , 0.5, 0.52, 0.67); // I don't get it why is it 0.75 here
  // Grid spacings
  const float spacing = 96.0;
  const float dot_size = 2.0;
  const float line_width = 0.5;
  const float dot_prop = dot_size * dot_size / (spacing * spacing);
  const float line_prop = line_width / spacing;
  // Anti-aliasing, how fast the anti-alias edge disappears
  const float aa_rate = 1.0;
  // Distortion
  const float distortion_strength = 50.0;
  const float min_distortion = 50.0;
  const float distortion_distance = 200.0;

  
  // Mouse distort coordinates
  vec2 coord = gl_FragCoord.xy;
  vec2 d = coord - mouse_pos;
  float mouse_distance = sqrt(d.x*d.x + d.y*d.y) + min_distortion;
  float influence = max(0.0, 1.0 - mouse_distance / distortion_distance);
  
  // Distortion in px
  coord += d / mouse_distance * influence * distortion_strength;
  
  // Ripple distortions
  // (in vec2 pos, in vec2 ripple_pos, in float ripple_time)  
  coord += computeRipple(coord, ripple_position_1, ripple_time_1);
  coord += computeRipple(coord, ripple_position_2, ripple_time_2);
  coord += computeRipple(coord, ripple_position_3, ripple_time_3);
  coord += computeRipple(coord, ripple_position_4, ripple_time_4);
  coord += computeRipple(coord, ripple_position_5, ripple_time_5);

  // Normalized pixel coordinates to loop every spacing
  vec2 uv = mod(coord / spacing, 1.0) - vec2(0.5);
  
  // Draw lines
  vec2 offset_uv = mod((coord + vec2(spacing * 0.5)) / spacing, 1.0) - vec2(0.5);
  float edge_distance = max(abs(offset_uv.x), abs(offset_uv.y));
  float line_intensity = clamp(
    (edge_distance - 0.5 + (aa_rate + 1.0) * line_prop * 0.5) * 2.0 / line_prop / (aa_rate + 1.0) + 1.0,
    0.0, 1.0
  );

  gl_FragColor = line_color * line_intensity;

  // Draw dots
  float dot_distance_squared = (uv.x * uv.x + uv.y * uv.y) / dot_prop;
  float dot_intensity = clamp(1.0 - aa_rate * (dot_distance_squared - 1.0), 0.0, 1.0);
  gl_FragColor = mix(gl_FragColor, dot_color, dot_intensity);
}
`

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl!.attachShader(shaderProgram, vertexShader!);
  gl!.attachShader(shaderProgram, fragmentShader!);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram,
      )}`,
    );
    return null;
  }

  return shaderProgram;
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
function loadShader(gl: WebGLRenderingContext, type: any, source: any) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader!, source);

  // Compile the shader program

  gl.compileShader(shader!);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader!, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader!)}`,
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function setupCanvas(canvas: HTMLCanvasElement) {
  if (!canvas) return () => {};

  const ripple_point_count = 5;

  let ripplePoints: RipplePoint[] = [];
  let current_ripple_index = 0;

  // Init ripples
  for (let i = 0; i < 5; ++i) {
    ripplePoints.push(new RipplePoint());
  }

  let mousePos = vec2.create();
  let resolution = vec2.create();

  const gl = canvas.getContext('webgl');

  const shaderProgram = initShaderProgram(gl!, vertexSrc, fragSrc);
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl!.getAttribLocation(shaderProgram!, "aVertexPosition"),
    },
    uniformLocations: {
      time:  gl!.getUniformLocation(shaderProgram!, "time"),
      mouse_pos: gl!.getUniformLocation(shaderProgram!, "mouse_pos"),
      ripple_times: [
        gl!.getUniformLocation(shaderProgram!, "ripple_time_1"),
        gl!.getUniformLocation(shaderProgram!, "ripple_time_2"),
        gl!.getUniformLocation(shaderProgram!, "ripple_time_3"),
        gl!.getUniformLocation(shaderProgram!, "ripple_time_4"),
        gl!.getUniformLocation(shaderProgram!, "ripple_time_5")
      ],
      ripple_pos: [
        gl!.getUniformLocation(shaderProgram!, "ripple_position_1"),
        gl!.getUniformLocation(shaderProgram!, "ripple_position_2"),
        gl!.getUniformLocation(shaderProgram!, "ripple_position_3"),
        gl!.getUniformLocation(shaderProgram!, "ripple_position_4"),
        gl!.getUniformLocation(shaderProgram!, "ripple_position_5")
      ]
    },
  };

  const buffers = initBuffers(gl);

  function resize() {
    if (!gl) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resolution[0] = window.innerWidth;
    resolution[1] = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
  }


  // Main animation loop
  function draw() {
    if (!gl) return;

    drawScene(gl!, programInfo, buffers, mousePos, ripplePoints);

    requestAnimationFrame(draw);
  }

  resize();

  // Add event listeners
  // Resizes canvas
  window.addEventListener('resize', resize);
  // Update mouse position variable
  document.addEventListener("mousemove", (e) => {
    mousePos[0] = e.clientX;
    mousePos[1] = resolution[1] - e.clientY; // Funny inverted y axis
  });
  // Add new ripple
  document.addEventListener("click", (e) => {
    ripplePoints[current_ripple_index].ripple(e.clientX, resolution[1] - e.clientY);
    current_ripple_index = (current_ripple_index + 1) % ripple_point_count;
  });
  
  draw();

  // Cleanup function to remove event listeners when component is destroyed
  return () => {
    window.removeEventListener('resize', resize);
    document.removeEventListener("mousemove", () => {});
    document.removeEventListener("click", () => {});
  };
}
