import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { Input } from '@core/components/ui/Input'
import { Select } from '@core/components/ui/Select'

interface SelectOption {
  readonly value: string
  readonly label: string
}

type FieldType = 'text' | 'email' | 'number' | 'select' | 'textarea'

interface FormFieldProps<T extends FieldValues> {
  readonly name: Path<T>
  readonly control: Control<T>
  readonly label: string
  readonly type?: FieldType
  readonly options?: readonly SelectOption[]
  readonly rules?: RegisterOptions<T, Path<T>>
  readonly placeholder?: string
  readonly helperText?: string
  readonly disabled?: boolean
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  options = [],
  rules,
  placeholder,
  helperText,
  disabled,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message

        if (type === 'select') {
          return (
            <Select
              label={label}
              error={errorMessage}
              options={options as SelectOption[]}
              placeholder={placeholder}
              disabled={disabled}
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              name={field.name}
            />
          )
        }

        if (type === 'textarea') {
          return (
            <div className="flex flex-col gap-1.5">
              <label htmlFor={name} className="text-sm font-medium text-primary">
                {label}
              </label>
              <textarea
                id={name}
                className={[
                  'min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm text-primary transition-colors placeholder:text-muted focus:outline-2 focus:outline-offset-0 focus:outline-primary disabled:cursor-not-allowed disabled:opacity-50',
                  errorMessage ? 'border-destructive' : 'border-border',
                ].join(' ')}
                placeholder={placeholder}
                disabled={disabled}
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
              {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
              {!errorMessage && helperText && <p className="text-xs text-muted">{helperText}</p>}
            </div>
          )
        }

        return (
          <Input
            label={label}
            type={type}
            error={errorMessage}
            helperText={helperText}
            placeholder={placeholder}
            disabled={disabled}
            value={field.value as string}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            name={field.name}
          />
        )
      }}
    />
  )
}
