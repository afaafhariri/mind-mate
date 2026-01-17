import React, { useRef, useEffect } from "react";
import { Stack, TextField } from "@mui/material";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const newValue = e.target.value;
    if (isNaN(Number(newValue))) return; // Only allow numbers

    const newOtp = value.split("");
    // Take the last character if user types more (though maxLength is 1)
    newOtp[index] = newValue.slice(-1);
    const combinedOtp = newOtp.join("");

    onChange(combinedOtp);

    // Focus next input if value is entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger onComplete if full
    if (combinedOtp.length === length && onComplete) {
      onComplete(combinedOtp);
    }
  };

  return (
    <Stack direction="row" spacing={1} justifyContent="center">
      {Array.from({ length }).map((_, index) => (
        <TextField
          key={index}
          inputRef={(el) => (inputRefs.current[index] = el)}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[index] && index > 0) {
              inputRefs.current[index - 1]?.focus();
            }
          }}
          slotProps={{
            htmlInput: { maxLength: 1, style: { textAlign: "center" } },
          }}
          variant="outlined"
          sx={{
            width: 48,
            height: 48,
            "& .MuiInputBase-root": { height: "100%" },
          }}
        />
      ))}
    </Stack>
  );
};

export default OtpInput;
