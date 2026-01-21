import { ActionPanel, Action, Icon, List, showToast, Toast } from "@raycast/api";
import React, { useEffect, useState } from "react";
import { getLitraBinaryPath } from "./preferences";
import {
  getDevices,
  toggle,
  isOn,
  setTemperatureInKelvin,
  setBrightnessPercentage,
  checkLitraVersion,
  toggleBack,
  setBackBrightnessPercentage,
  setBackColor,
} from "./utils";
import { getEnabledTemperaturePresets } from "./temperature-presets";
import { getEnabledBrightnessPresets } from "./brightness-presets";
import { Device } from "./types";

export default function Command() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [enabledTemperaturePresets, setEnabledTemperaturePresets] = useState<Set<number>>(new Set());
  const [enabledBrightnessPresets, setEnabledBrightnessPresets] = useState<Set<number>>(new Set());

  const litraBinaryPath = getLitraBinaryPath();

  const refreshDevices = async () => {
    await checkLitraVersion(litraBinaryPath);

    if (!isLoading) setIsLoading(true);
    const devices = await getDevices(litraBinaryPath);
    setDevices(devices);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshDevices();
  }, []);

  useEffect(() => {
    (async () => {
      const enabledTemperaturePresets = await getEnabledTemperaturePresets();
      setEnabledTemperaturePresets(enabledTemperaturePresets);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const enabledBrightnessPresets = await getEnabledBrightnessPresets();
      setEnabledBrightnessPresets(enabledBrightnessPresets);
    })();
  }, []);

  return (
    <List isLoading={isLoading}>
      {devices.length
        ? devices.map((device) => (
            <List.Item
              key={device.device_path}
              title={device.device_type_display}
              subtitle={`${device.is_on ? "💡" : "💡🚫"} ${device.brightness_in_lumen} lm / ${
                device.temperature_in_kelvin
              } K${device.has_back_side && device.is_back_on !== null ? ` | Back: ${device.is_back_on ? "🌈 On" : "🌈🚫 Off"} ${device.back_brightness_percentage}%` : ""} (${device.serial_number || device.device_path})`}
              actions={
                <ActionPanel>
                  <Action
                    title="Toggle"
                    icon={Icon.LightBulb}
                    onAction={async () => {
                      await toggle(device.device_path, litraBinaryPath);
                      const isDeviceOn = await isOn(device.device_path, litraBinaryPath);

                      if (isDeviceOn) {
                        await showToast({ title: `Turned on ${device.device_type_display}`, style: Toast.Style.Success });
                      } else {
                        await showToast({ title: `Turned off ${device.device_type_display}`, style: Toast.Style.Success });
                      }

                      refreshDevices();
                    }}
                  />
                  {Array.from(enabledTemperaturePresets).map((temperature) => (
                    <Action
                      key={temperature}
                      title={`Set Temperature to ${temperature}K`}
                      icon={Icon.Temperature}
                      onAction={async () => {
                        await setTemperatureInKelvin(device.device_path, temperature, litraBinaryPath);
                        await showToast({
                          title: `Set ${device.device_type_display}'s temperature to ${temperature}K`,
                          style: Toast.Style.Success,
                        });

                        refreshDevices();
                      }}
                    />
                  ))}
                  {Array.from(enabledBrightnessPresets).map((brightness) => (
                    <Action
                      key={brightness}
                      title={`Set Brightness to ${brightness}%`}
                      icon={Icon.CircleProgress100}
                      onAction={async () => {
                        await setBrightnessPercentage(device.device_path, brightness, litraBinaryPath);
                        await showToast({
                          title: `Set ${device.device_type_display}'s brightness to ${brightness}%`,
                          style: Toast.Style.Success,
                        });

                        refreshDevices();
                      }}
                    />
                  ))}
                  {device.has_back_side && (
                    <>
                      <Action
                        title="Toggle Back Light"
                        icon={Icon.Stars}
                        onAction={async () => {
                          await toggleBack(device.device_path, litraBinaryPath);
                          await showToast({
                            title: `Toggled ${device.device_type_display}'s back light`,
                            style: Toast.Style.Success,
                          });

                          refreshDevices();
                        }}
                      />
                      {Array.from(enabledBrightnessPresets).map((brightness) => (
                        <Action
                          key={`back-${brightness}`}
                          title={`Set Back Light Brightness to ${brightness}%`}
                          icon={Icon.CircleProgress100}
                          onAction={async () => {
                            await setBackBrightnessPercentage(device.device_path, brightness, litraBinaryPath);
                            await showToast({
                              title: `Set ${device.device_type_display}'s back light brightness to ${brightness}%`,
                              style: Toast.Style.Success,
                            });

                            refreshDevices();
                          }}
                        />
                      ))}
                      {["white", "red", "green", "blue", "yellow", "cyan", "magenta"].map((color) => (
                        <Action
                          key={`color-${color}`}
                          title={`Set Back Light Color to ${color.charAt(0).toUpperCase() + color.slice(1)}`}
                          icon={Icon.Brush}
                          onAction={async () => {
                            await setBackColor(device.device_path, color, litraBinaryPath);
                            await showToast({
                              title: `Set ${device.device_type_display}'s back light color to ${color}`,
                              style: Toast.Style.Success,
                            });

                            refreshDevices();
                          }}
                        />
                      ))}
                    </>
                  )}
                </ActionPanel>
              }
            />
          ))
        : !isLoading && (
            <List.EmptyView
              icon={Icon.ExclamationMark}
              title="No devices found"
              description="You don't seem to have any USB-connected Litra Glow, Litra Beam or Litra Beam LX devices."
            />
          )}
    </List>
  );
}
