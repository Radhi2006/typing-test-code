<?php
// @codetype medium | Class with constructor promotion and readonly props

final class User
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        private string $email,
    ) {
    }

    public function email(): string
    {
        return $this->email;
    }

    public function withEmail(string $email): self
    {
        return new self($this->id, $this->name, $email);
    }
}

$user = new User(1, 'Ada', 'ada@example.com');
echo $user->withEmail('ada@lovelace.dev')->email();
