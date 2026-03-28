#[allow(dead_code)]
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

define_language!(
    German,
    Translations {
        about: "Über uns",
        close: "Schließen",
        config: "Konfiguration",
        donate: "Spenden",
        github: "GitHub",
        help: "Hilfe",
        preferences: "Einstellungen",
        window: "Fenster",
    }
);

define_language!(
    French,
    Translations {
        about: "À propos de nous",
        close: "Fermer",
        config: "Configuration",
        donate: "Faire un don",
        github: "GitHub",
        help: "Aide",
        preferences: "Préférences",
        window: "Fenêtre",
    }
);

define_language!(
    Italian,
    Translations {
        about: "Riguardo a noi",
        close: "Chiudi",
        config: "Configurazione",
        donate: "Donare",
        github: "GitHub",
        help: "Aiuto",
        preferences: "Preferenze",
        window: "Finestra",
    }
);

define_language!(
    Portuguese,
    Translations {
        about: "Sobre nós",
        close: "Fechar",
        config: "Configuração",
        donate: "Doar",
        github: "GitHub",
        help: "Ajuda",
        preferences: "Preferências",
        window: "Janela",
    }
);

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn all_languages_implement_trait() {
        let languages: Vec<Box<dyn Language>> = vec![
            Box::new(English::new()),
            Box::new(Spanish::new()),
            Box::new(German::new()),
            Box::new(French::new()),
            Box::new(Italian::new()),
        ];

        for lang in &languages {
            assert!(!lang.about().is_empty());
            assert!(!lang.close().is_empty());
            assert!(!lang.config().is_empty());
            assert!(!lang.donate().is_empty());
            assert!(!lang.github().is_empty());
            assert!(!lang.help().is_empty());
            assert!(!lang.preferences().is_empty());
            assert!(!lang.window().is_empty());
        }
    }

    #[test]
    fn github_is_same_across_languages() {
        assert_eq!(English::new().github(), "GitHub");
        assert_eq!(Spanish::new().github(), "GitHub");
        assert_eq!(German::new().github(), "GitHub");
        assert_eq!(French::new().github(), "GitHub");
        assert_eq!(Italian::new().github(), "GitHub");
    }

    #[test]
    fn english_has_expected_values() {
        let en = English::new();
        assert_eq!(en.about(), "About us");
        assert_eq!(en.close(), "Close");
        assert_eq!(en.help(), "Help");
        assert_eq!(en.window(), "Window");
    }
}
