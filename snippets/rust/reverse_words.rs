// @codetype easy | Reverse the order of words in a sentence
fn reverse_words(sentence: &str) -> String {
    sentence.split_whitespace().rev().collect::<Vec<_>>().join(" ")
}

fn main() {
    let input = "type real code every day";
    println!("{}", reverse_words(input));
}
