use tauri::{AppHandle, Manager};
use tauri_plugin_shell::open::open;
mod config;
mod utils;
mod window;
mod download;
mod menu;
use crate::download::{download_live, download_vod, download_clip};
use crate::menu::create_menu;

fn main() {
    let app = tauri::Builder::default()
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    let app_conf = config::AppConf::read(&app).write(&app);
    let _theme = config::AppConf::theme_mode(&app);

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
        .on_menu_event(|event, _| match event.menu_item_id() {
            "quit" => {
                std::process::exit(0);
            }
            "github" => {
                let win = event.window();
                let app = win.app_handle();
                open(&app, "https://github.com/sergioalmela/TwitchDownloader", None);
            }
            "donate" => {
                let win = event.window();
                let app = win.app_handle();
                open(&app, "https://www.buymeacoffee.com/sergioalmela", None);
            }
            "about" => {
                let win = event.window();
                let app = win.app_handle();
                let tauri_conf = utils::get_tauri_conf().unwrap();
                app.dialog().message(format!("Version {}", tauri_conf.version.unwrap())).show();
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