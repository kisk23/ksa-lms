import { useEffect, useRef } from 'react';
import { useFormContext, type FieldValues } from 'react-hook-form';

interface AutoSaveWatcherProps<TFieldValues extends FieldValues = FieldValues> {
  onAutoSave: (data: TFieldValues) => Promise<void> | void;
  delay?: number;
}

export function AutoSaveWatcher<TFieldValues extends FieldValues = FieldValues>({
  onAutoSave,
  delay = 1500,
}: AutoSaveWatcherProps<TFieldValues>) {
  const { watch, trigger, getValues } = useFormContext<TFieldValues>();
  const lastSavedPayloadStr = useRef(JSON.stringify(getValues()));

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const subscription = watch((value) => {
      const currentStr = JSON.stringify(value);

      // Prevent unnecessary saves if form data hasn't actually changed
      if (currentStr === lastSavedPayloadStr.current) {
        return;
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        // Validate form rules via RHF before attempting background API save
        const isValid = await trigger();
        if (isValid) {
          lastSavedPayloadStr.current = currentStr;
          await onAutoSave(getValues());
        }
      }, delay);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [watch, trigger, getValues, onAutoSave, delay]);

  return null; // Headless component: zero DOM nodes, zero top-level re-renders
}
