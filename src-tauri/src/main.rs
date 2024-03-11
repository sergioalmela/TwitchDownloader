// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use download::{download_clip, download_live, download_vod};

use serde_json::{from_str, Value};
use std::fs;
use tauri::{AppHandle, CustomMenuItem, Manager, Menu, MenuItem, Submenu};

mod config;
mod download;
mod utils;
mod window;

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

    let window_label = translations["window"].as_str().unwrap_or("Window");
    let close_s = CustomMenuItem::new(
        "quit".to_string(),
        translations["close"].as_str().unwrap_or("Close"),
    );

    let language_label = translations["language"].as_str().unwrap_or("Language");
    let english_s = CustomMenuItem::new(
        "english".to_string(),
        translations["english"].as_str().unwrap_or("English"),
    );
    let spanish_s = CustomMenuItem::new(
        "spanish".to_string(),
        translations["spanish"].as_str().unwrap_or("Spanish"),
    );
    let italian_s = CustomMenuItem::new(
        "italian".to_string(),
        translations["italian"].as_str().unwrap_or("Italian"),
    );
    let french_s = CustomMenuItem::new(
        "french".to_string(),
        translations["french"].as_str().unwrap_or("French"),
    );
    let german_s = CustomMenuItem::new(
        "german".to_string(),
        translations["german"].as_str().unwrap_or("German"),
    );
    let portuguese_s = CustomMenuItem::new(
        "portuguese".to_string(),
        translations["portuguese"].as_str().unwrap_or("Portuguese"),
    );

    let config_label = translations["config"].as_str().unwrap_or("Config");
    let preferences_s = CustomMenuItem::new(
        "preferences".to_string(),
        translations["preferences"]
            .as_str()
            .unwrap_or("Preferences"),
    );

    let help_label = translations["help"].as_str().unwrap_or("Help");
    let about_s = CustomMenuItem::new(
        "about".to_string(),
        translations["about"].as_str().unwrap_or("About"),
    );
    let github_s = CustomMenuItem::new(
        "github".to_string(),
        translations["github"].as_str().unwrap_or("GitHub"),
    );
    let donate_s = CustomMenuItem::new(
        "donate".to_string(),
        translations["donate"].as_str().unwrap_or("Donate"),
    );

    let submenu_window = Submenu::new(window_label, Menu::new().add_item(close_s));
    let submenu_language = Submenu::new(
        language_label,
        Menu::new()
            .add_item(english_s)
            .add_item(spanish_s)
            .add_item(italian_s)
            .add_item(french_s)
            .add_item(german_s)
            .add_item(portuguese_s),
    );
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_submenu(submenu_window)
        .add_submenu(submenu_language)
        .add_submenu(Submenu::new(
            config_label,
            Menu::new().add_item(preferences_s),
        ))
        .add_submenu(Submenu::new(
            help_label,
            Menu::new()
                .add_item(about_s)
                .add_item(github_s)
                .add_item(donate_s),
        ));

    menu
}

pub fn open(app: &AppHandle, path: &str) {
    tauri::api::shell::open(&app.shell_scope(), path, None).unwrap();
}

fn main() {
    let current_lang = "es";

    let menu = create_menu(current_lang);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            download_live,
            download_vod,
            download_clip,
            config::update_preferences
        ])
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "quit" => {
                std::process::exit(0);
            }
            "github" => {
                let win = Some(event.window()).unwrap();
                let app = win.app_handle();
                open(&app, "https://github.com/sergioalmela/TwitchDownloader");
            }
            "donate" => {
                let win = Some(event.window()).unwrap();
                let app = win.app_handle();
                open(&app, "https://www.buymeacoffee.com/sergioalmela");
            }
            "about" => {
                let win = Some(event.window()).unwrap();
                let app = win.app_handle();
                let tauri_conf = utils::get_tauri_conf().unwrap();
                tauri::api::dialog::message(
                    app.get_window("core").as_ref(),
                    "Twitch Downloader",
                    format!("Version {}", tauri_conf.package.version.unwrap()),
                );
            }
            "preferences" => {
                let win = Some(event.window()).unwrap();
                let app = win.app_handle();
                window::preferences_window(app.clone());
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
