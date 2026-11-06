// @codetype easy | Generic bubble sort over a mutable slice
fn bubble_sort<T: PartialOrd>(items: &mut [T]) {
    let n = items.len();
    for i in 0..n {
        let mut swapped = false;
        for j in 0..n - 1 - i {
            if items[j] > items[j + 1] {
                items.swap(j, j + 1);
                swapped = true;
            }
        }
        if !swapped {
            break;
        }
    }
}

fn main() {
    let mut data = [5, 1, 4, 2, 8];
    bubble_sort(&mut data);
    println!("{data:?}");
}
