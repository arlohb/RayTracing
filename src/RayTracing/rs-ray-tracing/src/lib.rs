mod utils;

use wasm_bindgen::prelude::*;
use web_sys::console;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("This is a new message!!!");
}

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn get_image(
    from: JsValue, // (f64, f64, f64),
    to: JsValue, // (f64, f64, f64),
    fov: u32,
    width: usize,
    height: usize,
    scene: JsValue, // Vec<((f64, f64, f64), f64)>,
) -> Result<JsValue, JsValue> {
    let from: (f64, f64, f64) = serde_wasm_bindgen::from_value(from)?;
    let to: (f64, f64, f64) = serde_wasm_bindgen::from_value(to)?;
    let scene: Vec<((f64, f64, f64), f64)>;

    // console_log!("Hello {}", "Arlo");

    let grey: (u8, u8, u8) = (127, 127, 127);
    let image: Vec<Vec<(u8, u8, u8)>> = vec![vec![grey; height]; width];

    let js_value = serde_wasm_bindgen::to_value(&image)?;
    Ok(js_value)
}

#[wasm_bindgen(typescript_custom_section)]
const _TS: &str = r#"
// HEY PARSER, SPLIT IT HERE!
export function greet(): void;
export function pass_value_to_js(): [string, number];
export function get_image(
    from: [number, number, number],
    to: [number, number, number],
    fov: number,
    width: number,
    height: number,
    scene: [
        [number, number, number], // center
        number, // radius
    ][],
): [number, number, number][][]
"#;
