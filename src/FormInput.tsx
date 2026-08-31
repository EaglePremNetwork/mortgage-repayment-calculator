type FormInputProps = {
  label: string;
  name: string;
  id: string;
  value: string;
  error: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  prefix?: string;
  suffix?: string;
};

export default function FormInput({
  label,
  name,
  id,
  value,
  error,
  onChange,
  onBlur,
  prefix,
  suffix,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-slate-500">
        {label}
      </label>
      <div
        className={`group flex h-10 rounded-sm outline-1 ${error ? "outline-red" : "outline-slate-900"}  focus-within:outline-0.5 focus-within:outline-lime`}
      >
        {prefix && (
          <span
            className={`flex items-center px-4 ${error ? "text-white bg-red" : "text-slate-700 bg-slate-100"}  group-focus-within:bg-lime group-focus-within:font-bold group-focus-within:text-slate-700`}
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-0 flex-1 outline-none px-4 font-bold hover:cursor-pointer"
          required
        />
        {suffix && (
          <span
            className={`flex items-center px-4 ${error ? "text-white bg-red" : "text-slate-700 bg-slate-100"}  group-focus-within:bg-lime group-focus-within:font-bold group-focus-within:text-slate-700`}
          >
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <span id={`${id}-error`} className="text-red">
          {error}
        </span>
      )}
    </div>
  );
}
