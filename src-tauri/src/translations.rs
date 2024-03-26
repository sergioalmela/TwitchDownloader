pub trait Language {
    fn about(&self) -> &'static str;
    fn close(&self) -> &'static str;
    fn config(&self) -> &'static str;
    fn donate(&self) -> &'static str;
    fn english(&self) -> &'static str;
    fn french(&self) -> &'static str;
    fn german(&self) -> &'static str;
    fn github(&self) -> &'static str;
    fn help(&self) -> &'static str;
    fn italian(&self) -> &'static str;
    fn language(&self) -> &'static str;
    fn portuguese(&self) -> &'static str;
    fn preferences(&self) -> &'static str;
    fn spanish(&self) -> &'static str;
    fn window(&self) -> &'static str;
}

pub struct Translations {
    pub about: &'static str,
    pub close: &'static str,
    pub config: &'static str,
    pub donate: &'static str,
    pub english: &'static str,
    pub french: &'static str,
    pub german: &'static str,
    pub github: &'static str,
    pub help: &'static str,
    pub italian: &'static str,
    pub language: &'static str,
    pub portuguese: &'static str,
    pub preferences: &'static str,
    pub spanish: &'static str,
    pub window: &'static str,
}

macro_rules! define_language {
    ($name:ident, $translations:expr) => {
        pub struct $name {
            pub about: &'static str,
            pub close: &'static str,
            pub config: &'static str,
            pub donate: &'static str,
            pub english: &'static str,
            pub french: &'static str,
            pub german: &'static str,
            pub github: &'static str,
            pub help: &'static str,
            pub italian: &'static str,
            pub language: &'static str,
            pub portuguese: &'static str,
            pub preferences: &'static str,
            pub spanish: &'static str,
            pub window: &'static str,
        }

        impl $name {
            pub fn new() -> Self {
                Self {
                    about: $translations.about,
                    close: $translations.close,
                    config: $translations.config,
                    donate: $translations.donate,
                    english: $translations.english,
                    french: $translations.french,
                    german: $translations.german,
                    github: $translations.github,
                    help: $translations.help,
                    italian: $translations.italian,
                    language: $translations.language,
                    portuguese: $translations.portuguese,
                    preferences: $translations.preferences,
                    spanish: $translations.spanish,
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

            fn english(&self) -> &'static str {
                self.english
            }

            fn french(&self) -> &'static str {
                self.french
            }

            fn german(&self) -> &'static str {
                self.german
            }

            fn github(&self) -> &'static str {
                self.github
            }

            fn help(&self) -> &'static str {
                self.help
            }

            fn italian(&self) -> &'static str {
                self.italian
            }

            fn language(&self) -> &'static str {
                self.language
            }

            fn portuguese(&self) -> &'static str {
                self.portuguese
            }

            fn preferences(&self) -> &'static str {
                self.preferences
            }

            fn spanish(&self) -> &'static str {
                self.spanish
            }

            fn window(&self) -> &'static str {
                self.window
            }
        }
    };
}

define_language!(English, Translations {
    about: "About us",
    close: "Close",
    config: "Config",
    donate: "Donate",
    english: "English",
    french: "French",
    german: "German",
    github: "GitHub",
    help: "Help",
    italian: "Italian",
    language: "Language",
    portuguese: "Portuguese",
    preferences: "Preferences",
    spanish: "Spanish",
    window: "Window",
});

define_language!(Spanish, Translations {
    about: "Acerca de nosotros",
    close: "Cerrar",
    config: "Configuración",
    donate: "Donar",
    english: "Inglés",
    french: "Francés",
    german: "Alemán",
    github: "GitHub",
    help: "Ayuda",
    italian: "Italiano",
    language: "Idioma",
    portuguese: "Portugués",
    preferences: "Preferencias",
    spanish: "Español",
    window: "Ventana",
});