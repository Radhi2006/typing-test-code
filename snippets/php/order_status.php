<?php
// @codetype medium | Backed enum with methods

enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Shipped = 'shipped';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return ucfirst($this->value);
    }

    public function canCancel(): bool
    {
        return in_array($this, [self::Pending, self::Paid], true);
    }
}

$status = OrderStatus::from('paid');
echo $status->label(), ' cancellable: ', var_export($status->canCancel(), true);
