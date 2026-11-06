# @codetype easy | Check that brackets in a string are balanced
PAIRS = {")": "(", "]": "[", "}": "{"}


def is_balanced(text: str) -> bool:
    stack: list[str] = []
    for ch in text:
        if ch in "([{":
            stack.append(ch)
        elif ch in PAIRS:
            if not stack or stack.pop() != PAIRS[ch]:
                return False
    return not stack


print(is_balanced("{[()()]}"), is_balanced("([)]"))
