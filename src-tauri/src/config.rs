use tauri::AppHandle;
use std::{collections::BTreeMap, path::PathBuf};
use crate::utils::{app_root, create_file, exists};
use log::{error, info};
use serde_json::Value;
use tauri::{Manager, Theme};

pub const APP_CONF_PATH: &str = "twitch-downloader.conf.json";

#[tauri::command]
pub fn update_preferences(_app: AppHandle, data: serde_json::Value) {
    println!("Preferences updated with: {:?}", data);
    AppConf::read().amend(serde_json::json!(data)).write();
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
  auto_update: String,

  main_width: f64,
  main_height: f64,
});

impl AppConf {
    pub fn new() -> Self {
        Self {
            theme: "light".into(),
            auto_update: "prompt".into(),
            main_width: 800.0,
            main_height: 600.0,
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

    pub fn get_auto_update(self) -> String {
        self.auto_update.to_lowercase()
    }

    pub fn theme_check(self, mode: &str) -> bool {
        self.theme.to_lowercase() == mode
    }

    pub fn restart(self, app: tauri::AppHandle) {
        tauri::api::process::restart(&app.env());
    }
}

impl Default for AppConf {
    fn default() -> Self {
        Self::new()
    }
}
