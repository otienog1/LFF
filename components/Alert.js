const Alert = ({ alert }) => {
    return (
        <div className={`${alert.type == `error` ? `border-lff_danger text-lff_danger bg-red-100` : `border-lff_success text-lff_success bg-green-100`} flex space-x-4 border border-solid px-4 py-3 mb-8 relative font-mono w-full`} role="alert">
            <div>
                <span className={`${alert.type == 'error' ? '' : 'hidden'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 7.75V13" stroke="#E94F2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21.0802 8.58003V15.42C21.0802 16.54 20.4802 17.58 19.5102 18.15L13.5702 21.58C12.6002 22.14 11.4002 22.14 10.4202 21.58L4.48016 18.15C3.51016 17.59 2.91016 16.55 2.91016 15.42V8.58003C2.91016 7.46003 3.51016 6.41999 4.48016 5.84999L10.4202 2.42C11.3902 1.86 12.5902 1.86 13.5702 2.42L19.5102 5.84999C20.4802 6.41999 21.0802 7.45003 21.0802 8.58003Z" stroke="#E94F2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 16.2002V16.3002" stroke="#E94F2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
                <span className={`${alert.type == 'success' ? '' : 'hidden'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#3BBA5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#3BBA5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>

            <div className="flex flex-col">
                <span className="mb-1">{alert.title}</span>
                <span className="block sm:inline text-sm">{alert.message && Object.keys(alert.message).map((message, i) => <li key={i}>{alert.message[message]}</li>)}</span>
            </div>
        </div>
    )
}

export default Alert