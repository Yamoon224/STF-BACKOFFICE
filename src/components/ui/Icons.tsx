import { Check, KeyRound, Pencil, Plus, Trash2, Undo2 } from "lucide-react";

type IconProps = { className?: string };

const base = "h-4 w-4";

export function PencilIcon({ className = base }: IconProps) {
  return <Pencil className={className} strokeWidth={1.8} />;
}

export function TrashIcon({ className = base }: IconProps) {
  return <Trash2 className={className} strokeWidth={1.8} />;
}

export function PlusIcon({ className = base }: IconProps) {
  return <Plus className={className} strokeWidth={1.8} />;
}

export function CheckIcon({ className = base }: IconProps) {
  return <Check className={className} strokeWidth={1.8} />;
}

export function UndoIcon({ className = base }: IconProps) {
  return <Undo2 className={className} strokeWidth={1.8} />;
}

export function KeyIcon({ className = base }: IconProps) {
  return <KeyRound className={className} strokeWidth={1.8} />;
}
