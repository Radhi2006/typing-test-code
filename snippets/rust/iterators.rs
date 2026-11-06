// @codetype easy | Chain iterator adapters to transform data
fn main() {
    let numbers = vec![3, 8, 12, 5, 21, 6, 14];

    let total: i32 = numbers
        .iter()
        .filter(|&&n| n % 2 == 0)
        .map(|n| n * n)
        .sum();

    let labels: Vec<String> = numbers.iter().take(3).map(|n| format!("#{n}")).collect();

    println!("sum of even squares: {total}");
    println!("first three: {}", labels.join(", "));
}
