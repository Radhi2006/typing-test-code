# @codetype easy | Transpose and multiply matrices with zip
def transpose(matrix: list[list[int]]) -> list[list[int]]:
    return [list(row) for row in zip(*matrix)]


def multiply(a: list[list[int]], b: list[list[int]]) -> list[list[int]]:
    return [[sum(x * y for x, y in zip(row, col)) for col in zip(*b)] for row in a]


print(transpose([[1, 2, 3], [4, 5, 6]]))
print(multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]))
