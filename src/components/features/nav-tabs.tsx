"use client";

import { CalendarDays, Code2, Layers, NotebookPen } from "lucide-react";
import { Tabs, type TabItem } from "@/components/ui/tabs";

interface NavTabsProps {
  dueFlashcards: number;
}

export function NavTabs({ dueFlashcards }: NavTabsProps) {
  const items: TabItem[] = [
    { href: "/", label: "Estudar Hoje", icon: NotebookPen },
    {
      href: "/flashcards",
      label: "Flashcards Pendentes",
      icon: Layers,
      badge: dueFlashcards,
    },
    { href: "/desafios", label: "Desafio do Dia", icon: Code2 },
    { href: "/calendario", label: "Calendário 120 Dias", icon: CalendarDays },
  ];

  return <Tabs items={items} ariaLabel="Navegação principal" />;
}
