import { assert, expect, test } from 'vitest'
import { commander } from "../src/store/commands"

// Edit an assertion and save to see HMR in action

test('Commands', () => {
    const ctx1 = commander.context({ trigger: { key: 'c' } })
    let success = false
    ctx1.action({
        event: "start_new_story",
        name: "Create",
        title: "Create a new story",
        trigger: { key: "n" },
        execute: () => {
            success = true
        }
    })

    commander.play("C", "N")
    expect(success).toBe(true)
})