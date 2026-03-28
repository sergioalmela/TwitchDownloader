use std::{collections::BTreeMap, path::PathBuf};

use log::{error, info};
use serde_json::Value;
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

#[derive(serde::Serialize, serde::Deserialize, Debug, Clone)]
pub struct AppConf {
    pub theme: String,
    pub language: String,
    pub download_folder: String,
    pub open_on_download: String,
}

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
            if let Err(err) = std::fs::write(path, v) {
                error!("conf_write: {}", err);
            }
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
}

impl Default for AppConf {
    fn default() -> Self {
        Self::new()
    }
}
