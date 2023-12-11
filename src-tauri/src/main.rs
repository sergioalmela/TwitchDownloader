#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, Window};
use std::path::{Path, PathBuf};
use std::fs::File;
use std::io::Write;
use reqwest;

#[derive(Debug)]
enum DownloadError {
    Request(reqwest::Error),
    Io(std::io::Error),
}

impl From<reqwest::Error> for DownloadError {
    fn from(err: reqwest::Error) -> Self {
        DownloadError::Request(err)
    }
}

impl From<std::io::Error> for DownloadError {
    fn from(err: std::io::Error) -> Self {
        DownloadError::Io(err)
    }
}


#[derive(serde::Deserialize)]
struct DownloadArgs {
    m3u8_url: String,
    download_path: String,
    file_name: String,
}

#[tauri::command]
async fn download(args: DownloadArgs, window: Window) -> Result<(), String> {
    println!("Download command invoked with URL: {}", args.m3u8_url);

    // Use args.m3u8_url, args.download_path, and args.file_name in your logic
    let output_file = Path::new(&args.download_path).join(args.file_name);

    match download_and_concatenate_m3u8(&window, &args.m3u8_url, &args.download_path, &output_file).await {
        Ok(()) => Ok(()),
        Err(e) => Err(format!("Download failed: {:?}", e)),
    }
}

async fn download_and_concatenate_m3u8(window: &Window, url: &str, download_path: &str, output_file: &Path) -> Result<(), DownloadError> {
    let response = reqwest::get(url).await?.text().await?;
    let base_url = url.rsplitn(2, '/').nth(1).unwrap_or("");
    let mut output = File::create(output_file)?;
    let segment_lines: Vec<&str> = response.lines().filter(|line| line.ends_with(".ts")).collect();
    let total_segments = segment_lines.len();

    for (index, line) in segment_lines.iter().enumerate() {
        let segment_url = if line.starts_with("http") {
            line.to_string()
        } else {
            format!("{}/{}", base_url, line)
        };
        let content = reqwest::get(&segment_url).await?.bytes().await?;
        output.write_all(&content)?;

        // Emit progress event
        // Inside the loop in download_and_concatenate_m3u8
        let progress = (index + 1) as f64 / total_segments as f64 * 100.0;
        window.emit("download-progress", &progress).expect("Failed to emit progress event");
        // Inside the loop in download_and_concatenate_m3u8
        println!("Downloading segment: {}, progress: {}", segment_url, progress);


    }

    Ok(())
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_item(CustomMenuItem::new("hide", "Hide"))
        .add_submenu(submenu);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![download])
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "quit" => {
                std::process::exit(0);
            }
            "close" => {
                event.window().close().unwrap();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
