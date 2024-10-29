use crate::translations::{English, French, German, Italian, Language, Spanish};
use tauri::menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::{Manager, Runtime};

pub fn create_menu<'a, R: Runtime, M: Manager<R>>(lang: &'a str, manager: &'a M) -> MenuBuilder<'a, R, M> {
    let translations: Box<dyn Language> = match lang {
        "de" => Box::new(German::new()),
        "en" => Box::new(English::new()),
        "es" => Box::new(Spanish::new()),
        "fr" => Box::new(French::new()),
        "it" => Box::new(Italian::new()),
        _ => Box::new(English::new()),
    };

    let window_label = translations.window();
    let close_s = MenuItemBuilder::new("quit".to_string()).build(manager).unwrap();

    let config_label = translations.config();
    let preferences_s = MenuItemBuilder::new("preferences".to_string()).build(manager).unwrap();

    let help_label = translations.help();
    let about_s = MenuItemBuilder::new("about".to_string()).build(manager).unwrap();
    let github_s = MenuItemBuilder::new("github".to_string()).build(manager).unwrap();
    let donate_s = MenuItemBuilder::new("donate".to_string()).build(manager).unwrap();

    let submenu_window = SubmenuBuilder::new(manager, window_label).build().unwrap();
    let submenu_config = SubmenuBuilder::new(manager, config_label).item(&preferences_s).build().unwrap();
    let submenu_help = SubmenuBuilder::new(manager, help_label)
        .item(&about_s)
        .item(&github_s)
        .item(&donate_s)
        .build()
        .unwrap();

    MenuBuilder::new(manager)
        .item(&close_s)
        .item(&submenu_window)
        .item(&submenu_config)
        .item(&submenu_help)
}