// @codetype medium | Error propagation with Result and the ? operator
use std::collections::HashMap;
use std::num::ParseIntError;

fn parse_port(value: &str) -> Result<u16, ParseIntError> {
    let port: u16 = value.trim().parse()?;
    Ok(port)
}

fn parse_config(text: &str) -> HashMap<String, String> {
    text.lines()
        .filter(|line| !line.starts_with('#'))
        .filter_map(|line| line.split_once('='))
        .map(|(k, v)| (k.trim().to_string(), v.trim().to_string()))
        .collect()
}

fn main() {
    let config = parse_config("# server\nhost = localhost\nport = 8080");
    match parse_port(&config["port"]) {
        Ok(port) => println!("listening on {}:{}", config["host"], port),
        Err(e) => eprintln!("bad port: {e}"),
    }
}
