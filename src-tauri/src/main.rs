use tauri::Manager;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_shell::ShellExt;

mod config;
mod download;
mod menu;
mod translations;
mod utils;
mod window;

use crate::download::{download_clip, download_live, download_vod};
use crate::menu::create_menu;

fn main() {
    let app_conf = config::AppConf::read().write();

    let language = app_conf.language();
    let language_clone = language.clone();

    tauri::Builder::default()
        .setup(move |app| {
            app.manage(language.clone());

            Ok(())
        })
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
        .menu(move |app_handle| {
            let menu_builder = create_menu(&language_clone, app_handle);
            let menu = menu_builder.build().expect("Failed to build menu");
            Ok(menu)
        })
        .on_menu_event(|app_handle, event| match event.id.as_ref() {
            "quit" => {
                std::process::exit(0);
            }
            "github" => {
                let _ = app_handle
                    .shell()
                    .open("https://github.com/sergioalmela/TwitchDownloader", None);
            }
            "donate" => {
                let _ = app_handle
                    .shell()
                    .open("https://www.buymeacoffee.com/sergioalmela", None);
            }
            "about" => {
                let tauri_conf = utils::get_tauri_conf().unwrap();
                app_handle
                    .dialog()
                    .message(format!("Version {}", tauri_conf.version.unwrap()))
                    .show(|_| {});
            }
            "preferences" => {
                window::cmd::control_window(app_handle.clone(), "preferences".into());
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
