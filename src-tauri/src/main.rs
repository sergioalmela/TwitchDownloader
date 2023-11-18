// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn download(m3u8: &str) {
    let mut child = std::process::Command::new("ffmpeg")
        .args(&[
            "-i",
            m3u8,
            "-y",
            "-c",
            "copy",
            "-bsf:a",
            "aac_adtstoasc",
            "/home/torre/Descargas/output.mp4",
        ])
        .spawn()
        .expect("failed to execute process");
    let ecode = child.wait().expect("failed to wait on child");
    println!("ecode: {}", ecode);
}

fn main() {
    // here `"quit".to_string()` defines the menu item id, and the second parameter is the menu item label.
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_item(CustomMenuItem::new("hide", "Hide"))
        .add_submenu(submenu);
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, download])
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "quit" => {
                    std::process::exit(0);
                }
                "close" => {
                    event.window().close().unwrap();
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
