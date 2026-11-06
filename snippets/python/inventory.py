# @codetype medium | Dataclasses with computed properties
from dataclasses import dataclass, field


@dataclass
class Item:
    name: str
    price: float
    quantity: int = 1

    @property
    def total(self) -> float:
        return self.price * self.quantity


@dataclass
class Inventory:
    items: list[Item] = field(default_factory=list)

    def add(self, item: Item) -> None:
        self.items.append(item)

    def value(self) -> float:
        return sum(item.total for item in self.items)
