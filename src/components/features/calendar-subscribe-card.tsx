import { headers } from "next/headers";
import { CalendarPlus } from "lucide-react";
import { CopyField } from "@/components/features/copy-field";
import { buttonStyles } from "@/components/ui/button-styles";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import { readIntegrationsConfig } from "@/lib/integrations-config";

const CALENDAR_PATH = "/api/calendario.ics";

async function subscriptionUrl(token: string): Promise<string> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return protocol + "://" + host + CALENDAR_PATH + "?token=" + encodeURIComponent(token);
}

export async function CalendarSubscribeCard() {
  const config = readIntegrationsConfig();
  const url = config.CALENDAR_TOKEN ? await subscriptionUrl(config.CALENDAR_TOKEN) : null;

  return (
    <GlassCard ariaLabel="Adicionar ao calendário">
      <CardTitle icon={<CalendarPlus aria-hidden className="size-5 text-violet-300" />}>
        Adicionar ao calendário
      </CardTitle>
      <div className="space-y-4 text-sm text-slate-300">
        <p>
          Cada dia não concluído vira um evento às {config.STUDY_START_HOUR}h (60 minutos), com lembrete 15
          minutos antes.
        </p>
        <a href={CALENDAR_PATH} download className={buttonStyles({ size: "md" })}>
          <CalendarPlus aria-hidden className="size-5" />
          Adicionar ao calendário (.ics)
        </a>
        <p>
          <strong className="text-white">Baixar:</strong> abre o arquivo no Google Agenda, Outlook ou Apple
          Calendar. É uma cópia: se você reagendar, baixe de novo.
        </p>
        {url ? (
          <div className="space-y-2">
            <p>
              <strong className="text-white">Assinar (atualiza sozinho):</strong> no Google Agenda, vá em
              Outras agendas → + → Do URL e cole o endereço abaixo. Não compartilhe este link.
            </p>
            <CopyField value={url} label="URL de assinatura do calendário" />
          </div>
        ) : (
          <p>
            Para assinar e receber atualizações automáticas, configure a variável CALENDAR_TOKEN no .env e na
            Vercel.
          </p>
        )}
      </div>
    </GlassCard>
  );
}
