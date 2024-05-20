use crate::translations::{English, French, German, Italian, Language, Spanish};
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

pub fn create_menu(lang: &str) -> Menu {
    let translations: Box<dyn Language> = match lang {
        "de" => Box::new(German::new()),
        "en" => Box::new(English::new()),
        "es" => Box::new(Spanish::new()),
        "fr" => Box::new(French::new()),
        "it" => Box::new(Italian::new()),
        _ => Box::new(English::new()),
    };

    let window_label = translations.window();
    let close_s = CustomMenuItem::new("quit".to_string(), translations.close());

    let config_label = translations.config();
    let preferences_s = CustomMenuItem::new("preferences".to_string(), translations.preferences());

    let help_label = translations.help();
    let about_s = CustomMenuItem::new("about".to_string(), translations.about());
    let github_s = CustomMenuItem::new("github".to_string(), translations.github());
    let donate_s = CustomMenuItem::new("donate".to_string(), translations.donate());

    let submenu_window = Submenu::new(window_label, Menu::new().add_item(close_s));

    Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_submenu(submenu_window)
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
        ))
}
