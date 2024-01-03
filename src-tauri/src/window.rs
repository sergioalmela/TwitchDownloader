use tauri::{utils::config::WindowUrl, window::WindowBuilder, Manager};

pub fn preferences_window(handle: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        if let Some(win) = handle.get_window("preferences") {
            win.show().unwrap()
        } else {
            WindowBuilder::new(&handle, "preferences", WindowUrl::App("preferences.html".into()))
                .title("Preferences")
                .resizable(true)
                .fullscreen(false)
                .inner_size(600.0, 600.0)
                .min_inner_size(600.0, 600.0)
                .build()
                .unwrap();
        }
    });
}
