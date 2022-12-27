import { writable } from "svelte/store"
import { log } from "@/lib/globals"
import { toast } from "./toasts"

export type CommandTrigger = {
    key?: string
    isShift?: boolean
    isAlt?: boolean
    isCtrl?: boolean
    isArrowUp?: boolean
    preamble?: string
    editmode?: boolean
}

export type Command = {
    name: string;
    event?: string;
    title?: string;
    icon?: string;
    trigger?: CommandTrigger;
    execute?: (command: Command) => boolean | void | Promise<any>;
    disabled?: () => boolean;
    showInToolbar?: boolean;
}

class ActionContext {
    constructor(public readonly command: Command) { }
    execute(context: CommandContext) {
        if (!this.command.execute) throw new Error(`Command ${this.command.name} has no execute function`)
        this.command.execute(this.command)
    }
}

class CommandContext {

    private version = writable(1);

    subscribe(fn: (v: number) => void) {
        return this.version.subscribe(fn)
    }

    constructor(public readonly command: { name: string, trigger: CommandTrigger }) {
    }

    public readonly actions: { [key: string]: ActionContext } = {};

    action(command: Command) {
        if (!command.trigger) throw new Error(`Command ${command.name} has no trigger`)
        let result = this.getAction(command.trigger)
        if (result) log(`Action already exists: ${command.name} ${asKeyboardShortcut(command.trigger)}`)
        this.setActions(command.trigger, new ActionContext(command));
        return this;
    }

    addCommand(command: Command) {
        command.event = command.event || command.name
        command.name = command.name || command.event
        command.title = command.title || command.name
        return this.action(command)
    }

    getCommands() {
        return Object.values(this.actions).map(a => a.command)
    }

    findCommand(shortcut: string): Command {
        return this.actions[shortcut]?.command
    }

    private setActions(trigger: CommandTrigger, action: ActionContext) {
        this.actions[asKeyboardShortcut(trigger)] = action;
        this.version.update(v => v + 1)
    }

    private getAction(trigger: CommandTrigger) {
        return this.actions[asKeyboardShortcut(trigger)]
    }
}

export function isFilterMatch(searchFilter: string, command: Command) {
    if (!searchFilter) return true
    if (!command.trigger) throw new Error(`Command ${command.name} has no trigger`)
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
    public readonly primaryContext: CommandContext;

    constructor() {
        this.primaryContext = new CommandContext({ name: "primary", trigger: {} })
        // get out of all other contexts
        this.primaryContext.action(
            { name: "Escape", trigger: { key: "Escape" } }
        )
    }

    update() {
        log("commander.update")
        this.version.update(v => v + 1)
    }
    private version = writable(1);
    subscribe(fn: (v: number) => void) {
        return this.version.subscribe(fn)
    }

    findCommand(eventName: string): Command | null {
        let result: Command | null = null;
        Object.entries(this.contexts).find(([key, context]) => {
            return Object.entries(context.actions).find(([key, action]) => {
                if (action.command.event === eventName) {
                    result = action.command
                    return true
                }
            })
        })
        return result
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

    context(command: { name: string, trigger: CommandTrigger }) {
        let result = this.getContext(command.trigger);
        if (!result) {
            const context = new CommandContext(command);
            result = this.setContext(command.trigger, context);
            context.subscribe(() => this.version.update(v => v + 1))
        }
        return result;
    }

    setContext(trigger: CommandTrigger, context: CommandContext) {
        return this.contexts[asKeyboardShortcut(trigger)] = context;
    }

    getContext(trigger: CommandTrigger) {
        return this.contexts[asKeyboardShortcut(trigger)]
    }

    private activeContext: CommandContext | null = null;
    private un: Array<Function> = [];

    listen() {
        const listener = (e: KeyboardEvent) => {

            const shortcut = asKeyboardShortcut({
                key: e.key,
                isShift: e.shiftKey,
                isAlt: e.altKey,
                isCtrl: e.ctrlKey,
            });
            let command: Command | null = null;

            if (this.activeContext) {
                command = this.activeContext.findCommand(shortcut);
                if (!command) {
                    log(`You pressed ${shortcut}, try one of these: ${Object.keys(this.activeContext.actions).join(" ")}`)
                }
            }

            if (!command) {
                const ctx = this.findContext(shortcut);
                if (ctx) {
                    log({ shortcut, ctx })
                    this.activeContext = ctx;
                    e.preventDefault();
                    e.stopPropagation();
                    toast(ctx.command.name)
                    return
                }
                log(`You pressed ${shortcut}, try one of these: ${Object.keys(commander.contexts).join(" ")}`)

                // search primary context
                command = this.primaryContext.findCommand(shortcut);
                if (command) {
                    log(`Command found in primary context: ${command.name}`)
                    this.activeContext = this.primaryContext;
                }
                else log(`Command not found in primary context, try one of these: ${Object.keys(this.primaryContext.actions).join(" ")}`)
            }

            if (command) {
                log({ shortcut, command })
                e.preventDefault();
                e.stopPropagation();
                executeCommand(command)
                return;
            }
        }
        window.addEventListener('keydown', listener);
        this.un.push(() => window.removeEventListener('keydown', listener));
    }

    unlisten() {
        this.un.forEach(u => u());
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

// reluctant export
export const commander = new Commander();

// prefer defining here instead of locally in the component
export const contexts = {
    copy: commander.context({
        name: "Copy Into",
        trigger: { key: "C", isShift: true },
    }),
    file: commander.context({
        name: "File",
        trigger: { key: "F", isShift: true },
    }),
    goto: commander.context({
        name: "Goto Cell",
        trigger: { key: "G", isShift: true },
    }),
    swap: commander.context({
        name: "Swap Into",
        trigger: { key: "S", isShift: true },
    }),
    workarea: commander.context({
        name: "Work Area",
        trigger: { key: "W", isShift: true },
    }),
}


export function addCommand(command: Command) {
    command.event = command.event || command.name
    command.name = command.name || command.event
    command.title = command.title || command.name
    const context = commander.context({ name: "Preamble", trigger: { key: command.trigger?.preamble || "/" } })
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

    const doit = () => {
        const event = new Event("execute_command")
        // @ts-ignore
        event["detail"] = { eventName }
        document.dispatchEvent(event)
    };

    node.addEventListener("click", doit)
    if (!node.innerText) {
        const cmd = commander.findCommand(eventName);
        if (!cmd) throw "Command not found"

        node.innerText = cmd.name
        node.title = cmd.title || cmd.name
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
        key ? keyNameMap[key as keyof typeof keyNameMap] || key.toUpperCase() : "",
    ]
        .filter(Boolean)
        .join("+")

    return modifiers
}

function executeCommand(command: Command) {
    if (command.execute) {
        command.execute(command)
        toast(command.title || command.name)
    }
}

