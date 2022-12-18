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
    }
    execute?: (command: Command) => true | void;
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
    commands.update(v => [...v, command]);
}
