use std::{collections::BTreeMap, path::PathBuf};

use log::{error, info};
use serde_json::Value;
use tauri::{Theme};
use tauri::AppHandle;

use crate::utils::{app_root, create_file, exists};

pub const APP_CONF_PATH: &str = "twitch-downloader.conf.json";

#[tauri::command]
pub fn update_preferences(_app: AppHandle, data: serde_json::Value) {
    AppConf::read().amend(serde_json::json!(data)).write();
}

#[tauri::command]
pub fn get_preferences() -> AppConf {
    AppConf::read()
}

macro_rules! pub_struct {
  ($name:ident {$($field:ident: $t:ty,)*}) => {
    #[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
    pub struct $name {
      $(pub $field: $t),*
    }
  }
}

pub_struct!(AppConf {
    theme: String,
    language: String,
    download_folder: String,
    open_on_download: String,
});

impl AppConf {
    pub fn new() -> Self {
        Self {
            theme: "light".into(),
            language: "en".into(),
            download_folder: "".into(),
            open_on_download: "open".into(),
        }
    }

    pub fn file_path() -> PathBuf {
        app_root().join(APP_CONF_PATH)
    }

    pub fn read() -> Self {
        match std::fs::read_to_string(Self::file_path()) {
            Ok(v) => {
                if let Ok(v2) = serde_json::from_str::<AppConf>(&v) {
                    v2
                } else {
                    error!("conf_read_parse_error");
                    Self::default()
                }
            }
            Err(err) => {
                error!("conf_read_error: {}", err);
                Self::default()
            }
        }
    }

    pub fn write(self) -> Self {
        let path = &Self::file_path();
        if !exists(path) {
            create_file(path).unwrap();
            info!("conf_create");
        }
        if let Ok(v) = serde_json::to_string_pretty(&self) {
            std::fs::write(path, v).unwrap_or_else(|err| {
                error!("conf_write: {}", err);
                Self::default().write();
            });
        } else {
            error!("conf_ser");
        }
        self
    }

    pub fn amend(self, json: Value) -> Self {
        let val = serde_json::to_value(&self).unwrap();
        let mut config: BTreeMap<String, Value> = serde_json::from_value(val).unwrap();
        let new_json: BTreeMap<String, Value> = serde_json::from_value(json).unwrap();

        for (k, v) in new_json {
            config.insert(k, v);
        }

        match serde_json::to_string_pretty(&config) {
            Ok(v) => match serde_json::from_str::<AppConf>(&v) {
                Ok(v) => v,
                Err(err) => {
                    error!("conf_amend_parse: {}", err);
                    self
                }
            },
            Err(err) => {
                error!("conf_amend_str: {}", err);
                self
            }
        }
    }

    pub fn language(&self) -> String {
        self.language.to_lowercase()
    }

    pub fn theme_mode() -> Theme {
        match Self::get_theme().as_str() {
            "system" => match dark_light::detect() {
                dark_light::Mode::Dark => Theme::Dark,
                dark_light::Mode::Light => Theme::Light,
                dark_light::Mode::Default => Theme::Light,
            },
            "dark" => Theme::Dark,
            _ => Theme::Light,
        }
    }

    pub fn get_theme() -> String {
        Self::read().theme.to_lowercase()
    }
}

impl Default for AppConf {
    fn default() -> Self {
        Self::new()
    }
}

pub mod cmd {
    use tauri::{AppHandle, command};

    use super::AppConf;

    #[command]
    pub fn form_confirm(_app: AppHandle, data: serde_json::Value) {
        AppConf::read().amend(serde_json::json!(data)).write();
    }
}
