// @codetype hard | Send messages between threads with mpsc
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    for id in 0..3 {
        let tx = tx.clone();
        thread::spawn(move || {
            for job in 0..3 {
                tx.send(format!("worker {id} finished job {job}")).unwrap();
                thread::sleep(Duration::from_millis(30));
            }
        });
    }
    drop(tx);

    for message in rx {
        println!("{message}");
    }
}
