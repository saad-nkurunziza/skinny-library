use tauri_plugin_shell::{ShellExt, process::CommandEvent};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            
            // Auto-start server when app launches
            tauri::async_runtime::spawn(async move {
                start_server_process(app_handle).await;
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn start_server_process(app_handle: tauri::AppHandle) {
    println!("Starting server...");
    
    let (mut rx, mut _child) = app_handle.shell()
        .sidecar("server")
        .expect("failed to create sidecar binary command")
        .spawn()
        .expect("Failed to spawn sidecar");

    // Handle server output
    while let Some(event) = rx.recv().await {
        match event {
            CommandEvent::Stdout(line_bytes) => {
                let line = String::from_utf8_lossy(&line_bytes);
                println!("Server: {}", line.trim());
            }
            CommandEvent::Stderr(line_bytes) => {
                let line = String::from_utf8_lossy(&line_bytes);
                eprintln!("Server Error: {}", line.trim());
            }
            CommandEvent::Terminated(payload) => {
                println!("Server terminated: {:?}", payload);
                break;
            }
            _ => {}
        }
    }
}


