# @codetype medium | Parse commands with structural pattern matching
def handle(command: str) -> str:
    match command.split():
        case ["go", direction] if direction in {"north", "south"}:
            return f"Walking {direction}"
        case ["pick", "up", *items] if items:
            return f"Picked up {', '.join(items)}"
        case ["drop", item]:
            return f"Dropped {item}"
        case ["quit" | "exit"]:
            return "Goodbye!"
        case _:
            return f"Unknown command: {command!r}"


print(handle("pick up sword shield"))
