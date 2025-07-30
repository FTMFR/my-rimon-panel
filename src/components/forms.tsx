"use client";

import { Props } from "@/types/type";
import { useState } from "react";

export default function CustomForm({
  name,
  type,
  register,
  error,
}: Props) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative z-0 w-full mb-5 group">
      <input
        type={type}
        {...register(name)}
        name={name}
        id={name}
        className="block py-2.5 px-0 w-full text-sm text-gray bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#FE8660] peer"
        placeholder=" "
        required
      />
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {name}
      </label>

      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}
