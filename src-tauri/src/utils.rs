use anyhow::Result;
use std::{
    fs,
    path::{Path, PathBuf},
};
use tauri::utils::config::Config;

pub fn get_tauri_conf() -> Option<Config> {
    let config_file = include_str!("../tauri.conf.json");
    let config: Config =
        serde_json::from_str(config_file).expect("failed to parse tauri.conf.json");
    Some(config)
}

pub fn app_root() -> PathBuf {
    dirs::home_dir().unwrap().join(".twitch-downloader")
}

pub fn exists(path: &Path) -> bool {
    path.exists()
}

pub fn create_file<P: AsRef<Path>>(filename: P) -> Result<()> {
    let filename = filename.as_ref();
    if let Some(parent) = filename.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent)?;
        }
    }
    fs::File::create(filename)?;
    Ok(())
}
