import { ClassAttributes, InputHTMLAttributes } from "react"
import { JSX } from "react/jsx-runtime"

interface TextInputProps {
  label: string
  type: string
  name: string
  id: string
}

const TextInput = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement> & TextInputProps) => {
  return (
    <label className="relative w-full md:w-[80%]">
      <input
        {...props}
        type={props.type}
        name={props.name}
        id={props.id}
        placeholder={' '}
        className="peer border-border dark:border-primary-100 border-primary-950 bg-transparent border rounded-md outline-none px-4 py-3 w-full focus:border-primary transition-colors duration-300"
      />
      <span
        className="absolute -top-0.5 dark:peer-focus:bg-darkBgColor left-5 peer-focus:-top-6 peer-focus:bg-primary-100 dark:peer-focus:bg-primary-950 peer-focus:left-2 peer-focus:scale-[0.9] peer-focus:text-primary text-primary-600 dark:text-primary-400 peer-focus:px-2 transition-all duration-300 peer-[&:not(:placeholder-shown)]:scale-[0.9] peer-[&:not(:placeholder-shown)]:-top-6 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:bg-primary-100 dark:peer-[&:not(:placeholder-shown)]:bg-primary-950 peer-[&:not(:placeholder-shown)]:text-primary peer-[&:not(:placeholder-shown)]:px-1">
        {props.label}
      </span>
    </label>
  )
}

export default TextInput
