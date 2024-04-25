/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** `litra` binary path - The path to the `litra` binary. You can install the `litra` command line tool by following the instructions at https://github.com/timrogers/litra-rs, and then running `which litra` to get the path. */
  "litraBinaryPath": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `manage-devices` command */
  export type ManageDevices = ExtensionPreferences & {}
  /** Preferences accessible in the `manage-temperature-presets` command */
  export type ManageTemperaturePresets = ExtensionPreferences & {}
  /** Preferences accessible in the `manage-brightness-presets` command */
  export type ManageBrightnessPresets = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `manage-devices` command */
  export type ManageDevices = {}
  /** Arguments passed to the `manage-temperature-presets` command */
  export type ManageTemperaturePresets = {}
  /** Arguments passed to the `manage-brightness-presets` command */
  export type ManageBrightnessPresets = {}
}
