import { useState } from "react";

import { Sound } from "~/model";
import { SOUND_OPTIONS } from "~/utils/constants";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ReplayRounded from "@mui/icons-material/ReplayRounded";

import type { ISound } from "~/model";

//================================================

export type SettingsSoundSelectorProps =
  | {
      value: ISound | null;
      onChange: (newSound: ISound | undefined) => void;
      required?: false;
    }
  | {
      value: ISound;
      onChange: (newSound: ISound) => void;
      required: true;
    };

export function SettingsSoundSelector({
  value,
  onChange,
  required,
}: SettingsSoundSelectorProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Autocomplete
      options={
        required
          ? (SOUND_OPTIONS as ISound[])
          : ([null, ...SOUND_OPTIONS] as (null | ISound)[])
      }
      getOptionLabel={(opt) =>
        opt ? (opt.label ?? opt.name) : "Same sound as beat"
      }
      getOptionKey={(opt) => (opt ? opt.name : "null")}
      value={value}
      loading={loading}
      onChange={(_, value) => {
        if (value == null) {
          if (!required) {
            onChange(undefined);
          }
          return;
        }
        setLoading(true);
        new Sound(value, (sound) => {
          setLoading(false);
          onChange(sound);
        });
      }}
      multiple={false}
      disableClearable={required}
      clearText="Reset"
      clearIcon={<ReplayRounded />}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Sound/Instrument"
          placeholder={!required ? "Same sound as beat" : undefined}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      )}
    />
  );
}
