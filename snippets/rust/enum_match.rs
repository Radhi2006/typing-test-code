// @codetype medium | Enums with data and exhaustive matching
enum Command {
    Move { x: i32, y: i32 },
    Write(String),
    Color(u8, u8, u8),
    Quit,
}

fn describe(cmd: &Command) -> String {
    match cmd {
        Command::Move { x, y } => format!("move to ({x}, {y})"),
        Command::Write(text) => format!("write {text:?}"),
        Command::Color(r, g, b) => format!("color #{r:02x}{g:02x}{b:02x}"),
        Command::Quit => "quit".to_string(),
    }
}

fn main() {
    let cmds = [
        Command::Move { x: 3, y: 4 },
        Command::Write("hi".into()),
        Command::Color(255, 128, 0),
        Command::Quit,
    ];
    for cmd in &cmds {
        println!("{}", describe(cmd));
    }
}
