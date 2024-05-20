pub trait Language {
    fn about(&self) -> &'static str;
    fn close(&self) -> &'static str;
    fn config(&self) -> &'static str;
    fn donate(&self) -> &'static str;
    fn github(&self) -> &'static str;
    fn help(&self) -> &'static str;
    fn preferences(&self) -> &'static str;
    fn window(&self) -> &'static str;
}

pub struct Translations {
    pub about: &'static str,
    pub close: &'static str,
    pub config: &'static str,
    pub donate: &'static str,
    pub github: &'static str,
    pub help: &'static str,
    pub preferences: &'static str,
    pub window: &'static str,
}

macro_rules! define_language {
    ($name:ident, $translations:expr) => {
        pub struct $name {
            pub about: &'static str,
            pub close: &'static str,
            pub config: &'static str,
            pub donate: &'static str,
            pub github: &'static str,
            pub help: &'static str,
            pub preferences: &'static str,
            pub window: &'static str,
        }

        impl $name {
            pub fn new() -> Self {
                Self {
                    about: $translations.about,
                    close: $translations.close,
                    config: $translations.config,
                    donate: $translations.donate,
                    github: $translations.github,
                    help: $translations.help,
                    preferences: $translations.preferences,
                    window: $translations.window,
                }
            }
        }

        impl Language for $name {
            fn about(&self) -> &'static str {
                self.about
            }

            fn close(&self) -> &'static str {
                self.close
            }

            fn config(&self) -> &'static str {
                self.config
            }

            fn donate(&self) -> &'static str {
                self.donate
            }

            fn github(&self) -> &'static str {
                self.github
            }

            fn help(&self) -> &'static str {
                self.help
            }

            fn preferences(&self) -> &'static str {
                self.preferences
            }
            
            fn window(&self) -> &'static str {
                self.window
            }
        }
    };
}

define_language!(
    English,
    Translations {
        about: "About us",
        close: "Close",
        config: "Config",
        donate: "Donate",
        github: "GitHub",
        help: "Help",
        preferences: "Preferences",
        window: "Window",
    }
);

define_language!(
    Spanish,
    Translations {
        about: "Acerca de nosotros",
        close: "Cerrar",
        config: "Configuración",
        donate: "Donar",
        github: "GitHub",
        help: "Ayuda",
        preferences: "Preferencias",
        window: "Ventana",
    }
);
