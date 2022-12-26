import { log } from "@/lib/globals"
import { toast } from "./toasts"

export type CommandTrigger = {
    key?: string
    isShift?: boolean
    isAlt?: boolean
    isCtrl?: boolean
    preamble?: string
    editmode?: boolean
}

export type Command = {
    name: string;
    event?: string;
    title?: string;
    icon?: string;
    trigger?: CommandTrigger;
    execute?: (command: Command) => boolean | void;
    disabled?: () => boolean;
    showInToolbar?: boolean;
}

type CallbackContext = { action: ActionContext, context: CommandContext };
type Callback = (ctx?: CallbackContext) => void

class ActionContext {
    constructor(public readonly command: Command) { }
    execute(context: CommandContext) {
        this.command.execute(this.command)
    }
}

class CommandContext {

    constructor(public readonly command: { trigger: CommandTrigger }) { }
    public readonly actions: { [key: string]: ActionContext } = {};

    action(command: Command) {
        let result = this.getAction(command.trigger)
        if (result) log(`Action already exists: ${command.name} ${asKeyboardShortcut(command.trigger)}`)
        return this.setActions(command.trigger, new ActionContext(command));
    }

    getCommands() {
        return Object.values(this.actions).map(a => a.command)
    }

    findCommand(shortcut: string): Command {
        return this.actions[shortcut]?.command
    }

    private setActions(trigger: CommandTrigger, action: ActionContext) {
        this.actions[asKeyboardShortcut(trigger)] = action;
    }

    private getAction(trigger: CommandTrigger) {
        return this.actions[asKeyboardShortcut(trigger)]
    }
}

export function isFilterMatch(searchFilter: string, command: Command) {
    const tokens = searchFilter.toUpperCase().split(" ")
    const match = (command.title + asKeyboardShortcut(command.trigger)).toUpperCase()
    return (
        tokens.reduce((b, t) => {
            if (b < 0) return b // nothing to find, abort
            const i = match.indexOf(t, b)
            if (i < 0) return i // not found, abort
            return i + t.length // found, continue after last token
        }, 0) > -1
    )
}

class Commander {
    findCommand(eventName: string) {
        let result: Command;
        Object.entries(this.contexts).find(([key, context]) => {
            return Object.entries(context.actions).find(([key, action]) => {
                if (action.command.event === eventName) {
                    result = action.command
                    return true
                }
            })
        })
        return result;
    }

    getContexts() {
        return Object.values(this.contexts);
    }

    getCommands() {
        let result: Array<Command> = [];
        Object.entries(this.contexts).forEach(([key, context]) => {
            Object.entries(context.actions).forEach(([key, action]) => {
                result.push(action.command)
            })
        })
        return result;
    }

    private contexts: { [key: string]: CommandContext } = {};

    context(command: { trigger: CommandTrigger }) {
        let result = this.getContext(command.trigger);
        if (!result) {
            result = this.setContext(command.trigger, new CommandContext(command));
        }
        return result;
    }

    setContext(trigger: CommandTrigger, context: CommandContext) {
        return this.contexts[asKeyboardShortcut(trigger)] = context;
    }

    getContext(trigger: CommandTrigger) {
        return this.contexts[asKeyboardShortcut(trigger)]
    }

    listen() {
        let activeContext: CommandContext;
        window.addEventListener('keydown', (e) => {
            const shortcut = asKeyboardShortcut(e);
            let command: Command;
            if (activeContext) {
                command = activeContext.findCommand(shortcut);
                if (!command) {
                    log(`You pressed ${shortcut}, try one of these: ${Object.keys(activeContext.actions).join(" ")}`)
                }
            }
            if (!command) {
                const ctx = this.findContext(shortcut);
                if (ctx) {
                    log({ shortcut, ctx })
                    activeContext = ctx;
                    e.preventDefault();
                    e.stopPropagation();
                    return
                }
                this.findContext(shortcut)
                log(`You pressed ${shortcut}, try one of these: ${Object.keys(commander.contexts).join(" ")}`)
            }
            log({ shortcut, command })
            if (command) {
                log({ shortcut, activeContext, command })
                e.preventDefault();
                e.stopPropagation();
                executeCommand(command)
                return;
            }
        })
    }

    findContext(shortcut: string) {
        return this.contexts[shortcut]
    }

    play(contextHotkeys: string, ...invocations: string[]) {
        if (!invocations.length) {
            return;
        }
        const context = this.contexts[contextHotkeys];
        if (!context) throw "Context not found"

        while (invocations.length) {
            const actionHotKeys = invocations.shift();
            if (!actionHotKeys) throw "Action hotkey not defined"

            const action = context.actions[actionHotKeys];
            if (!action) throw "Action not found"

            action.execute(context);
        }
    }
}

export const commander = new Commander();

export function addCommand(command: Command) {
    command.event = command.event || command.name
    command.name = command.name || command.event
    command.title = command.title || command.name
    const context = commander.context({ trigger: { key: command.trigger.preamble || ":" } })
    context.action(command)
}

export function removeCommand(commandName: string) {
    // TODO
}

// svelte action
export function shortcut(node: HTMLElement, shortcut: string | CommandTrigger) {
    let trigger: CommandTrigger;
    if (typeof shortcut === "string") {
        const tokens = shortcut.split(">").reverse()
        trigger = {
            key: tokens[0],
            isShift: tokens.includes("Shift"),
            isCtrl: tokens.includes("Ctrl"),
            isAlt: tokens.includes("Alt"),
        }
    } else {
        trigger = shortcut
    }
    const command = {
        name: `goto-${node.title}`,
        title: node.title,
        trigger,
        execute: () => {
            node.focus()
            return true
        },
    }
    addCommand(command)
    return {
        destroy() {
            removeCommand(command.name)
        },
    }
}

export function command(node: HTMLButtonElement, eventName: string) {

    let cmd = commander.findCommand(eventName);

    const doit = () => {
        const event = new Event("execute_command")
        event["detail"] = { eventName }
        document.dispatchEvent(event)
    };

    node.addEventListener("click", doit)
    if (!node.innerText) {
        node.innerText = cmd.name
        node.title = cmd.title
    }

    return {
        destroy() {
            node.removeEventListener("click", doit)
        }
    }
}

export function asKeyboardShortcut(trigger: CommandTrigger) {
    if (!trigger) return "<none>"
    const { key, preamble, isShift, isCtrl, isAlt } = trigger
    const keyNameMap = {
        ArrowUp: "↑",
        ArrowDown: "↓",
        ArrowLeft: "←",
        ArrowRight: "→",
        Shift: "Shift",
        Control: "Ctrl",
        Alt: "Alt",
        Escape: "Esc",
        Enter: "Enter",
        " ": "Space",
    }
    const modifiers = [
        isCtrl && keyNameMap.Control,
        isAlt && keyNameMap.Alt,
        isShift && keyNameMap.Shift,
        key ? keyNameMap[key] || key.toUpperCase() : "",
    ]
        .filter(Boolean)
        .join("+")

    return modifiers
}

function executeCommand(command: Command) {
    if (command.execute) {
        command.execute(command)
        toast(command.title)
    }
}

