// @codetype easy | Binary search on a sorted slice returning Option
fn binary_search(items: &[i32], target: i32) -> Option<usize> {
    let (mut low, mut high) = (0, items.len());
    while low < high {
        let mid = low + (high - low) / 2;
        match items[mid].cmp(&target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => low = mid + 1,
            std::cmp::Ordering::Greater => high = mid,
        }
    }
    None
}

fn main() {
    println!("{:?}", binary_search(&[1, 3, 5, 7, 9], 7));
}
