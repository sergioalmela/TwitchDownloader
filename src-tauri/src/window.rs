use tauri::{utils::config::WindowUrl, window::WindowBuilder, Manager};

pub fn preferences_window(handle: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        if let Some(win) = handle.get_window("preferences") {
            win.show().unwrap()
        } else {
            WindowBuilder::new(
                &handle,
                "preferences",
                WindowUrl::App("preferences.html".into()),
            )
                .title("Preferences")
                .resizable(true)
                .fullscreen(false)
                .inner_size(900.0, 600.0)
                .min_inner_size(600.0, 600.0)
                .build()
                .unwrap();
        }
    });
}

pub mod cmd {
    use super::*;
    use tauri::{utils::config::WindowUrl, window::WindowBuilder, Manager};

    #[tauri::command]
    pub fn control_window(handle: tauri::AppHandle, win_type: String) {
        tauri::async_runtime::spawn(async move {
            if handle.get_window("preferences").is_none() {
                WindowBuilder::new(
                    &handle,
                    "preferences",
                    WindowUrl::App(format!("index.html?type={}", win_type).into()),
                )
                    .title("Preferences")
                    .resizable(true)
                    .fullscreen(false)
                    .inner_size(900.0, 600.0)
                    .min_inner_size(600.0, 600.0)
                    .build()
                    .unwrap();
            } else {
                let main_win = handle.get_window("preferences").unwrap();
                main_win.show().unwrap();
                main_win.set_focus().unwrap();
            }
        });
    }
}