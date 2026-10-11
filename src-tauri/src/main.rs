use tauri::Manager;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;

mod config;
mod download;
mod menu;
mod playlist;
mod translations;
mod utils;
mod window;

use crate::download::{
    cancel_download, download_clip, download_live, download_vod, ActiveDownload,
};
use crate::menu::create_menu;

#[tauri::command]
fn rebuild_menu(app: tauri::AppHandle, language: String) -> Result<(), String> {
    let menu_builder = create_menu(&language, &app);
    let menu = menu_builder.build().map_err(|e| e.to_string())?;
    app.set_menu(menu).map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    let app_conf = config::AppConf::read().write();

    let language = app_conf.language();
    let language_clone = language.clone();

    tauri::Builder::default()
        .setup(move |app| {
            app.manage(language.clone());

            Ok(())
        })
        .manage(ActiveDownload::default())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            download_live,
            download_vod,
            download_clip,
            cancel_download,
            config::update_preferences,
            config::get_preferences,
            rebuild_menu,
        ])
        .menu(move |app_handle| {
            let menu_builder = create_menu(&language_clone, app_handle);
            let menu = menu_builder.build().expect("Failed to build menu");
            Ok(menu)
        })
        .on_menu_event(|app_handle, event| match event.id.as_ref() {
            "quit" => {
                app_handle.exit(0);
            }
            "github" => {
                let _ = app_handle.opener().open_url(
                    "https://github.com/sergioalmela/TwitchDownloader",
                    None::<&str>,
                );
            }
            "donate" => {
                let _ = app_handle
                    .opener()
                    .open_url("https://www.buymeacoffee.com/sergioalmela", None::<&str>);
            }
            "about" => {
                let tauri_conf = utils::get_tauri_conf();
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
