import { writable } from "svelte/store"

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
}

const initialCommands: Array<Command> = [
    {
        event: "start_new_story",
        name: "Create",
        title: "Create a new story",
        trigger: {
            key: "n",
        },
    },
    {
        event: "save_story",
        name: "Save",
        title: "Save story",
        trigger: {
            key: "s",
        },
    },
    {
        event: "auto_assign_photos",
        name: "Auto Assign",
        title: "Auto assign photos",
        trigger: {
            key: "a",
        },
    },
    {
        event: "clear_all_photos",
        name: "Clear All Photos",
        title: "Clear all photos",
        trigger: {
            key: "c",
        },
    }

]

export const commands = writable<Array<Command>>(initialCommands);

export function addCommand(command: Command) {
    command.title = command.title || command.name
    commands.update(v => [...v, command]);
}

export function removeCommand(commandName: string) {
    commands.update(v => v.filter(c => c.name !== commandName));
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

    let cmd: Command;

    commands.update(v => v.map(c => {
        if (c.event === eventName) {
            cmd = c
        }
        return c
    }))

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

