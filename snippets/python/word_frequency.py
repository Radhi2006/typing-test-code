# @codetype easy | Count the most common words in a text
import re
from collections import Counter


def top_words(text: str, n: int = 5) -> list[tuple[str, int]]:
    words = re.findall(r"[a-z']+", text.lower())
    return Counter(words).most_common(n)


print(top_words("the cat and the hat and the bat"))
