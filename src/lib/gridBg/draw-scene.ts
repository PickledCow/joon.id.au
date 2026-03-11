import { vec2 } from 'gl-matrix'
import { RipplePoint } from './ripplePoint';

function drawScene(gl: WebGLRenderingContext, programInfo: any, buffers: any, mouse_pos: vec2, ripples: RipplePoint[]) {
  // Clear the canvas before we start drawing on it.
  gl.clearColor(0.0, 0.0, 0.0, 0.0); // Clear to transparent
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute(gl, buffers, programInfo);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Update mouse position uniform
  gl.uniform2fv(
    programInfo.uniformLocations.mouse_pos,
    mouse_pos
  );
  // Update time uniform
  gl.uniform1f(
    programInfo.uniformLocations.time,
    performance.now()   
  )
  // Update ripple uniforms
  for (let i = 0; i < 5; ++i) {
    gl.uniform1f(
      programInfo.uniformLocations.ripple_times[i],
      ripples[i].startTime
    )
    gl.uniform2fv(
      programInfo.uniformLocations.ripple_pos[i],
      [ripples[i].x, ripples[i].y]
    )
  }

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl: WebGLRenderingContext, buffers: any, programInfo: any) {
  const numComponents = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

export { drawScene };