import { Plus, Terminal as TerminalIcon, Trash2, X } from "lucide-react";
import { useI18n } from "../../i18n";
import s from "../../styles";

interface ShellTab {
  id: string;
  title: string;
}

interface ShellTerminalHeaderProps {
  shells: ShellTab[];
  activeShellId: string | null;
  maxShells: number;
  onSelectShell: (shellId: string) => void;
  onAddShell: () => void;
  onCloseShell: (shellId: string) => void;
  onClosePanel: () => void;
}

export function ShellTerminalHeader({
  shells,
  activeShellId,
  maxShells,
  onSelectShell,
  onAddShell,
  onCloseShell,
  onClosePanel,
}: ShellTerminalHeaderProps) {
  const { t } = useI18n();
  const limitReached = shells.length >= maxShells;

  return (
    <div style={s.shellTerminalHeader}>
      <span style={s.shellTerminalTitle}>{t("terminal.title")}</span>
      <div style={s.shellTerminalTabs}>
        {shells.map((shell) => {
          const selected = activeShellId === shell.id;
          return (
            <div
              key={shell.id}
              onClick={() => onSelectShell(shell.id)}
              className="shell-terminal-tab"
              data-active={selected}
              style={s.shellTerminalTab}
            >
              <TerminalIcon
                size={13}
                className="shell-terminal-tab-icon"
                style={s.shellTerminalTabIcon}
              />
              <div style={s.shellTerminalTabLabel}>
                zsh
              </div>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onCloseShell(shell.id);
                }}
                title={t("terminal.closeShell", { title: shell.title })}
                style={s.shellTerminalTabClose}
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
        <button
          onClick={onAddShell}
          disabled={limitReached}
          title={limitReached ? t("terminal.limitReached") : t("terminal.newTerminal")}
          className="shell-terminal-tab-add"
          data-disabled={limitReached}
          style={s.shellTerminalTabAdd}
        >
          <Plus size={13} />
        </button>
      </div>
      <span style={s.shellTerminalCount}>
        {shells.length}/{maxShells}
      </span>
      <button
        onClick={onClosePanel}
        title={t("terminal.closeTerminals")}
        style={s.shellTerminalCloseButton}
      >
        <X size={14} />
      </button>
    </div>
  );
}
