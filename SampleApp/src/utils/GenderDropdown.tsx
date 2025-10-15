import React from "react";
import Dropdown, { Option } from "./Dropdown";

const GENDER_OPTIONS: Option[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

type Props = {
  value?: string | null;
  onChange?: (val: string) => void;
  errorText?: string;
  disabled?: boolean;
};

const GenderDropdown: React.FC<Props> = ({
  value = null,
  onChange,
  errorText,
  disabled,
}) => {
  return (
    <Dropdown
      label="Gender"
      placeholder="Select Gender"
      options={GENDER_OPTIONS}
      value={value}
      onChange={onChange}
      errorText={errorText}
      disabled={disabled}
      searchable={false} // 3 options -> search not necessary
      helperText={!errorText ? "Choose one option" : undefined}
    />
  );
};

export default GenderDropdown;
