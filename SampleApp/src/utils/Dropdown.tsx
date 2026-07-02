import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";

export type Option = { label: string; value: string };

type Props = {
  value?: string | null;
  onChange?: (val: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  searchable?: boolean;
  // Style overrides
  containerStyle?: any;
  triggerStyle?: any;
  triggerTextStyle?: any;
  modalCardStyle?: any;
  optionStyle?: any;
  optionTextStyle?: any;
  selectedOptionStyle?: any;
};

const Dropdown: React.FC<Props> = ({
  value = null,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  helperText,
  errorText,
  disabled = false,
  searchable = true,
  containerStyle,
  triggerStyle,
  triggerTextStyle,
  modalCardStyle,
  optionStyle,
  optionTextStyle,
  selectedOptionStyle,
}) => {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<string | null>(value);
  const [query, setQuery] = useState("");

  const selectedValue = value !== null ? value : internal;
  const selectedLabel = useMemo(
    () => options.find(o => o.value === selectedValue)?.label,
    [options, selectedValue]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      o =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q)
    );
  }, [options, query]);

  const handleSelect = (val: string) => {
    setOpen(false);
    if (onChange) onChange(val);
    else setInternal(val);
    setQuery("");
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          disabled && styles.triggerDisabled,
          !!errorText && styles.triggerError,
          triggerStyle,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        accessibilityLabel={label || placeholder}
      >
        <Text style={[styles.triggerText, triggerTextStyle, !selectedLabel && styles.placeholder]}>
          {selectedLabel || placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      {!!helperText && !errorText && (
        <Text style={styles.helper}>{helperText}</Text>
      )}
      {!!errorText && <Text style={styles.error}>{errorText}</Text>}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          {/* Stop propagation inside the card */}
          <Pressable style={[styles.card, modalCardStyle]} onPress={() => {}}>
            {searchable && (
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search…"
                style={styles.search}
                autoFocus
              />
            )}

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const selected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      optionStyle,
                      selected && (selectedOptionStyle || styles.optionSelected),
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        optionTextStyle,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>No results</Text>
                </View>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { fontSize: 14, color: "#333", marginBottom: 6 },
  trigger: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  triggerDisabled: { opacity: 0.6 },
  triggerError: { borderColor: "#cc3333" },
  triggerText: { fontSize: 16, color: "#111" },
  placeholder: { color: "#888" },
  chevron: { fontSize: 16, color: "#666", marginLeft: 8 },
  helper: { marginTop: 6, fontSize: 12, color: "#666" },
  error: { marginTop: 6, fontSize: 12, color: "#cc3333" },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    maxHeight: "70%",
    borderRadius: 14,
    backgroundColor: "#fff",
    padding: 12,
    elevation: 6,
  },
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: "#EEF4FF",
  },
  optionText: { fontSize: 16, color: "#111" },
  optionTextSelected: { fontWeight: "600" },

  emptyWrap: { padding: 14, alignItems: "center" },
  emptyText: { color: "#666" },
});

export default Dropdown;
