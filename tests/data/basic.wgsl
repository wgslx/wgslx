@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  var pos = array<vec2f, 3>(
    vec2(0.0, 0.5), // Test comment
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5)
  );
  /* Test comment */
  return vec4f(pos[VertexIndex], 0.0, 1.0);
}

@fragment
fn main() -> @location(0) vec4f {
  return vec4(1.0, 0.0, 0.0, 1.0);
}