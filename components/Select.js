import { useEffect, useRef, useState } from "react"

const Select = ({ options, name, placeholder, handleValue }) => {

    const input = useRef(null),
        dropdown = useRef(null),
        [params, setParams] = useState(options),
        [value, setValue] = useState('')

    const search = query => options.filter(option => option.label.substring(0, query.length).toLowerCase().indexOf(query.toLowerCase()) !== -1)

    const handleClick = param => {
        setValue(param.label)
        handleValue(param)
        dropdown.current.classList.add('hidden')
    }

    useEffect(() => {
        input.current.addEventListener('focus', ({ target: { value } }) => {
            dropdown.current.classList.remove('hidden')
            setParams(search(value))
        })

        // input.current.addEventListener('blur', () => {
        //     setTimeout(() => {
        //         dropdown.current.classList.add('hidden')
        //     }, 100)
        // })

        input.current.addEventListener('keyup', ({ target: { value } }) => {
            setParams(search(value))

            if (params.length == 1 && params[0].label.substring(0, params[0].label.length).toLowerCase() === value.toLowerCase()) {
                setValue(params[0].label)
            }
        })

        handleValue(search(value))

    }, [value])

    return (
        <div className="flex font-sen py-0.5 flex-col relative">
            <input
                ref={input}
                type='text'
                name={name}
                className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                placeholder={placeholder}
                autoComplete="off"
                value={value}
                onChange={({ target: { value } }) => setValue(value)}
            />
            <div ref={dropdown} className="hidden max-h-80 overflow-y-scroll bg-lff_100 border border-lff_600 mt-1 absolute top-full w-full md:w-1/2 text-sm text-lff_800">
                {params.map((param, i) => (
                    <option
                        value={param.value}
                        className="px-4 py-2 border-t border-lff_600 first:border-t-0 cursor-pointer hover:bg-lff_200 transition ease-in-out"
                        onClick={() => handleClick(param)}
                        key={i}
                    >
                        {param.label}
                    </option>
                )
                )}
            </div>
        </div>
    )
}

export default Select