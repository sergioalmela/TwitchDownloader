// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use download::{download_clip, download_live, download_vod};

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use serde_json::{Value, from_str};
use std::fs;

mod download;

fn create_menu(lang: &str) -> Menu {
    let file_path = format!("./locales/{}.json", lang);
    let data = match fs::read_to_string(&file_path) {
        Ok(content) => content,
        Err(err) => {
            eprintln!("Error reading file '{}': {}", file_path, err);
            return Menu::new();
        }
    };

    let translations = match from_str::<Value>(&data) {
        Ok(value) => value,
        Err(err) => {
            eprintln!("Error parsing JSON: {}", err);
            return Menu::new();
        }
    };

    let quit_label = translations["quit"].as_str().unwrap_or("Quit");
    let close_label = translations["close"].as_str().unwrap_or("Close");
    let file_label = translations["file"].as_str().unwrap_or("File");
    let hide_label = translations["hide"].as_str().unwrap_or("Hide");

    let quit = CustomMenuItem::new("quit".to_string(), quit_label);
    let close = CustomMenuItem::new("close".to_string(), close_label);
    let submenu = Submenu::new(file_label, Menu::new().add_item(quit).add_item(close));
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_item(CustomMenuItem::new("hide", hide_label))
        .add_submenu(submenu);

    menu
}

fn main() {
    let current_lang = "es";

    let menu = create_menu(current_lang);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            download_live,
            download_vod,
            download_clip
        ])
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "quit" => {
                std::process::exit(0);
            }
            "close" => {
                event.window().close().unwrap();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
