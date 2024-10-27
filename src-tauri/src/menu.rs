use crate::translations::{English, French, German, Italian, Language, Spanish};
use tauri::menu::MenuBuilder;
use tauri::menu::MenuItemBuilder;
use tauri::menu::PredefinedMenuItem;
use tauri::menu::SubmenuBuilder;

pub fn create_menu(lang: &str) -> MenuBuilder {
    let translations: Box<dyn Language> = match lang {
        "de" => Box::new(German::new()),
        "en" => Box::new(English::new()),
        "es" => Box::new(Spanish::new()),
        "fr" => Box::new(French::new()),
        "it" => Box::new(Italian::new()),
        _ => Box::new(English::new()),
    };

    let window_label = translations.window();
    let close_s = MenuItemBuilder::new("quit".to_string(), translations.close());

    let config_label = translations.config();
    let preferences_s = MenuItemBuilder::new("preferences".to_string(), translations.preferences());

    let help_label = translations.help();
    let about_s = MenuItemBuilder::new("about".to_string(), translations.about());
    let github_s = MenuItemBuilder::new("github".to_string(), translations.github());
    let donate_s = MenuItemBuilder::new("donate".to_string(), translations.donate());

    let submenu_window = SubmenuBuilder::new(window_label, MenuBuilder::new().add_item(close_s));

    MenuBuilder::new()
        .add_native_item(PredefinedMenuItem::Copy)
        .add_submenu(submenu_window)
        .add_submenu(SubmenuBuilder::new(
            config_label,
            MenuBuilder::new().add_item(preferences_s),
        ))
        .add_submenu(SubmenuBuilder::new(
            help_label,
            MenuBuilder::new()
                .add_item(about_s)
                .add_item(github_s)
                .add_item(donate_s),
        ))
}
