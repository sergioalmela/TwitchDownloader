pub mod cmd {
    use tauri::{utils::config::WebviewUrl, WebviewWindowBuilder};

    #[tauri::command]
    pub fn control_window(handle: tauri::AppHandle, win_type: String) {
        tauri::async_runtime::spawn(async move {
            if handle.get_window("preferences").is_none() {
                WebviewWindowBuilder::new(
                    &handle,
                    "preferences",
                    WebviewUrl::App(format!("index.html?type={}", win_type).into()),
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
