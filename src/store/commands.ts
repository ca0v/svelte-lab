import { writable } from "svelte/store"
import { log } from "@/lib/globals"
import { toast } from "./toasts"

export type CommandTrigger = {
    key?: string
    isShift?: boolean
    isAlt?: boolean
    isCtrl?: boolean
    isArrowUp?: boolean
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

export function isCommandDisabled(a: Command) {
    return a.disabled && a.disabled()
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

    private action(command: Command) {
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
    readonly primaryContext: CommandContext;

    constructor() {
        this.primaryContext = this.context({ name: "primary", trigger: {} })
        // get out of all other contexts
        this.primaryContext
            .addCommand(
                { name: "Escape Context", title: "Exit the current context", event: "escape", trigger: { key: "Escape", } }
            )
            .addCommand({
                name: "suppress-reload", trigger: { key: "r", isCtrl: true }, execute: (command) => {
                    toast("Reload temporarily supressed.")
                    return true
                }
            }).addCommand({
                name: "suppress-reload", trigger: { key: "R", isCtrl: true, isShift: true }, execute: (command) => {
                    toast("Reload temporarily supressed.")
                    return true
                }
            })
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
        function preventDefault(e: Event) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
        const keyDownHandler = (e: KeyboardEvent) => {

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
                    if (Object.values(ctx.actions).every(a => isCommandDisabled(a.command))) {
                        // ignore this context since we cannot execute any commands
                        return;
                    }
                    this.activeContext = ctx;
                    toast(ctx.command.name)
                    return preventDefault(e);
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
                executeCommand(command)
                command.showInToolbar = false
                commander.update();
                return preventDefault(e);
            }
        }
        document.addEventListener('keydown', keyDownHandler);
        this.un.push(() => document.removeEventListener('keydown', keyDownHandler));
    }

    unlisten() {
        this.un.forEach(u => u());
    }

    findContext(shortcut: string) {
        return this.contexts[shortcut]
    }

    play(contextHotkeys: string, ...invocations: string[]) {
        if (!invocations.length) {
            const context = contexts.primary;
            const action = context.actions[contextHotkeys];
            if (action) {
                executeCommand(action.command);
                return;
            }

            // perhaps it is an event
            const command = this.findCommand(contextHotkeys);
            if (command) {
                executeCommand(command);
                return
            }

            throw `Action not found: ${contextHotkeys}`
        } else {
            const context = this.contexts[contextHotkeys];
            if (!context) throw "Context not found"

            while (invocations.length) {
                const actionHotKeys = invocations.shift();
                if (!actionHotKeys) throw "Action hotkey not defined"

                const action = context.actions[actionHotKeys];
                if (!action) throw `Action not found: ${actionHotKeys}`
                executeCommand(action.command);
            }
        }
    }
}

// reluctant export
export const commander = new Commander();

// prefer defining here instead of locally in the component
export const contexts = (() => {
    const trigger: CommandTrigger = { isShift: true, isCtrl: true }
    return {
        primary: commander.primaryContext,
        copy: commander.context({
            name: "Copy Into",
            trigger: { key: "C", ...trigger },
        }),
        file: commander.context({
            name: "File",
            trigger: { key: "F", ...trigger },
        }),
        goto: commander.context({
            name: "Goto Cell",
            trigger: { key: "G", ...trigger },
        }),
        swap: commander.context({
            name: "Swap Into",
            trigger: { key: "S", ...trigger },
        }),
        workarea: commander.context({
            name: "Work Area",
            trigger: { key: "Z", ...trigger },
        }),
        navigation: {
            leftActions: commander.context({
                name: "Left",
                trigger: { key: "ArrowLeft", ...trigger },
            }),
            upActions: commander.context({
                name: "Up",
                trigger: { key: "ArrowUp", ...trigger },
            }),
            rightActions: commander.context({
                name: "Right",
                trigger: { key: "ArrowRight", ...trigger },
            }),
            downActions: commander.context({
                name: "Down",
                trigger: { key: "ArrowDown", ...trigger },
            }),
            zoomActions: commander.context({
                name: "Zoom Image",
                trigger: { key: "Z", ...trigger },
            }),
            moveActions: commander.context({
                name: "Move Image",
                trigger: { key: "M", ...trigger },
            })
        },
        rotationActions: commander.context({
            name: "Rotate Image",
            trigger: { key: "A", ...trigger },
        })

    }
})();


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
    contexts.primary.addCommand(command)
    return {
        destroy() {
            removeCommand(command.name)
        },
    }
}

export function asKeyboardShortcut(trigger: CommandTrigger) {
    if (!trigger) return "<none>"
    const { key, isShift, isCtrl, isAlt } = trigger
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

async function executeCommand(command: Command) {
    if (command.execute) {
        if (await command.execute(command)) {
            toast(command.title || command.name)
        }
    } else {
        // trigger execute-command
        const event = new Event("execute_command")
        // @ts-ignore
        event["detail"] = { command }
        document.dispatchEvent(event)
    }
}

