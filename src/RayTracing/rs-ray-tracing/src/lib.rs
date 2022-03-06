mod utils;

use wasm_bindgen::{prelude::*, JsCast, Clamped};

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

fn draw_image(width: usize, height: usize) -> Result<(), Box<dyn std::error::Error>> {
    let document = web_sys::window().ok_or("No window")?
        .document()
        .ok_or("No document")?;
    let canvas = document
        .get_element_by_id("canvas")
        .ok_or("No canvas")?
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .unwrap();
    let context = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap();
    
    let data = web_sys::ImageData::new_with_sw(width as u32, height as u32)
        .map_err(|_| "Image creation failed")?;
    
    let mut image = data.data();

    for x in 0..width {
        for y in 0..height {
            let index = 4 * (x + (y * width));
            let random = (js_sys::Math::random() * 255.) as u8;
            image[index] = random;
            image[index + 3] = 255;
        }
    }

    let image = Clamped(&image as &[u8]);

    let new_data = web_sys::ImageData::new_with_u8_clamped_array_and_sh(image, width as u32, height as u32)
        .map_err(|_| "New data failed")?;
    
    context.put_image_data(&new_data, 0., 0.).map_err(|_| "Image put failed")?;

    Ok(())
}

#[wasm_bindgen]
pub fn rs_render(
    from: JsValue, // (f64, f64, f64),
    to: JsValue, // (f64, f64, f64),
    fov: u32,
    width: usize,
    height: usize,
    scene: JsValue, // Vec<((f64, f64, f64), f64)>,
) -> Result<(), JsValue> {
    let from: (f64, f64, f64) = serde_wasm_bindgen::from_value(from)?;
    let to: (f64, f64, f64) = serde_wasm_bindgen::from_value(to)?;
    let scene: Vec<((f64, f64, f64), f64)>;

    match draw_image(width, height) {
        Ok(()) => (),
        Err(e) => console_log!("{}", e.to_string()),
    }

    Ok(())
}

#[wasm_bindgen(typescript_custom_section)]
const _TS: &str = r#"
// HEY PARSER, SPLIT IT HERE!
export function greet(): void;
export function pass_value_to_js(): [string, number];
export function rs_render(
    from: [number, number, number],
    to: [number, number, number],
    fov: number,
    width: number,
    height: number,
    scene: [
        [number, number, number], // center
        number, // radius
    ][],
): void
"#;
