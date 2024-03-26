// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use download::{download_clip, download_live, download_vod};

use serde_json::{from_str, Value};
use std::{env, fs};
use tauri::{AppHandle, CustomMenuItem, Manager, Menu, MenuItem, Submenu};

mod config;
mod download;
mod utils;
mod window;
mod translations;

use translations::Language;

use translations::{English, Spanish};

use crate::{
    config::AppConf,
};

fn create_menu(lang: &str) -> Menu {
    let translations: Box<dyn Language> = match lang {
        "en" => Box::new(English::new()),
        "es" => Box::new(Spanish::new()),
        _ => Box::new(English::new()),
    };

    let window_label = translations.window();
    let close_s = CustomMenuItem::new("quit".to_string(), translations.close());

    let language_label = translations.language();
    let english_s = CustomMenuItem::new(
        "english".to_string(),
        translations.english(),
    );
    let spanish_s = CustomMenuItem::new(
        "spanish".to_string(),
        translations.spanish(),
    );
    let italian_s = CustomMenuItem::new(
        "italian".to_string(),
        translations.italian()
    );
    let french_s = CustomMenuItem::new(
        "french".to_string(),
        translations.french()
    );
    let german_s = CustomMenuItem::new(
        "german".to_string(),
        translations.german()
    );
    let portuguese_s = CustomMenuItem::new(
        "portuguese".to_string(),
        translations.portuguese()
    );

    let config_label = translations.config();
    let preferences_s = CustomMenuItem::new(
        "preferences".to_string(),
        translations.preferences()
    );

    let help_label = translations.help();
    let about_s = CustomMenuItem::new(
        "about".to_string(),
       translations.about()
    );
    let github_s = CustomMenuItem::new(
        "github".to_string(),
        translations.github()
    );
    let donate_s = CustomMenuItem::new(
        "donate".to_string(),
        translations.donate()
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
    let app_conf = AppConf::read().write();
    let theme = AppConf::theme_mode();

    let language = app_conf.language();

    let menu = create_menu(&language);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            download_live,
            download_vod,
            download_clip,
            config::update_preferences,
            config::get_preferences,
            config::cmd::form_confirm,
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
