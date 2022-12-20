import { writable } from "svelte/store"

export type Command = {
    name: string;
    event?: string;
    title?: string;
    icon?: string;
    trigger?: {
        key?: string
        isShift?: boolean
        isAlt?: boolean
        isCtrl?: boolean
        preamble?: string
        editMode?: boolean
    }
    execute?: (command: Command) => boolean | void;
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
            isCtrl: true,
        },
    },
    {
        event: "auto_assign_photos",
        name: "Auto Assign",
        title: "Auto assign photos",
        trigger: {
            key: "a",
            isCtrl: true,
        },
    },
    {
        event: "clear_all_photos",
        name: "Clear All Photos",
        title: "Clear all photos",
        trigger: {
            key: "c",
            isCtrl: true,
        },
    }

]

export const commands = writable<Array<Command>>(initialCommands);

export function addCommand(command: Command) {
    commands.update(v => [...v, command]);
}

export function removeCommand(commandName: string) {
    commands.update(v => v.filter(c => c.name !== commandName));
}