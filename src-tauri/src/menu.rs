use crate::translations::{English, French, German, Italian, Language, Spanish};
use tauri::menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::{Manager, Runtime};

pub fn create_menu<'a, R: Runtime, M: Manager<R>>(
    lang: &'a str,
    manager: &'a M,
) -> MenuBuilder<'a, R, M> {
    let translations: Box<dyn Language> = match lang {
        "de" => Box::new(German::new()),
        "en" => Box::new(English::new()),
        "es" => Box::new(Spanish::new()),
        "fr" => Box::new(French::new()),
        "it" => Box::new(Italian::new()),
        _ => Box::new(English::new()),
    };

    let close_label = translations.close();
    let close_s = MenuItemBuilder::new(close_label)
        .id("quit")
        .build(manager)
        .unwrap();

    let preferences_label = translations.preferences();
    let preferences_s = MenuItemBuilder::new(preferences_label)
        .id("preferences")
        .build(manager)
        .unwrap();

    let about_label = translations.about();
    let about_s = MenuItemBuilder::new(about_label)
        .id("about")
        .build(manager)
        .unwrap();

    let github_label = translations.github();
    let github_s = MenuItemBuilder::new(github_label)
        .id("github")
        .build(manager)
        .unwrap();

    let donate_label = translations.donate();
    let donate_s = MenuItemBuilder::new(donate_label)
        .id("donate")
        .build(manager)
        .unwrap();

    let window_label = translations.window();
    let submenu_window = SubmenuBuilder::new(manager, window_label)
        .item(&close_s)
        .build()
        .unwrap();

    let config_label = translations.config();
    let submenu_config = SubmenuBuilder::new(manager, config_label)
        .item(&preferences_s)
        .build()
        .unwrap();

    let help_label = translations.help();
    let submenu_help = SubmenuBuilder::new(manager, help_label)
        .item(&about_s)
        .item(&github_s)
        .item(&donate_s)
        .build()
        .unwrap();

    MenuBuilder::new(manager)
        .item(&submenu_window)
        .item(&submenu_config)
        .item(&submenu_help)
}
