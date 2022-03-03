mod utils;

use wasm_bindgen::prelude::*;

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
pub fn pass_value_to_js() -> Result<JsValue, JsValue> {
	let some_supported_rust_value: (&str, i32) = ("Hello, world!", 42);
	let js_value = serde_wasm_bindgen::to_value(&some_supported_rust_value)?;

	Ok(js_value)
}

#[wasm_bindgen]
pub fn get_image(width: usize, height: usize) -> Result<JsValue, JsValue> {
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
export function get_image(width: number, height: number): [number, number, number][][]
"#;
