// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;

use tauri::{AppHandle, Manager};

use download::{download_clip, download_live, download_vod};
use menu::create_menu;

use crate::config::AppConf;

mod config;
mod download;
mod menu;
mod translations;
mod utils;
mod window;

pub fn open(app: &AppHandle, path: &str) {
    tauri::api::shell::open(&app.shell_scope(), path, None).unwrap();
}

fn main() {
    let app_conf = AppConf::read().write();
    let _theme = AppConf::theme_mode();

    let language = app_conf.language();

    let menu = create_menu(&language);

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
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
                let win = event.window();
                let app = win.app_handle();
                open(&app, "https://github.com/sergioalmela/TwitchDownloader");
            }
            "donate" => {
                let win = event.window();
                let app = win.app_handle();
                open(&app, "https://www.buymeacoffee.com/sergioalmela");
            }
            "about" => {
                let win = event.window();
                let app = win.app_handle();
                let tauri_conf = utils::get_tauri_conf().unwrap();
                tauri::api::dialog::message(
                    app.get_window("core").as_ref(),
                    "Twitch Downloader",
                    format!("Version {}", tauri_conf.package.version.unwrap()),
                );
            }
            "preferences" => {
                let win = event.window();
                let app = win.app_handle();

                window::cmd::control_window(app, "preferences".into());
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
