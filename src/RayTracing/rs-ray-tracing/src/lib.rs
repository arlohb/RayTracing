mod utils;

use wasm_bindgen::{prelude::*, JsCast, Clamped};

mod vec3;
pub use crate::vec3::Vec3;

mod camera;
pub use crate::camera::{Camera, ImagePlane};

mod ray;
pub use crate::ray::Ray;

mod sphere;
pub use crate::sphere::Sphere;

mod solver;

const BACKGROUND_COLOUR: (u8, u8, u8) = (127, 200, 255);

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
    pub fn log(s: &str);
}

#[macro_export]
macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

pub fn draw_image(image: Clamped<&[u8]>, width: u32, height: u32) -> Result<(), Box<dyn std::error::Error>> {
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
    
    let new_data = web_sys::ImageData::new_with_u8_clamped_array_and_sh(image, width, height)
        .map_err(|_| "New data failed")?;
    
    context.put_image_data(&new_data, 0., 0.).map_err(|_| "Image put failed")?;

    Ok(())
}

fn trace_ray(
    ray: &Ray,
    scene: &Vec<Sphere>,
) -> Option<(Sphere, Vec3)> {
    let mut min_hit_distance = 1e9;
    let mut min_hit_object: Option<&Sphere> = None;

    for object in scene {
        let distance = match object.intersect(&ray) {
            Some(d) => d,
            None => continue
        };

        if distance < min_hit_distance {
            min_hit_distance = distance;
            min_hit_object = Some(object);
        }
    }

    match min_hit_object {
        Some(object) => {
            let hit_point = ray.origin + (ray.direction * min_hit_distance);

            Some((*object, hit_point))
        }
        None => None
    }
}

fn render_pixel(
    x: u32,
    y: u32,
    top_left: Vec3,
    width_world_space: f64,
    height_world_space: f64,
    right: Vec3,
    up: Vec3,
    width: u32,
    height: u32,
    camera: &Camera,
    scene: &Vec<Sphere>,
) -> (u8, u8, u8) {
    let x_screen_space = (x as f64 + 0.5) / width as f64;
    let y_screen_space = (y as f64 + 0.5) / height as f64;

    let x_offset = right * (x_screen_space * width_world_space);
    // mul -1 because it's offset down
    let y_offset = (-up) * (y_screen_space * height_world_space);

    let pixel_world_space = top_left + x_offset + y_offset;

    let direction = (pixel_world_space - camera.from).normalize();

    let ray = Ray {
        origin: camera.from,
        direction
    };

    match trace_ray(&ray, scene) {
        Some((object, hit_point)) => {
            let normal = object.normal_at_point(hit_point);

            let (_, _, forward) = camera.get_vectors();

            // normal length can be left out as it will always be 1
            let angle = (forward.dot(normal) / forward.length()).acos();

            let brightness = 1. - (angle / std::f64::consts::PI);
            (
                (brightness * object.colour.0 as f64) as u8,
                (brightness * object.colour.1 as f64) as u8,
                (brightness * object.colour.2 as f64) as u8
            )
        },
        None => BACKGROUND_COLOUR
    }
}

#[wasm_bindgen]
pub fn rs_render(
    from: JsValue, // (f64, f64, f64),
    to: JsValue, // (f64, f64, f64),
    fov: f64,
    width: u32,
    height: u32,
    scene: JsValue, // Vec<((f64, f64, f64), f64, (u8, u8, u8))>,
) -> Result<(), JsValue> {
    let from: (f64, f64, f64) = serde_wasm_bindgen::from_value(from)?;
    let from = Vec3 { x: from.0, y: from.1, z: from.2 };
    let to: (f64, f64, f64) = serde_wasm_bindgen::from_value(to)?;
    let to = Vec3 { x: to.0, y: to.1, z: to.2 };
    let scene: Vec<((f64, f64, f64), f64, (u8, u8, u8))> = serde_wasm_bindgen::from_value(scene)?;

    let scene: Vec<Sphere> = {
        let mut objects: Vec<Sphere> = vec![];
        for object in scene {
            objects.push(Sphere {
                center: Vec3 { x: object.0.0, y: object.0.1, z: object.0.2 },
                radius: object.1,
                colour: object.2,
            });
        }
        objects
    };

    let camera = Camera {
        from,
        to,
        fov,
        width,
        height,
    };

    let image_plane = camera.get_image_plane();

    // working for this in whiteboard
    let top_left_point = image_plane.left + image_plane.top - image_plane.center;

    let width_world_space = (image_plane.right - image_plane.left).length();
    let height_world_space = (image_plane.top - image_plane.bottom).length();
    let (right, up, _) = camera.get_vectors();
    
    let data = web_sys::ImageData::new_with_sw(width as u32, height as u32)
        .map_err(|_| "Image creation failed")?;
    
    let mut image = data.data();

    for x in 0..width {
        for y in 0..height {
            let pixel = render_pixel(x, y, top_left_point, width_world_space, height_world_space, right, up, width, height, &camera, &scene);

            let index = 4 * (x + (y * width)) as usize;
            image[index] = pixel.0;
            image[index + 1] = pixel.1;
            image[index + 2] = pixel.2;
            image[index + 3] = 255;
        }
    }

    let image = Clamped(&image as &[u8]);

    draw_image(image, width, height)
        .map_err(|e| e.to_string())?;

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
        [number, number, number], // colour
    ][],
): void
"#;
