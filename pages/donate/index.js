import Head from 'next/head'
import Layout from '../../components/Layout'
import { useState, useEffect, useRef } from 'react'
import Alert from '../../components/Alert'
import { SEND_EMAIL } from '../../data/contact'
import { useMutation } from '@apollo/client'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import Logo from '../../components/Logo'
import ThankYou from '../../components/ThankYou'
import gsap from 'gsap'
import { v4 } from 'uuid'

const Index = () => {
    const [sent, setSent] = useState(false)
    const elem = useRef(null)
    const thk = useRef(null)

    useEffect(() => {
        if (sent) {
            gsap.to(thk.current, {
                duration: .2,
                opacity: 1,
                ease: 'power3.inOut'
            })
            setTimeout(() => setSent(false),
                5000)
        }
    }, [sent])
    return (
        <>
            <Layout preview>
                <Head>
                    <title>Donate 💚 | The Luigi Footprints Foundation</title>
                </Head>

                <div ref={elem} className="w-full px-4 md:w-1/2 mx-auto">
                    <Logo />
                    <DonationsForm sent={setSent} />
                    <div ref={thk} className={`${sent ? 'flex' : 'hidden'} opacity-0`}>
                        <ThankYou />
                    </div>
                    <script
                        src="https://ap-gateway.mastercard.com/checkout/version/62/checkout.js"
                        data-error="errorCallback"
                        data-cancel="cancelCallback"
                        data-complete="completeCallback">
                    </script>
                </div>

            </Layout>
        </>
    )
}

const DonationsForm = ({ sent }) => {
    const [firstName, setFirstName] = useState(''),
        [lastName, setLastName] = useState(''),
        [address, setAddress] = useState(''),
        [city, setCity] = useState(''),
        [state, setState] = useState(''),
        [postalCode, setPostalCode] = useState(''),
        [country, setCountry] = useState(''),
        [country_code, setCountry_code] = useState(''),
        [dial_code, setDial_code] = useState(''),
        [email, setEmail] = useState(''),
        [phone, setPhone] = useState(''),
        [expiryMonthValid, setExpiryMonthValid] = useState(false),
        [active, setActive] = useState('card'),
        [alerts, setAlerts] = useState({}),
        [btnDisabled, setBtnDisabled] = useState(true),
        [cardNumber, setCardNumber] = useState(''),
        [expiryMonth, setExpiryMonth] = useState(''),
        [expiryYear, setExpiryYear] = useState(''),
        [expiryMonthYear, setExpiryMonthYear] = useState(''),
        [cvn, setCvn] = useState(''),
        [sendEmail] = useMutation(SEND_EMAIL),
        [amount, setAmount] = useState('0.00'),
        [page, setPage] = useState(1),
        [paymentMethod, setPaymentMethod] = useState('card'),
        [paymentCurrency, setPaymentCurrency] = useState('USD'),
        [exchange_rate, setExchange_rate] = useState(''),
        [loading, setLoading] = useState(false)

    let form = useRef()

    const handleAmount = amount => {
        setAmount(amount)
        setBtnDisabled(false)
    }

    const handleInputAlerts = (payload) => {
        setAlerts(payload)
    }

    const handlePage = string => {
        switch (string) {
            case 'previous':
                if (page == 2) {
                    setPage(page - 1)
                }
                break

            case 'next':
                if (page == 1) {
                    setPage(page + 1)
                }
                break

            default:
                break;
        }
    }

    const handleDonation = async () => {
        setLoading(true)
        if (paymentMethod == 'card') {
            const data = {
                amount: {
                    totalAmount: amount,
                    currency: "USD"
                }
            }

        }
        else {
            await fetch('https://payutil.tk/mpesa/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone_number: `${dial_code}${phone}`,
                    amount: Math.ceil(amount),
                    reference_code: 'Donation',
                    description: "A donation to The Luigi Footprints Foundation"
                })
            }).then(response => response.json().then(data => {
                setLoading(false)
            }))
        }
    }

    const handleCheckout = async () => {
        let cred = btoa('merchant.LUIGI:7a5899249cc17d46c8b73d28b5a215b3'),
            url_sess = 'https://ap-gateway.mastercard.com/api/rest/version/62/merchant/LUIGI/session'
        await fetch(url_sess, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + cred,
                'Content-Type': 'application/json'
            }
        }).then(response => response.json().then(
            data => {
                Checkout.configure({
                    session: {
                        id: data
                    },
                    merchant: "LUIGI",
                    order: {
                        amount: amount,
                        currency: paymentCurrency,
                        description: "Donation to The Luigi Footprints Foundation",
                        id: v4(),
                        reference: v4()
                    },
                    transaction: {
                        reference: v4()
                    },
                    interaction: {
                        operation: "PURCHASE",
                        merchant: {
                            name: "Luigi Footprints Foundation",
                        },
                    },
                })
            }
        ))
    }

    // const exchangeRate = async () => {
    //     await fetch('https://payutil.tk/rates/kes', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             acquirerDetails: {
    //                 bin: 424315,
    //                 settlement: {
    //                     currencyCode: "840"
    //                 }
    //             },
    //             rateProductCode: "A",
    //             destinationCurrencyCode: "404",
    //             sourceAmount: "1",
    //             sourceCurrencyCode: "840"
    //         })
    //     }).then(
    //         response => response.json().then(
    //             data => setExchange_rate(data)
    //         )
    //     ).catch(
    //         e => console.log(e.message)
    //     )
    // }

    useEffect(() => {
        // exchangeRate()
        handleCheckout()
    }, [])

    return (
        <div ref={form} className="flex min-h-screen items-center py-28 md:py-8">
            <div className="w-full">

                <div className={`${page === 1 ? `block` : `hidden`}`}>
                    <DonationAmount
                        handleAmount={handleAmount}
                        amount={amount}
                        alert={alerts}
                        paymentCurrency={paymentCurrency}
                        setPaymentCurrency={setPaymentCurrency}
                        paymentMethod={paymentMethod}
                        active={active}
                        setActive={setActive}
                    />
                </div>

                <div className={`${page === 2 ? `block` : `hidden`}`}>
                    <PaymentInfo
                        name={{
                            first: firstName,
                            last: lastName
                        }}
                        alert={alerts}
                        amount={amount}
                        email={email}
                        phone={phone}
                        page={page}
                        paymentMethod={setPaymentMethod}
                        sent={sent}
                        active={active}
                        setActive={setActive}
                    />
                </div>

                <Navigation
                    page={page}
                    handlePage={handlePage}
                    amount={amount}
                    paymentInfo={{
                        name: `${firstName} ${lastName}`,
                        cardNumber: cardNumber,
                        expiryMonthYear: expiryMonthYear,
                        cvn: cvn
                    }}
                    handleInputAlerts={handleInputAlerts}
                    paymentCurrency={paymentCurrency}
                    paymentMethod={paymentMethod}
                    exchangeRate={exchange_rate.rate}
                    loading={loading}

                />
            </div>
        </div >
    )
}

const Navigation = ({
    page,
    handlePage,
    amount,
    paymentInfo,
    handleInputAlerts,
    paymentCurrency,
    paymentMethod,
    loading
}) => {

    let alerts = {
        title: 'Your attention is required. ',
        message: {},
        type: 'success'
    },
        error

    const isEmpty = str => (!str || str.length == 0)

    const next = () => {
        if (page == 1)
            if (isEmpty(amount) || amount <= 0) {
                alerts.message.amount = 'Please select or enter amount'
                alerts.type = 'error'
            }

        if (alerts.type == 'error') {
            if (Object.keys(alerts.message).length > 1)
                alerts.title += `There are ${Object.keys(alerts.message).length} errors with your submission`
            else
                alerts.title += 'There is an error with your sumbission'

            handleInputAlerts(alerts)
            return
        }
        handlePage('next')
        handleInputAlerts(alerts = {})
    }

    const previous = () => {
        handlePage('previous')
        handleInputAlerts(alerts = {})
    }

    const donate = async () => {
        if (page == 2)
            if (paymentMethod == 'mpesa') {
                for (let [key, value] of Object.entries(paymentInfo)) {
                    if (isEmpty(value)) {
                        if (key == 'name')
                            error = 'Name is required'
                        if (key == 'email')
                            error = 'Email is required'
                        if (key == 'phone')
                            error = 'Phone number is required'

                        alerts.message[`${key}`] = error
                        alerts.type = 'error'
                    }

                    if (alerts.type == 'error') {
                        if (Object.keys(alerts.message).length > 1)
                            alerts.title += `There are ${Object.keys(alerts.message).length} errors with your submission`
                        else
                            alerts.title += 'There is an error with your sumbission'

                        handleInputAlerts(alerts)
                        return
                    }
                }
            }

        if (paymentMethod == 'paypal')
            return;

        // handleDonation()
        Checkout.showLightbox()
        handleInputAlerts(alerts = {})
    }

    let amountF = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: paymentCurrency,
    })

    return (
        <>
            <div className={`flex ${page > 1 ? `justify-between` : `justify-end`} mt-20`}>
                <button
                    className={`${page > 1 ? `flex` : `hidden`} text-lff_800 flex font-sen items-center text-sm bg-transparentpy-3 space-x-2 w-48`}
                    onClick={() => previous()}
                >
                    <span className="">
                        <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.83984 1.35327L0.839844 9.35327L8.83984 17.3533" stroke="#3F3F3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <span className="h-4">back</span>
                </button>
                <button
                    className={`disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 donate-button text-lff_900 flex font-mono items-center py-5 px-8 space-x-2 border-solid border border-lff_800 w-auto justify-center bg-lff_400 hover:bg-lff_700 disabled:opacity-50 ${paymentMethod == 'paypal' ? 'hidden' : ''}`}
                    onClick={() => page == 2 ? donate() : next()}
                    disabled={loading ? true : false}
                >
                    {page == 2 ? (
                        <>
                            {
                                !loading ?
                                    (
                                        <span className="">
                                            <svg width="16" className='text-lff_800' height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.4135 13.8736C8.18683 13.9536 7.8135 13.9536 7.58683 13.8736C5.6535 13.2136 1.3335 10.4602 1.3335 5.79356C1.3335 3.73356 2.9935 2.06689 5.04016 2.06689C6.2535 2.06689 7.32683 2.65356 8.00016 3.56023C8.6735 2.65356 9.7535 2.06689 10.9602 2.06689C13.0068 2.06689 14.6668 3.73356 14.6668 5.79356C14.6668 10.4602 10.3468 13.2136 8.4135 13.8736Z" fill="#CCBD96" stroke="#CCBD96" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    )
                                    :
                                    (
                                        <span>
                                            <svg className="animate-spin h-5 w-5 text-lff_800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </span>
                                    )
                            }
                            <span className="">Donate <span className="underline underline-offset-4 text-lff_900">{
                                amountF.format(amount)
                            }</span></span>
                        </>
                    ) : (
                        <>
                            <span className="">next</span>
                            <span className="">
                                <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="8" height="16" fill="none" />
                                    <path d="M1.18457 13.6482L6.81656 8.00017L1.18457 2.35217" stroke="#665F4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </>
                    )}
                </button>
            </div>
        </>
    )
}

const DonationAmount = ({ handleAmount, amount, alert, paymentCurrency, setPaymentCurrency }) => {
    let amountInput = useRef()
    const [active, setActive] = useState('usd')

    const clearAmount = () => amountInput.current.value = ""

    const _amounts_usd = {
        'row1': ['10.00', '50.00', '100.00'],
        'row2': ['1000.00', '5000.00', '10000.00']
    }
    const _amounts_ksh = {
        'row1': ['1000.00', '5000.00', '10000.00'],
        'row2': ['20000.00', '50000.00', '100000.00']
    }

    let _amounts = {}

    if (active == 'usd') {
        _amounts = _amounts_usd
        setPaymentCurrency('USD')
    }
    else {
        _amounts = _amounts_ksh
        setPaymentCurrency('KES')
    }

    let amountF = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: paymentCurrency,
    })

    return (
        <>
            <div className='flex space-x-1 text-base'>
                <label className={`${active == `usd` ? `bg-lff_600` : ''} flex border border-solid border-lff_700 items-center py-1 px-4 cursor-pointer z-50 font-mono`}>
                    <input type={'radio'} className="form-radio text-lff_800 hidden" checked={active == 'usd' ? true : false} onChange={() => setActive('usd')} /><span className='text-center'>USD</span>
                </label>
                <label className={`${active == `kes` ? `bg-lff_600` : ''} flex border border-solid border-lff_700 items-center py-1 px-4 cursor-pointer z-50 font-mono`}>
                    <input type={'radio'} className="form-radio text-lff_800 hidden" checked={active == 'kes' ? true : false} onChange={() => setActive('kes')} /><span className='text-center'>KES</span>
                </label>
            </div>
            <div className="font-mono text-xl my-8 text-lff_900">Donation Amount: {amountF.format(amount)}</div>

            <div className={`${Object.keys(alert).length == 0 ? `hidden` : `flex`}`}>
                <Alert alert={alert} />
            </div>

            <div>
                <div className="flex text-center flex-wrap space-x-4 mb-4 flex-grow">
                    {_amounts.row1.map((_amount, i) => (
                        <div
                            onClick={() => { handleAmount(_amount); clearAmount() }}
                            className={
                                `${Number(amount) === Number(_amount) ? `bg-lff_600 text-lff_900 border-lff_700` : `bg-transparent text-lff_700 border-lff_700`} 
                                hover:border-lff_800 transition-all duration-150 ease-in-out 
                                flex font-mono text-base  py-4 border border-solid  justify-center cursor-pointer tracking-widest flex-grow z-50`
                            }
                            key={i}
                        >{amountF.format(_amount)}</div>

                    ))}
                </div>
                <div className="flex text-center flex-wrap space-x-4 flex-grow">

                    {_amounts.row2.map((_amount, i) => (
                        <div
                            onClick={() => { handleAmount(_amount); clearAmount() }}
                            className={
                                `${Number(amount) === Number(_amount) ? `bg-lff_600 text-lff_900 border-lff_700 ` : `bg-transparent text-lff_700 border-lff_700`} 
                                hover:border-lff_800 transition-all duration-150 ease-in-out 
                                flex font-mono text-base  py-4 border border-solid  justify-center cursor-pointer tracking-widest flex-grow z-50`
                            }
                            key={i}
                        >{amountF.format(_amount)}</div>

                    ))}
                </div>
            </div>

            <div className="w-full z-50 relative">
                {/* <span className="block text-lff_800 font-sorts mt-16 text-xl">Other Amount</span> */}
                <div className="flex font-sen text-base mt-16">
                    <span className="-mr-1 py-1.5">$</span>
                    <input
                        ref={amountInput}
                        className="appearance-none font-mono bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 px-4 leading-tight focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                        type="number"
                        placeholder="Other Amount"
                        min="0.00"
                        step="0.01"
                        onChange={e => handleAmount(`${e.target.value}`)}
                    />
                </div>
            </div>
        </>
    )
}

const PaymentInfo = ({
    name,
    alert,
    email,
    phone,
    amount,
    page,
    paymentMethod,
    sent,
    active,
    setActive
}) => {
    const paypal = useRef(null)
    const mpesa = useRef(null)

    useEffect(() => {
        paypal.current.children[0].style.width = '50%'

        // if (active == 'paypal' && page == 2) {
        //     document.querySelector('.donate-button').classList.add('hidden')
        // }
        // else {
        //     document.querySelector('.donate-button').classList.remove('hidden')
        // }

        paymentMethod(active)

    }, [active])

    return (
        <>
            <div className="font-sorts text-3xl my-10 text-lff_900">Payment method</div>

            <div className={`${Object.keys(alert).length == 0 ? `hidden` : `flex`}`}>
                <Alert alert={alert} />
            </div>

            <div className="flex flex-wrap md:flex-nowrap mb-8 space-y-4 md:space-y-0 md:space-x-8">
                <label className={`${active == `card` ? `bg-lff_700` : ''} flex border border-solid border-lff_800 items-center w-full md:w-1/3 px-6 py-4 justify-between cursor-pointer z-50`}>
                    <span className="flex items-center">
                        <span>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 12.7573H33" stroke="#ccbd96" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 24.7573H12" stroke="#ccbd96" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15.75 24.7573H21.75" stroke="#ccbd96" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.66 5.25732H26.325C31.665 5.25732 33 6.57732 33 11.8423V24.1573C33 29.4223 31.665 30.7423 26.34 30.7423H9.66C4.335 30.7573 3 29.4373 3 24.1723V11.8423C3 6.57732 4.335 5.25732 9.66 5.25732Z" stroke="#ccbd96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span className="ml-2">
                            <span className="flex font-sorts mb-0.5">Credit or debit card</span>
                            <span className="flex space-x-1">
                                <span>
                                    <svg width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0)">
                                            <path d="M20.48 16H1.92C0.8576 16 0 15.1424 0 14.08V1.92C0 0.8576 0.8576 0 1.92 0H20.48C21.5424 0 22.4 0.8576 22.4 1.92V14.08C22.4 15.1424 21.5424 16 20.48 16Z" fill="#F8F8F8" />
                                            <path d="M20.48 0.64C21.184 0.64 21.76 1.216 21.76 1.92V14.08C21.76 14.784 21.184 15.36 20.48 15.36H1.92C1.216 15.36 0.64 14.784 0.64 14.08V1.92C0.64 1.216 1.216 0.64 1.92 0.64H20.48ZM20.48 0H1.92C0.8576 0 0 0.8576 0 1.92V14.08C0 15.1424 0.8576 16 1.92 16H20.48C21.5424 16 22.4 15.1424 22.4 14.08V1.92C22.4 0.8576 21.5424 0 20.48 0Z" fill="#E7E7E7" />
                                            <path d="M9.40136 5.25434L8.22376 10.7199H9.64456L10.8222 5.25434H9.40136ZM18.5534 5.25434H17.3438C17.075 5.25434 16.8382 5.41434 16.7422 5.65114L14.6046 10.7199H16.0958L16.3902 9.90074H18.2142L18.387 10.7199H19.7054L18.5534 5.25434V5.25434ZM16.8062 8.78074L17.5486 6.73274L17.9774 8.78074H16.8062ZM7.29576 5.25434L5.81736 8.97274L5.21576 5.81114C5.13896 5.45274 4.87016 5.24794 4.55656 5.24794H2.15016L2.11816 5.40794C2.61736 5.51674 3.17416 5.68954 3.51976 5.86874C3.72456 5.99034 3.78856 6.08634 3.85256 6.35514L4.98536 10.7263H6.48296L8.79336 5.26074H7.29576V5.25434V5.25434ZM12.691 6.77754C12.691 6.58554 12.883 6.36794 13.2926 6.32314C13.4974 6.30394 14.0606 6.27834 14.6942 6.57274L14.9438 5.40794C14.5982 5.28634 14.1566 5.17114 13.619 5.17114C12.2174 5.17114 11.2254 5.91354 11.2126 6.98234C11.1998 7.76954 11.923 8.21114 12.4542 8.47354C13.0046 8.74234 13.1966 8.91514 13.1902 9.15194C13.1902 9.51674 12.7486 9.68314 12.339 9.68954C11.6286 9.70234 11.2062 9.49754 10.8798 9.34394L10.6238 10.5407C10.9566 10.6943 11.571 10.8223 12.211 10.8351C13.7086 10.8351 14.6814 10.0991 14.6942 8.96634C14.6814 7.50074 12.6782 7.41114 12.691 6.77754Z" fill="#0F2496" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0">
                                                <rect width="22.4" height="16" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                                <span>
                                    <svg width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0)">
                                            <path d="M21.0796 16H2.51961C1.45721 16 0.599609 15.1424 0.599609 14.08V1.92C0.599609 0.8576 1.45721 0 2.51961 0H21.0796C22.142 0 22.9996 0.8576 22.9996 1.92V14.08C22.9996 15.1424 22.142 16 21.0796 16Z" fill="#F8F8F8" />
                                            <path d="M21.0796 0.64C21.7836 0.64 22.3596 1.216 22.3596 1.92V14.08C22.3596 14.784 21.7836 15.36 21.0796 15.36H2.51961C1.81561 15.36 1.23961 14.784 1.23961 14.08V1.92C1.23961 1.216 1.81561 0.64 2.51961 0.64H21.0796ZM21.0796 0H2.51961C1.45721 0 0.599609 0.8576 0.599609 1.92V14.08C0.599609 15.1424 1.45721 16 2.51961 16H21.0796C22.142 16 22.9996 15.1424 22.9996 14.08V1.92C22.9996 0.8576 22.142 0 21.0796 0Z" fill="#E7E7E7" />
                                            <path d="M18.2514 8.00093C18.2514 10.2098 16.4626 11.9987 14.2614 11.9987C12.0602 11.9987 10.2715 10.2099 10.2715 8.00093C10.2715 5.79197 12.0604 4.00317 14.2614 4.00317C16.4623 4.00317 18.2514 5.79197 18.2514 8.00093Z" fill="#F79F1A" />
                                            <path d="M13.3277 8.00075C13.3277 10.2096 11.5388 11.9985 9.33767 11.9985C7.13658 11.9985 5.34766 10.2097 5.34766 8.00075C5.34766 5.79179 7.13646 4.00293 9.33767 4.00293C11.5389 4.00293 13.3277 5.79173 13.3277 8.00069V8.00075Z" fill="#EA001B" />
                                            <path d="M11.7955 4.85107C10.8621 5.58215 10.271 6.71776 10.271 8.00115C10.271 9.28454 10.8699 10.42 11.7955 11.1511C12.7288 10.42 13.32 9.28441 13.32 8.00102C13.32 6.71763 12.7288 5.58215 11.7955 4.85107Z" fill="#FF5F01" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0">
                                                <rect width="22.4" height="16" fill="white" transform="translate(0.599609)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                                <span>
                                    <svg width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0)">
                                            <path d="M20.6802 16H2.1202C1.0578 16 0.200195 15.1424 0.200195 14.08V1.92C0.200195 0.8576 1.0578 0 2.1202 0H20.6802C21.7426 0 22.6002 0.8576 22.6002 1.92V14.08C22.6002 15.1424 21.7426 16 20.6802 16Z" fill="#016FD0" />
                                            <path d="M20.6802 0.64C21.3842 0.64 21.9602 1.216 21.9602 1.92V14.08C21.9602 14.784 21.3842 15.36 20.6802 15.36H2.1202C1.4162 15.36 0.840195 14.784 0.840195 14.08V1.92C0.840195 1.216 1.4162 0.64 2.1202 0.64H20.6802ZM20.6802 0H2.1202C1.0578 0 0.200195 0.8576 0.200195 1.92V14.08C0.200195 15.1424 1.0578 16 2.1202 16H20.6802C21.7426 16 22.6002 15.1424 22.6002 14.08V1.92C22.6002 0.8576 21.7426 0 20.6802 0Z" fill="#EAEAEA" />
                                            <path d="M4.94017 11.9039V8.57972H8.45102L8.82772 9.07194L9.21685 8.57965H21.9603V11.6747C21.9603 11.6747 21.6271 11.9006 21.2416 11.9039H14.1853L13.7606 11.3798V11.9039H12.369V11.0093C12.369 11.0093 12.1789 11.1343 11.7679 11.1343H11.2942V11.9039H9.18709L8.81089 11.401L8.42901 11.9039H4.94017ZM0.840332 6.07431L1.63201 4.22388H3.00123L3.45051 5.26042V4.22388H5.15252L5.42004 4.97306L5.67918 4.22388H13.3195V4.60052C13.3195 4.60052 13.7212 4.22388 14.3813 4.22388L16.8603 4.23258L17.3018 5.25549V4.22388H18.7262L19.1182 4.81152V4.22388H20.5556V7.54804H19.1182L18.7425 6.95853V7.54804H16.6499L16.4394 7.02401H15.8768L15.6698 7.54804H14.2506C13.6826 7.54804 13.3196 7.17914 13.3196 7.17914V7.54804H11.1798L10.7552 7.02401V7.54804H2.79841L2.58811 7.02401H2.02728L1.81851 7.54804H0.840332V6.07431Z" fill="white" />
                                            <path d="M1.97064 4.63009L0.908691 7.09716H1.60002L1.79599 6.60308H2.93512L3.13 7.09716H3.83669L2.7757 4.63009H1.97058H1.97064ZM2.36354 5.20417L2.71074 6.06753H2.01532L2.36348 5.20423L2.36354 5.20417ZM3.90978 7.09671V4.62964L4.89218 4.63329L5.4637 6.22394L6.02146 4.6297H6.99612V7.09671H6.37884V5.27885L5.7245 7.09671H5.18319L4.527 5.27885V7.09671H3.90972H3.90978ZM7.41845 7.09671V4.62964H9.43272V5.18151H8.0422V5.60353H9.40028V6.12289H8.0422V6.56116H9.43272V7.09671H7.41845V7.09671ZM9.7901 4.63009V7.09716H10.4074V6.22068H10.6672L11.4074 7.09716H12.1617L11.3495 6.18823C11.6828 6.16007 12.0266 5.87425 12.0266 5.43047C12.0266 4.9113 11.6188 4.63009 11.1637 4.63009H9.7901V4.63009ZM10.4074 5.18189H11.1129C11.2822 5.18189 11.4054 5.31418 11.4054 5.44161C11.4054 5.60551 11.2458 5.70132 11.1221 5.70132H10.4074V5.18189V5.18189ZM12.9089 7.09677H12.2787V4.62964H12.9089V7.09671V7.09677ZM14.4033 7.09677H14.2673C13.6091 7.09677 13.2094 6.57857 13.2094 5.87335C13.2094 5.15073 13.6046 4.62964 14.4359 4.62964H15.1181V5.21396H14.4109C14.0735 5.21396 13.8349 5.47706 13.8349 5.87943C13.8349 6.35719 14.1077 6.55783 14.5008 6.55783H14.6633L14.4034 7.09671L14.4033 7.09677ZM15.7466 4.63009L14.6846 7.09716H15.376L15.5719 6.60308H16.7111L16.906 7.09716H17.6126L16.5516 4.63009H15.7465H15.7466ZM16.1395 5.20417L16.4867 6.06753H15.7913L16.1394 5.20423L16.1395 5.20417ZM17.6847 7.09671V4.62964H18.4695L19.4715 6.17972V4.62964H20.0888V7.09671H19.3294L18.3019 5.50612V7.09671H17.6847V7.09671ZM5.40418 11.4142V8.94708H7.41845V9.49889H6.02799V9.9209H7.38594V10.4403H6.02799V10.8785H7.41845V11.4142L5.40418 11.4142V11.4142ZM15.2741 11.4142V8.94708H17.2883V9.49889H15.8978V9.9209H17.2494V10.4403H15.8978V10.8785H17.2883V11.4142L15.2741 11.4142V11.4142ZM7.4966 11.4142L8.47733 10.1958L7.47336 8.94708H8.25103L8.84904 9.71911L9.44904 8.94708H10.1962L9.2054 10.1807L10.1879 11.4142H9.41032L8.82972 10.6544L8.26325 11.4142H7.49666L7.4966 11.4142ZM10.2611 8.94746V11.4145H10.8947V10.6355H11.5444C12.0942 10.6355 12.5109 10.344 12.5109 9.77722C12.5109 9.30772 12.1841 8.94746 11.6247 8.94746H10.2611V8.94746ZM10.8947 9.50541H11.579C11.7566 9.50541 11.8835 9.61421 11.8835 9.78945C11.8835 9.95412 11.7572 10.0735 11.577 10.0735H10.8947V9.50541V9.50541ZM12.779 8.94701V11.4142H13.3962V10.5377H13.6561L14.3962 11.4142H15.1506L14.3385 10.5052C14.6717 10.4771 15.0156 10.1912 15.0156 9.74746C15.0156 9.22829 14.6078 8.94701 14.1526 8.94701H12.779V8.94701ZM13.3962 9.49889H14.1018C14.2711 9.49889 14.3943 9.63117 14.3943 9.7586C14.3943 9.92244 14.2347 10.0183 14.111 10.0183H13.3962V9.49889ZM17.5742 11.4142V10.8785H18.8096C18.9923 10.8785 19.0715 10.7798 19.0715 10.6716C19.0715 10.5679 18.9926 10.463 18.8096 10.463H18.2513C17.7661 10.463 17.4958 10.1676 17.4958 9.7241C17.4958 9.32852 17.7433 8.94701 18.4644 8.94701H19.6665L19.4065 9.50215H18.3669C18.1682 9.50215 18.107 9.60634 18.107 9.70586C18.107 9.80813 18.1826 9.9209 18.3344 9.9209H18.9192C19.4601 9.9209 19.6949 10.2275 19.6949 10.6289C19.6949 11.0606 19.4333 11.4142 18.8897 11.4142H17.5742H17.5742ZM19.8398 11.4142V10.8785H21.0751C21.2579 10.8785 21.337 10.7798 21.337 10.6716C21.337 10.5679 21.2581 10.463 21.0751 10.463H20.5169C20.0316 10.463 19.7614 10.1676 19.7614 9.7241C19.7614 9.32852 20.0089 8.94701 20.7299 8.94701H21.932L21.6721 9.50215H20.6324C20.4337 9.50215 20.3725 9.60634 20.3725 9.70586C20.3725 9.80813 20.448 9.9209 20.5999 9.9209H21.1847C21.7256 9.9209 21.9603 10.2275 21.9603 10.6289C21.9603 11.0606 21.6988 11.4142 21.1552 11.4142H19.8397H19.8398Z" fill="#016FD0" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0">
                                                <rect width="22.4" height="16" fill="white" transform="translate(0.200195)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                                <span>
                                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0)">
                                            <path d="M1.31152 0.639893H22.6235V15.3599H1.31152V0.639893Z" fill="white" />
                                            <path d="M22.5952 14.6V9.45288C22.5952 9.45288 16.8154 13.531 6.22949 15.3573H21.4382C22.0881 15.3373 22.4675 15.1256 22.5952 14.6V14.6Z" fill="#EF7D00" />
                                            <path d="M12.6008 5.34082C11.7324 5.34082 11.0278 6.01922 11.0278 6.85647C11.0278 7.74658 11.7018 8.41199 12.6008 8.41199C13.4773 8.41199 14.1693 7.73775 14.1693 6.87394C14.1693 6.01519 13.4819 5.34082 12.6007 5.34082H12.6008Z" fill="url(#paint0_radial)" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M2.82568 5.39624H3.67132C4.60386 5.39624 5.25436 6.00161 5.25442 6.87233C5.25442 7.30657 5.05512 7.7266 4.71919 8.00525C4.43599 8.23975 4.11324 8.34548 3.6669 8.34548H2.82568V5.39624ZM3.55592 7.84628C3.92789 7.84628 4.162 7.77537 4.34376 7.6114C4.5428 7.43514 4.66146 7.15156 4.66146 6.86811C4.66146 6.58523 4.5428 6.31131 4.34376 6.13435C4.15304 5.96206 3.92789 5.89563 3.55592 5.89563H3.4013V7.84634H3.55592V7.84628Z" fill="#05171D" />
                                            <path d="M5.5196 5.39615H6.09425V8.3454H5.51953V5.39615H5.5196ZM7.50123 6.52748C7.15576 6.39948 7.05419 6.31513 7.05419 6.15653C7.05419 5.97061 7.23512 5.82924 7.48318 5.82924C7.6556 5.82924 7.79717 5.89989 7.94802 6.06745L8.2483 5.67449C8.00069 5.45733 7.70443 5.34693 7.38129 5.34693C6.85995 5.34693 6.46161 5.70969 6.46161 6.19135C6.46161 6.59858 6.64721 6.8062 7.18693 7.00133C7.41265 7.0805 7.52741 7.1333 7.58501 7.16946C7.70002 7.2446 7.75768 7.35032 7.75768 7.4741C7.75768 7.71327 7.56734 7.88997 7.31051 7.88997C7.03633 7.88997 6.81534 7.75301 6.68267 7.49657L6.3116 7.85516C6.57637 8.24383 6.89489 8.41682 7.3331 8.41682C7.93016 8.41682 8.35006 8.01823 8.35006 7.44799C8.35006 6.97906 8.15602 6.76664 7.50123 6.52748V6.52748ZM8.53131 6.87224C8.53131 7.73996 9.21253 8.41202 10.0885 8.41202C10.3362 8.41202 10.5485 8.36306 10.8096 8.23973V7.5628C10.5794 7.79288 10.3759 7.88556 10.1148 7.88556C9.5356 7.88556 9.12402 7.46527 9.12402 6.86796C9.12402 6.3022 9.54847 5.85541 10.0885 5.85541C10.3623 5.85541 10.5705 5.95269 10.8096 6.18706V5.51007C10.5575 5.38226 10.3493 5.32959 10.1016 5.32959C9.23013 5.32959 8.53131 6.01522 8.53131 6.87224V6.87224ZM15.4708 7.37733L14.6836 5.39615H14.0555L15.3076 8.42085H15.6169L16.8909 5.39615H16.2675L15.4708 7.37727V7.37733ZM17.1524 8.34546H18.7842V7.84626H17.7273V7.04959H18.7437V6.55013H17.7273V5.89561H18.7842V5.39615H17.1523V8.34546H17.1524Z" fill="#05171D" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M20.0178 5.39624C20.6816 5.39624 21.0614 5.71413 21.0614 6.26664C21.0614 6.7181 20.823 7.01449 20.3889 7.10325L21.3183 8.34556H20.6106L19.8149 7.16028H19.7396V8.34556H19.1641V5.39624H20.0178ZM19.7396 6.75375H19.907C20.2752 6.75375 20.4697 6.59394 20.4697 6.29788C20.4697 6.0109 20.2752 5.86011 19.9162 5.86011H19.7396V6.75375V6.75375Z" fill="#05171D" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M21.3698 5.53589C21.4331 5.53589 21.4676 5.56392 21.4676 5.61563C21.4676 5.65179 21.4475 5.67867 21.4111 5.68834L21.4975 5.79573H21.4204L21.3477 5.69467V5.79573H21.2861V5.53589H21.3698V5.53589ZM21.3477 5.65096H21.3592C21.3897 5.65096 21.4059 5.63944 21.406 5.61659C21.406 5.59451 21.3905 5.58338 21.3598 5.58338H21.3477V5.65096V5.65096Z" fill="#1D1D1B" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M21.1553 5.66524C21.1552 5.63542 21.161 5.60587 21.1723 5.57829C21.1837 5.55072 21.2004 5.52566 21.2215 5.50456C21.2425 5.48347 21.2676 5.46675 21.2952 5.45536C21.3227 5.44398 21.3523 5.43816 21.3821 5.43823C21.5054 5.43823 21.6061 5.54082 21.6061 5.66524C21.6061 5.79004 21.5054 5.89225 21.3821 5.89225C21.3523 5.89228 21.3227 5.88643 21.2952 5.87503C21.2677 5.86364 21.2426 5.84691 21.2216 5.82582C21.2005 5.80473 21.1838 5.77969 21.1724 5.75214C21.161 5.72458 21.1552 5.69505 21.1553 5.66524V5.66524ZM21.2 5.66582C21.2 5.76854 21.2811 5.85154 21.3818 5.85154C21.4797 5.85154 21.5604 5.76783 21.5604 5.66582C21.5604 5.56367 21.4796 5.47958 21.3818 5.47958C21.2805 5.47958 21.2 5.56207 21.2 5.66582V5.66582Z" fill="#1D1D1B" />
                                            <path d="M7.98193 9.12061L8.75154 9.92681V9.16272H8.8615V10.1938L8.09208 9.38928V10.1496H7.98193V9.12061Z" fill="#1D1D1B" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M7.97119 10.1601V9.09497C7.97119 9.09497 8.70682 9.86566 8.74067 9.90144V9.15244H8.87098V10.2195L8.10169 9.41484V10.1601H7.97119ZM8.76173 9.95289C8.76173 9.95289 8.02591 9.18169 7.9918 9.14649V10.1394H8.08159V9.36358C8.08159 9.36358 8.81658 10.1331 8.85063 10.1688V9.17279H8.76173V9.95295V9.95289Z" fill="#1D1D1B" />
                                            <path d="M9.39404 9.16284H9.90534V9.26479H9.50367V9.5583H9.89363V9.66019H9.50367V10.0474H9.90534V10.1497H9.39404V9.16284V9.16284Z" fill="#1D1D1B" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.38379 9.15234H9.91601V9.27561H9.51448V9.54806H9.90411V9.66985H9.51448V10.037H9.91601V10.16H9.38379V9.15234V9.15234ZM9.8954 9.2543V9.17257H9.40433V10.1392H9.8954V10.0576H9.49349V9.64969H9.8835V9.56828H9.49355V9.2543H9.8954V9.2543Z" fill="#1D1D1B" />
                                            <path d="M10.6815 10.1497H10.5714V9.26479H10.3335V9.16284H10.9223V9.26479H10.6816V10.1497H10.6815Z" fill="#1D1D1B" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10.3232 9.15241H10.9332V9.27567H10.6923V10.16H10.5618V9.27561H10.3233V9.15234L10.3232 9.15241ZM10.9128 9.25436V9.17263H10.3446V9.25436H10.5825V10.1392H10.6719V9.25436H10.9128Z" fill="#1D1D1B" />
                                            <path d="M11.6586 9.90231L11.978 9.11133L12.2973 9.90231L12.5564 9.16278H12.676L12.2973 10.2004L11.978 9.40554L11.6586 10.2004L11.2808 9.16278H11.3997L11.6586 9.90231V9.90231Z" fill="#1D1D1B" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.659 9.87309L11.9687 9.10765L11.9779 9.08423C11.9779 9.08423 12.2772 9.8258 12.2965 9.87309C12.3132 9.82522 12.5491 9.15245 12.5491 9.15245H12.6902L12.2974 10.2299C12.2974 10.2299 11.9958 9.47892 11.9779 9.43354C11.96 9.47892 11.6585 10.2299 11.6585 10.2299L11.2656 9.15239H11.4064L11.659 9.87309V9.87309ZM11.9779 9.13946C11.96 9.1833 11.668 9.90605 11.668 9.90605L11.6579 9.9314L11.392 9.17261H11.2951C11.305 9.19885 11.6418 10.1241 11.6587 10.1718C11.6775 10.1249 11.9779 9.37837 11.9779 9.37837C11.9779 9.37837 12.2779 10.1249 12.2966 10.1718C12.4183 9.83883 12.5397 9.50577 12.6608 9.17261H12.5635C12.5586 9.18624 12.2978 9.9314 12.2978 9.9314C12.2978 9.9314 11.9958 9.1833 11.9779 9.13946V9.13946ZM13.5827 10.1667C13.8636 10.1667 14.097 9.94125 14.097 9.65728C14.097 9.37466 13.8636 9.14586 13.5827 9.14586C13.3009 9.14586 13.0684 9.37466 13.0684 9.65728C13.0684 9.94125 13.3009 10.1667 13.5827 10.1667V10.1667ZM13.5826 10.0642C13.3586 10.0642 13.1779 9.8784 13.1779 9.656C13.1779 9.4322 13.3563 9.24743 13.5826 9.24749C13.8089 9.24749 13.9867 9.4322 13.9867 9.656C13.9867 9.87834 13.8065 10.0642 13.5826 10.0642Z" fill="#1D1D1B" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M13.5823 10.1767C13.2931 10.1767 13.0576 9.9435 13.0576 9.65716C13.0576 9.36903 13.2931 9.1355 13.5823 9.1355C13.8715 9.1355 14.1069 9.3691 14.1069 9.65716C14.1069 9.9435 13.8714 10.1767 13.5823 10.1767ZM13.5823 9.15611C13.3041 9.15611 13.0778 9.38062 13.0778 9.65723C13.0778 9.93243 13.3041 10.1562 13.5823 10.1562C13.8601 10.1562 14.0868 9.93243 14.0868 9.65716C14.0868 9.38068 13.86 9.15604 13.5823 9.15604V9.15611Z" fill="#1D1D1B" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M13.5821 10.0747C13.3535 10.0747 13.167 9.8877 13.167 9.65609C13.167 9.42531 13.3535 9.23766 13.5821 9.23766C13.8106 9.23766 13.9962 9.42531 13.9962 9.65609C13.9962 9.8877 13.8106 10.0746 13.5821 10.0746V10.0747ZM13.5821 9.25807C13.3645 9.25807 13.1879 9.43683 13.1879 9.65609C13.1879 9.87548 13.3645 10.0544 13.5821 10.0544C13.7997 10.0544 13.9757 9.87554 13.9757 9.65609C13.9757 9.43689 13.7996 9.25814 13.5821 9.25814V9.25807ZM14.5731 10.1497H14.6827V9.71625H14.7106L15.0084 10.1497H15.1434L14.8294 9.70729C14.9816 9.6943 15.0765 9.58691 15.0765 9.43503C15.0765 9.21283 14.9027 9.16284 14.7156 9.16284H14.5731V10.1497V10.1497ZM14.7169 9.61948H14.6827V9.26473H14.7156C14.8477 9.26473 14.9668 9.28092 14.9668 9.44278C14.9668 9.59606 14.841 9.61942 14.7169 9.61942V9.61948Z" fill="#1D1D1B" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M14.5635 9.15241H14.5738V9.15234H14.7164C14.9663 9.15234 15.0876 9.2445 15.0876 9.4349C15.0876 9.58678 14.9929 9.69321 14.8474 9.71318C14.8631 9.73602 15.1643 10.16 15.1643 10.16H15.144L15.0009 10.1554C15.0009 10.1554 14.7108 9.73397 14.7108 9.72649H14.6939V10.16H14.5635V9.15241V9.15241ZM15.067 9.4349C15.067 9.25609 14.9553 9.17263 14.7163 9.17263C14.7163 9.17263 14.6016 9.17263 14.5838 9.1725V10.1392H14.673V9.70588H14.6834L14.7193 9.71036C14.7193 9.71036 15.0093 10.1317 15.0093 10.1392H15.1245L14.811 9.69878L14.8292 9.69705C14.9738 9.68489 15.067 9.58166 15.067 9.4349V9.4349Z" fill="#1D1D1B" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M14.6724 9.25439H14.7156C14.8422 9.25439 14.9771 9.26879 14.9771 9.44287C14.9771 9.60819 14.8381 9.62956 14.7168 9.62956H14.6724V9.25439ZM14.9563 9.44287C14.9563 9.28787 14.8423 9.27577 14.7157 9.27577H14.6932V9.60883H14.7168C14.8354 9.60883 14.9563 9.58918 14.9563 9.44287V9.44287Z" fill="#1D1D1B" />
                                            <path d="M16.1399 9.16284H16.2878L15.8245 9.62262L16.3033 10.1497H16.1515L15.747 9.69686L15.7195 9.72374V10.1497H15.6094V9.16284H15.7194V9.58543L16.1399 9.16284H16.1399Z" fill="#1D1D1B" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M16.1358 9.15234H16.3121C16.3121 9.15234 15.8524 9.60866 15.838 9.62281C15.8516 9.6367 16.3269 10.16 16.3269 10.16H16.3033L16.1439 10.1565C16.1439 10.1565 15.7601 9.72642 15.7462 9.71145L15.7457 9.7119C15.7392 9.7181 15.7311 9.72585 15.73 9.72533V10.1599H15.5996V9.15234H15.73V9.56079C15.7618 9.52789 16.1358 9.15234 16.1358 9.15234H16.1358ZM15.8101 9.62198C15.8101 9.62198 16.2297 9.20578 16.2626 9.17257H16.1438C16.1381 9.17865 15.7093 9.61052 15.7093 9.61052V9.17257H15.6202V10.1392H15.7092C15.7092 10.1196 15.7121 9.71676 15.7121 9.71676L15.7474 9.68149L15.7543 9.68982C15.7543 9.68982 16.1515 10.134 16.1515 10.1392H16.2801C16.251 10.1068 15.81 9.62198 15.81 9.62198H15.8101Z" fill="#1D1D1B" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M2.7198 0H21.2798C22.3422 0 23.1998 0.8576 23.1998 1.92V14.08C23.1998 15.1424 22.3422 16 21.2798 16H2.7198C1.6574 16 0.799805 15.1424 0.799805 14.08V1.92C0.799805 0.8576 1.6574 0 2.7198 0ZM22.5598 1.92C22.5598 1.216 21.9838 0.64 21.2798 0.64H2.7198C2.0158 0.64 1.4398 1.216 1.4398 1.92V14.08C1.4398 14.784 2.0158 15.36 2.7198 15.36H21.2798C21.9838 15.36 22.5598 14.784 22.5598 14.08V1.92Z" fill="#E7E7E7" />
                                        </g>
                                        <defs>
                                            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12.5986 6.87641) scale(1.55326 1.5185)">
                                                <stop offset="0.006" stopColor="#FFF2E8" />
                                                <stop offset="0.096" stopColor="#FEEDDF" />
                                                <stop offset="0.244" stopColor="#FDE1C7" />
                                                <stop offset="0.43" stopColor="#FACD9F" />
                                                <stop offset="0.648" stopColor="#F6B168" />
                                                <stop offset="0.89" stopColor="#F08E22" />
                                                <stop offset="1" stopColor="#EE7D00" />
                                            </radialGradient>
                                            <clipPath id="clip0">
                                                <rect width="22.4" height="16" fill="white" transform="translate(0.799805)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                            </span>
                        </span>
                    </span>
                    <input type="radio" className="form-radio text-lff_800 hidden" name="radio" value="1" checked={active == 'card' ? true : false} onChange={() => setActive('card')} />
                </label>
                <label className={`${active == `paypal` ? `bg-lff_700` : ''} flex border border-solid border-lff_800 items-center w-full md:w-1/3 px-6 py-4 justify-between cursor-pointer z-50`}>
                    <span className="flex items-center">
                        <span>
                            <svg width="31" height="36" viewBox="0 0 31 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M27.4755 9.72632C27.4429 9.93525 27.4055 10.1488 27.3635 10.3683C25.9197 17.7812 20.9801 20.342 14.6713 20.342H11.4592C10.6876 20.342 10.0375 20.9023 9.9173 21.6633L8.27271 32.0934L7.80699 35.05C7.72879 35.5495 8.11397 36.0001 8.6182 36.0001H14.3153C14.99 36.0001 15.5631 35.5098 15.6693 34.8445L15.7253 34.5551L16.798 27.7479L16.8668 27.3744C16.9719 26.7068 17.5461 26.2166 18.2208 26.2166H19.0728C24.5925 26.2166 28.9135 23.9755 30.1764 17.4906C30.704 14.7815 30.4309 12.5194 29.0349 10.9285C28.6124 10.4488 28.0883 10.0508 27.4755 9.72632Z" fill="#179BD7" />
                                <path d="M25.9654 9.12395C25.7448 9.05976 25.5172 9.0014 25.2837 8.94887C25.0491 8.89751 24.8087 8.85199 24.5612 8.81231C23.6952 8.67224 22.7462 8.60571 21.7296 8.60571H13.1483C12.937 8.60571 12.7363 8.65357 12.5565 8.73994C12.1608 8.9302 11.8667 9.30487 11.7955 9.76358L9.97 21.3259L9.91748 21.6632C10.0377 20.9022 10.6878 20.3419 11.4594 20.3419H14.6715C20.9802 20.3419 25.9198 17.7799 27.3637 10.3682C27.4069 10.1488 27.443 9.93516 27.4757 9.72623C27.1104 9.53247 26.7147 9.36673 26.2887 9.2255C26.1836 9.19048 26.0751 9.15663 25.9654 9.12395Z" fill="#222D65" />
                                <path d="M11.7952 9.76365C11.8664 9.30493 12.1605 8.93026 12.5562 8.74118C12.7371 8.6548 12.9367 8.60695 13.148 8.60695H21.7293C22.7459 8.60695 23.6949 8.67348 24.5609 8.81354C24.8084 8.85323 25.0488 8.89875 25.2834 8.9501C25.5169 9.00263 25.7445 9.06099 25.9651 9.12519C26.0748 9.15787 26.1833 9.19172 26.2896 9.22556C26.7156 9.3668 27.1113 9.53371 27.4766 9.72629C27.9061 6.98687 27.4731 5.12168 25.9919 3.43273C24.359 1.57338 21.4118 0.777344 17.6406 0.777344H6.6922C5.92185 0.777344 5.26471 1.3376 5.14565 2.09979L0.585389 31.0056C0.495515 31.5775 0.936718 32.0934 1.51332 32.0934H8.27259L9.96971 21.326L11.7952 9.76365Z" fill="#253B80" />
                            </svg>
                        </span>
                        <span className="ml-2">
                            <span className="flex font-sorts mb-0.5">Paypal</span>
                            <span className="">
                                <span>
                                    <svg width="32" height="10" viewBox="0 0 32 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.5372 3.51205H16.405C16.2989 3.51205 16.1967 3.56805 16.1338 3.65605L14.5731 6.00005L13.9127 3.75205C13.8694 3.61205 13.7436 3.51605 13.5982 3.51605H12.4856C12.352 3.51605 12.2576 3.65205 12.3009 3.77605L13.551 7.50005L12.3795 9.18405C12.2891 9.31605 12.3795 9.50005 12.5367 9.50005H13.6689C13.7751 9.50005 13.8733 9.44805 13.9402 9.35605L17.6984 3.82805C17.7928 3.69205 17.6984 3.51205 17.5372 3.51205V3.51205ZM9.96573 5.74405C9.85958 6.40005 9.34853 6.84005 8.69595 6.84005C8.36966 6.84005 8.10627 6.73205 7.94115 6.52805C7.77211 6.32805 7.71315 6.04005 7.76425 5.72405C7.86646 5.07205 8.38538 4.62005 9.02617 4.62005C9.34853 4.62005 9.60405 4.72805 9.77703 4.93605C9.94607 5.14405 10.0168 5.43205 9.96573 5.74405V5.74405ZM11.5343 3.51205H10.406C10.3117 3.51205 10.2252 3.58005 10.2134 3.68405L10.1623 4.00405L10.0837 3.88805C9.83993 3.52405 9.29349 3.40805 8.75491 3.40805C7.50872 3.40805 6.4473 4.36805 6.23894 5.71205C6.1328 6.38405 6.28612 7.02805 6.65958 7.47605C7.0016 7.88805 7.493 8.06005 8.07875 8.06005C9.0812 8.06005 9.63943 7.40405 9.63943 7.40405L9.58833 7.72405C9.5726 7.84805 9.66302 7.95605 9.78096 7.95605H10.7952C10.9564 7.95605 11.09 7.84005 11.1176 7.67605L11.7269 3.75205C11.7505 3.62405 11.6561 3.51205 11.5343 3.51205V3.51205ZM4.7726 3.54005C4.64287 4.40005 3.99816 4.40005 3.3731 4.40005H3.01536L3.26302 2.79205C3.27482 2.69605 3.3613 2.62005 3.45565 2.62005H3.61683C4.0414 2.62005 4.44238 2.62005 4.65074 2.86405C4.78047 3.02005 4.81978 3.24005 4.7726 3.54005V3.54005ZM4.50135 1.30005H2.15049C1.98931 1.30005 1.85565 1.41605 1.82813 1.58005L0.876781 7.72005C0.861056 7.84405 0.951473 7.95205 1.06941 7.95205H2.19373C2.35098 7.95205 2.48857 7.83605 2.51609 7.67205L2.77162 6.01605C2.79914 5.85605 2.9328 5.73605 3.09398 5.73605H3.84091C5.3898 5.73605 6.28612 4.97205 6.51806 3.46005C6.6242 2.80005 6.52199 2.27605 6.21929 1.91605C5.88513 1.50805 5.28759 1.30005 4.50135 1.30005" fill="#002F86" />
                                        <path d="M29.6531 1.46405L28.686 7.72005C28.6703 7.84405 28.7607 7.95205 28.8786 7.95205H29.8496C30.0069 7.95205 30.1445 7.83605 30.172 7.67205L31.1234 1.53205C31.1391 1.40805 31.0487 1.30005 30.9307 1.30005H29.8457C29.7514 1.30005 29.6649 1.36805 29.6531 1.46405V1.46405ZM26.7519 5.74405C26.6457 6.40005 26.1347 6.84005 25.4821 6.84005C25.1558 6.84005 24.8924 6.73205 24.7273 6.52805C24.5582 6.32805 24.4993 6.04005 24.5504 5.72405C24.6526 5.07205 25.1715 4.62005 25.8123 4.62005C26.1347 4.62005 26.3902 4.72805 26.5632 4.93605C26.7361 5.14405 26.803 5.43205 26.7519 5.74405ZM28.3204 3.51205H27.1961C27.1017 3.51205 27.0153 3.58005 27.0035 3.68405L26.9524 4.00405L26.8737 3.88805C26.63 3.52405 26.0836 3.40805 25.545 3.40805C24.2988 3.40805 23.2374 4.36805 23.029 5.71205C22.9229 6.38405 23.0762 7.02805 23.4496 7.47605C23.7917 7.88805 24.2831 8.06005 24.8688 8.06005C25.8713 8.06005 26.4295 7.40405 26.4295 7.40405L26.3784 7.72405C26.3627 7.84805 26.4531 7.95605 26.571 7.95605H27.5813C27.7425 7.95605 27.8762 7.84005 27.9037 7.67605L28.513 3.75205C28.5366 3.62405 28.4423 3.51205 28.3204 3.51205V3.51205ZM21.5587 3.54005C21.429 4.40005 20.7882 4.40005 20.1592 4.40005H19.8015L20.0492 2.79205C20.0609 2.69605 20.1474 2.62005 20.2418 2.62005H20.403C20.8275 2.62005 21.2285 2.62005 21.4369 2.86405C21.5666 3.02005 21.6059 3.24005 21.5587 3.54005V3.54005ZM21.2875 1.30005H18.9366C18.7754 1.30005 18.6418 1.41605 18.6143 1.58005L17.6629 7.72005C17.6472 7.84405 17.7376 7.95205 17.8555 7.95205H19.0624C19.1725 7.95205 19.2708 7.86805 19.2904 7.75605L19.5617 6.01205C19.5892 5.85205 19.7229 5.73205 19.884 5.73205H20.631C22.1799 5.73205 23.0762 4.96805 23.3081 3.45605C23.4143 2.79605 23.3121 2.27205 23.0094 1.91205C22.6713 1.50805 22.0737 1.30005 21.2875 1.30005" fill="#009CDE" />
                                    </svg>
                                </span>
                            </span>
                        </span>
                    </span>
                    <input type="radio" className="form-radio text-lff_800 hidden" name="radio" value="1" onChange={() => setActive('paypal')} />
                </label>
                <label className={`${active == `mpesa` ? `bg-lff_700` : ''} flex border border-solid border-lff_800 items-center w-full md:w-1/3 px-6 py-4 justify-between cursor-pointer z-50`}>
                    <span className="flex items-center">
                        <span>
                            <svg width="18" height="36" viewBox="0 0 18 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.84947 6.77979H11.3769C13.1347 6.77979 14.5732 8.21431 14.5732 9.96754V19.1319C14.5732 20.8852 13.1347 22.3197 11.3769 22.3197H5.84947C4.09135 22.3197 2.65283 20.8852 2.65283 19.1319V9.96754C2.65283 8.21431 4.09135 6.77979 5.84947 6.77979Z" fill="white" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.84888 6.77985H11.3763C13.1341 6.77985 14.5726 8.21437 14.5726 9.96761V19.132C14.5726 20.8852 13.1341 22.3198 11.3763 22.3198H5.84888C4.09076 22.3198 2.65224 20.8852 2.65224 19.132V9.96761C2.65224 8.21437 4.09076 6.77985 5.84888 6.77985ZM13.3727 36H3.85122C3.18067 35.9977 2.53822 35.7311 2.06401 35.2583C1.58979 34.7856 1.32228 34.145 1.31982 33.4763V5.65089C1.32178 4.98219 1.58905 4.34143 2.06324 3.86861C2.53744 3.3958 3.18001 3.12935 3.85058 3.12749H13.374C13.4854 3.12744 13.5966 3.13472 13.7071 3.14929V1.10204C13.7079 0.811692 13.8239 0.533477 14.0298 0.328142C14.2356 0.122807 14.5146 0.00703396 14.8057 0.00610352V0.00610352C15.0969 0.00703353 15.3759 0.122796 15.5818 0.328122C15.7877 0.533448 15.9038 0.811662 15.9047 1.10204V4.55528C15.9047 4.70385 15.8742 4.85084 15.815 4.98718C15.8745 5.20342 15.9047 5.42665 15.9047 5.65089V33.4763C15.9023 34.1449 15.6348 34.7854 15.1608 35.2581C14.6867 35.7309 14.0444 35.9975 13.374 36H13.3727Z" fill="#D2E288" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.1987 12.9802C5.7453 14.2557 6.48996 14.8422 7.39185 14.8781C5.98548 15.9256 4.464 16.5624 2.87758 16.9689C1.88084 16.9048 0.929112 16.6525 0.00439453 16.4001C2.34062 15.9403 4.08428 14.8127 5.1987 12.9802Z" fill="#82221C" />
                                <path d="M2.87897 16.9847H2.8764C1.84493 16.9187 0.82215 16.6397 0 16.4153V16.3858C2.3417 15.9247 4.08599 14.7765 5.18401 12.9726L5.19977 12.9473L5.21134 12.9745C5.73286 14.191 6.46531 14.8265 7.39099 14.8631L7.39935 14.8906C6.11323 15.85 4.6342 16.5349 2.87994 16.9841L2.87897 16.9847ZM0.070415 16.4028C0.879382 16.6237 1.87419 16.8898 2.87608 16.9539C4.6088 16.5095 6.0724 15.8346 7.34823 14.8916C6.90674 14.8663 6.48611 14.6958 6.15214 14.4068C5.78367 14.0951 5.46214 13.6267 5.19623 13.0143C4.65916 13.8973 3.93202 14.6502 3.06739 15.2186C2.22241 15.7721 1.21442 16.1703 0.070415 16.4028V16.4028Z" fill="#CD8C5D" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.3252 9.69312L17.9165 13.0133C14.5604 17.4204 8.89827 17.5349 2.86768 16.9648C6.89933 15.974 9.69084 13.517 11.3239 9.69312H11.3252Z" fill="#EC2127" />
                                <path d="M7.30087 17.2228H7.29123C6.01958 17.2228 4.61353 17.1452 2.86602 16.98L2.86377 16.9502C6.82533 15.9777 9.66733 13.5332 11.311 9.68719L11.3174 9.67212L11.3319 9.67949L17.9419 13.0083L17.9306 13.0228C16.3841 15.0521 14.2472 16.3106 11.3988 16.8704C10.1895 17.1073 8.84904 17.2228 7.30087 17.2228ZM2.95862 16.9582C9.64289 17.5819 14.7417 17.142 17.8953 13.0189L11.3329 9.71412C10.5146 11.6238 9.39467 13.2014 8.00663 14.4031C6.61859 15.6048 4.91995 16.4638 2.95862 16.9582Z" fill="#CD8C5D" />
                            </svg>

                        </span>
                        <span className="ml-2">
                            <span className="flex font-sorts mb-0.5">Mpesa</span>
                            <span className="">
                                <span>
                                    <svg width="48" height="18" viewBox="0 0 48 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="48" height="18" fill="url(#mpesa)" />
                                        <defs>
                                            <pattern id="mpesa" patternContentUnits="objectBoundingBox" width="1" height="1">
                                                <use xlinkHref="#image0_1324_89" transform="translate(-0.0196803 -0.47203) scale(0.000296199 0.000783459)" />
                                            </pattern>
                                            <image id="image0_1324_89" width="3509" height="2481" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAADbUAAAmxCAYAAADczvRrAAAACXBIWXMAAC4jAAAuIwF4pT92AAAgAElEQVR4nOzbQQEAIBCAMLV/57MFPtwSUIA9MwsAAAAAAAAAAAAAAAAACud1AAAAAAAAAAAAAAAAAAD/MLUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAAkDG1AQAAAAAAAAAAAAAAAJAxtQEAAAAAAAAAAAAAAACQMbUBAAAAAAAAAAAAAAAA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AAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgQe69IgAAIABJREFUjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyoja+D/27ua2rTsL4/BrN5AUcAF7d1cXcQdRB+MOolQwTgdyB5oOpA6UDqgOJHDF1UgAC5Aq4CzIBJmZOPGHeA55+TwAAS7f3X9zfzgAAAAAAAAAAAAAAAAAZURtAAAAAAAAAAAAAAAAAJQRtQEAAAAAAAAAAAAAAABQRtQGAAAAAAAAAAAAAAAAQBlRGwAAAAAAAAAAAAAAAABlRG0AAAAAAAAAAAAAAAAAlBG1AQAAAAAAAAAAAAAAAFBG1AYAAAAAAAAAAAAAAABAGVEbAAAAAAAAAAAAAAAAAGVEbQAAAAAAAAAAAAAAAACUEbUBAAAAAAAAAAAAAAAAUEbUBgAAAAAAAAAAAAAAAEAZURsAAAAAAAAAAAAAAAAAZURtAAAAAAAAAAAAAAAAAJQRtQEAAAAAAAAAAAAAAABQRtQGAAAAAAAAAAAAAAAAQBlRGwAAAAAAAAAAAAAAAABlRG0AAAAAAAAAAAAAAAAAlBG1AQAAAAAAAAAAAAAAAFBG1AYAAAAAAAAAAAAAAABAGVEbAAAAAAAAAAAAAAAAAGVEbQAAAAAAAAAAAAAAAACUEbUBAAAAAAAAAAAAAAAAUEbUBgAAAAAAAAAAAAAAAEAZURsAAAAAAAAAAAAAAAAAZURtAAAAAAAAAAAAAAAAAJQRtQEAAAAAAAAAAAAAAABQRtQGAAAAAAAAAAAAAAAAQBlRGwAAAAAAAAAAAAAAAABlRG0AAAAAAAAAAAAAAAAAlBG1AQAAAAAAAAAAAAAAAFBG1AYAAAAAAAAAAAAAAABAGVEbAAAAAAAAAAAAAAAAAGVEbQAAAAAAAAAAAAAAAACUEbUBAAAAAAAAAAAAAAAAUEbUBgAAAAAAAAAAAAAAAEAZURsAAAAAAAAAAAAAAAAAZURtAAAAAAAAAAAAAAAAAJQRtQEAAAAAAAAAAAAAAABQRtQGAAAAAAAAAAAAAAAAQBlRGwAAAAAAAAAAAAAAAABlRG0AAAAAAAAAAAAAAAAAlBG1AQAAAAAAAAAAAAAAAFBG1AYAAAAAAAAAAAAAAABAGVEbAAAAAAAAAAAAAAAAAGVEbQAAAAAAAAAAAAAAAACUEbUBAAAAAAAAAAAAAAAAUEbUBgAAAAAAAAAAAAAAAEAZURsAAAAAAAAAAAAAAAAAZURtAAAAAAAAAAAAAAAAAJQRtQEAAAAAAAAAAAAAAABQRtQGAAAAAAAAAAAAAAAAQBlRGwAAAAAAAAAAAAAAAABlRG0AAAAAAAAAAAAAAAAAlBG1AQAAAAAAAAAAAAAAAFBG1AYAAAAAAAAAAAAAAABAGVEbAAAAAAAAAAAAAAAAAGVEbQAAAAAAAAAAAAAAAACUEbUBAAAAAAAAAAAAAAAAUEbUBgAAAAAAAAAAAAAAAEAZURsAAAAAAAAAAAAAAAAAZURtAAAAAAAAAAAAAAAAAJQRtQEAAAAAAAAAAAAAAABQRtQGAAAAAAAAAAAAAAAAQBlRGwAAAAAAAAAAAAAAAABlRG0AAAAAAAAAAAAAAAAAlBG1AQAAAAAAAAAAAAAAAFBG1AYAAAAAAAAAAAAAAABAGVEbAAAAAAAAAAAAAAAAAGVEbQAAAAAAAAAAAAAAAACUEbUBAAAAAAAAAAAAAAAAUEbUBgAAAAAAAAAAAAAAAEAZURsAAAAAAAAAAAAAAAAAZURtAAAAAAAAAAAAAAAAAJQRtQEAAAAAAAAAAAAAAABQRtQGAAAAAAAAAAAAAAAAQBlRGwAAAAAAAAAAAAAAAABlRG0AAAAAAAAAAAAAAAAAlBG1AQAAAAAAAAAAAAAAAFBG1AYAAAAAAAAAAAAAAABAGVEbAAAAAAAAAAAAAAAAAGVEbQAAAAAAAAAAAAAAAACUEbUBAAAAAAAAAAAAAAAAUEbUBgAAAAAAAAAAAAAAAEAZURsAAAAAAAAAAAAAAAAAZURtAAAAAAAAAAAAAAAAAJQRtQEAAAAAAAAAAAAAAABQRtQGAAAAAAAAAAAAAAAAQBlRGwAAAAAAAAAAAAAAAABlRG0AAAAAAAAAAAAAAAAAlBG1AQAAAAAAAAAAAAAAAFBG1AYAAAAAAAAAAAAAAABAGVEbAAAAAAAAAAAAAAAAAGVEbQAAAAAAAAAAAAAAAACUEbUBAAAAAAAAAAAAAAAAUEbUBgAAAAAAAAAAAAAAAEAZURsAAAAAAAAAAAAAAAAAZURtAAAAAAAAAAAAAAAAAJQRtQEAAAAAAAAAAAAAAABQRtQGAAAAAAAAAAAAAAAAQBlRGwAAAAAAAAAAAAAAAABlRG0AAAAAAAAAAAAAAAAAlBG1AQAAAAAAAAAAAAAAAFBG1AYAAAAAAAAAAAAAAABAGVEbAAAAAAAAAAAAAAAAAGVEbQAAAAAAAAAAAAAAAACUEbUBAAAAAAAAAAAAAAAAUEbUBgAAAAAAAAAAAAAAAEAZURsAAAAAAAAAAAAAAAAAZURtAAAAAAAAAAAAAAAAAJQRtQEAAAAAAAAAAAAAAABQRtQGAAAAAAAAAAAAAAAAQBlRGwAAAAAAAAAAAAAAAABlRG0AAAAAAAAAAAAAAAAAlBG1AQAAAAAAAAAAAAAAAFBG1AYAAAAAAAAAAAAAAABAGVEbAAAAAAAAAAAAAAAAAGVEbQAAAAAAAAAAAAAAAACUEbUBAAAAAAAAAAAAAAAAUEbUBgAAAAAAAAAAAAAAAEAZURsAAAAAAAAAAAAAAAAAZURtAAAAAAAAAAAAAAAAAJQRtQEAAAAAAAAAAAAAAABQRtQGAAAAAAAAAAAAAAAAQBlRGwAAAAAAAAAAAAAAAABlRG0AAAAAAAAAAAAAAAAAlBG1AQAAAAAAAAAAAAAAAFBG1AYAAAAAAAAAAAAAAABAGVEbAAAAAPBnnrsHAAAAAAAAAAAwT6I2AADgRY3DtOjeAAC8iLvuAQAAAAAAAAAAzJOoDQAAAAAAAAAAAAAAAIAyojYAAAAA4M88dQ8AAAAAAAAAAGCeRG0AAMA+3HYPAAC+2V33AAAAAAAAAAAA5knUBgAAAAAAAAAAAAAAAEAZURsAALAPi+4BAMA3W3QPAAAAAAAAAABgnkRtAAAAAAAAAAAAAAAAAJQRtQEAAPuw6B4AAHybcZgW3RsAAAAAAAAAAJgnURsAALAPD90DAIBv8tg9AAAAAAAAAACA+RK1AQAAL24cpofuDQDAN3noHgAAAAAAAAAAwHyJ2gAAgH257R4AAHy1RfcAAAAAAAAAAADmS9QGAADsy0P3AADgqz10DwAAAAAAAAAAYL5EbQAAwL7cdQ8AAL6adxwAAAAAAAAAgL0RtQEAAPuy6B4AAHyV53GYRG0AAAAAAAAAAOyNqA0AANgLH8MDwNHyhgMAAAAAAAAAsFeiNgAAYJ9uuwcAAF9s0T0AAAAAAAAAAIB5E7UBAAD7tOgeAAB8sUX3AAAAAAAAAAAA5k3UBgAA7NOiewAA8GXGYVp0bwAAAAAAAAAAYN5EbQAAwN74KB4Ajs5t9wAAAAAAAAAAAOZP1AYAAOzbr90DAIDPdtM9AAAAAAAAAACA+RO1AQAA+7boHgAAfDZRGwAAAAAAAAAAeydqAwAA9s3H8QBwHB7HYXroHgEAAAAAAAAAwPyJ2gAAgL3afRx/370DAPhbQnQAAAAAAAAAAEqI2gAAgApX3QMAgL911T0AAAAAAAAAAIDTIGoDAAAquPwCAIftcRymu+4RAAAAAAAAAACcBlEbAACwd+MwPSS5794BAHySAB0AAAAAAAAAgDKiNgAAoMpl9wAA4JO80wAAAAAAAAAAlBG1AQAAVVyAAYDDdL+7qgoAAAAAAAAAACVEbQAAQIlxmJ6SXHfvAAD+jyttAAAAAAAAAACUErUBAACVrroHAAD/5TmuqQIAAAAAAAAAUEzUBgAAlBmHaZHksXsHAPC7m901VQAAAAAAAAAAKCNqAwAAql10DwAAfnfRPQAAAAAAAAAAgNPzarPZdG8AAABOzGq9fEryXfcOADhxt+MwnXWPAAAAAAAAAADg9LjUBgAAdLjsHgAAuNIGAAAAAAAAAEAPURsAANDhMslz9wgAOGG34zAtukcAAAAAAAAAAHCaRG0AAEC5cZie4lobAHS66B4AAAAAAAAAAMDpErUBAABdXGsDgB6utAEAAAAAAAAA0ErUBgAAtHCtDQDaXHQPAAAAAAAAAADgtInaAACATq61AUAtV9oAAAAAAAAAAGgnagMAANq41gYA5S66BwAAAAAAAAAAwKvNZtO9AQAAOHGr9fIhyZvuHQAwc7+Ow/S+ewQAAAAAAAAAALjUBgAAHIIP3QMAYOae470FAAAAAAAAAOBAiNoAAIB24zDdJLnt3gEAM3Y5DtND9wgAAAAAAAAAAEiSV5vNpnsDAABAVuvl2yT/7t4BADP0OA7T2+4RAAAAAAAAAADwG5faAACAg7C7HvOxewcAzNB59wAAAAAAAAAAAPgjl9oAAICDslov75L80L0DAGbiehym8+4RAAAAAAAAAADwRy61AQAAh+a8ewAAzMRzkg/dIwAAAAAAAAAA4H+J2gAAgIMyDtNdko/dOwBgBs7HYXrqHgEAAAAAAAAAAP/r1Waz6d4AAADwf1br5V2SH7p3AMCR+tc4TK60AQAAAAAAAABwkFxqAwAADtX7JM/dIwDgCN0nuegeAQAAAAAAAAAAnyJqAwAADtI4TA9JXJgBgC/znOR8HKan7iEAAAAAAAAAAPApojYAAOBgjcN0leS6ewcAHJEP4zDddY8AAAAAAAAAAIC/8mqz2XRvAAAA+Eur9fIuyQ/dOwDgwF2Pw3TePQIAAAAAAAAAAP6OS20AAMAxeJ/kuXsEABywe0EbAAAAAAAAAADHQtQGAAAcvHGYHpKcNc8AgEP1HO8kAAAAAAAAAABHRNQGAAAchXGY7pL83L0DAA7Mc5KzcZieuocAAAAAAAAAAMDnErUBAABHYxymqyQfu3cAwAE534XfAAAAAAAAAABwNF5tNpvuDQAAAF9ktV5eJfmpewcANPt5F3wDAAAAAAAAAMBRcakNAAA4OuMwnSe57t4BAI1+EbQBAAAAAAAAAHCsXGoDAACO1mq9vEnyj+4dAFDsehd4AwAAAAAAAADAUXKpDQAAOGbnSe67RwBAIUEbAAAAAAAAAABHT9QGAAAcrXGYnpKcRdgGwGkQtAEAAAAAAAAAMAuiNgAA4Kj9IWy7bp4CAPskaAMAAAAAAAAAYDZebTab7g0AAAAvYrVeXiX5qXsHALywj+MwXXSPAAAAAAAAAACAlyJqAwAAZkXYBsDM/DwO01X3CAAAAAAAAAAAeEmvuwcAAAC8pHGYzpP80r0DAL7RcwRtAAAAAAAAAADMlEttAADALK3Wy/Mkl0m+a54CAF/qOcnZOEx33UMAAAAAAAAAAGAfRG0AAMBsrdbLd0lukrzp3gIAn+k+26DtqXsIAAAAAAAAAADsy+vuAQAAAPuyu3DzLslt9xYA+AzXEbQBAAAAAAAAAHACXGoDAABOwmq9vEzyz+4dAPAJv4zDdNk9AgAAAAAAAAAAKojaAACAk7FaL98nuUryXfMUAPjNY5L3u+uiAAAAAAAAAABwEl53DwAAAKgyDtNNkrdJbpunAECSXCd5J2gDAAAAAAAAAODUuNQGAACcpNV6+SHJRVxtA6Dec5LzXWwNAAAAAAAAAAAnR9QGAACcrNV6+TbJVZIfe5cAcEJ+zTZoe+oeAgAAAAAAAAAAXURtAADAyVutl+dJLuNqGwD785jkg+tsAAAAAAAAAACQvO4eAAAA0G0cpqskb5Nc9y4BYKY+JnknaAMAAAAAAAAAgC2X2gAAAP5gtV6+y/Zq24/dWwA4erdJzsdheugeAgAAAAAAAAAAh0TUBgAA8CdW6+X7bOO2N91bADg690k+jMO06B4CAAAAAAAAAACHSNQGAADwF1br5XmSi4jbAPh7j0kuxmG66h4CAAAAAAAAAACHTNQGAADwGcRtAPwFMRsAAAAAAAAAAHwBURsAAMAX2MVt50l+7F0CwAG4TXI5DtNN9xAAAAAAAAAAADgmojYAAICvsFovz7KN237qXQJAg+tsY7a77iEAAAAAAAAAAHCMRG0AAADfYLVefp9t3PYhyZveNQDs0WOSyyRX4zA9dY8BAAAAAAAAAIBjJmoDAAB4Iav18l22cdv7JN81zwHg2z0nuco2ZHOVDQAAAAAAAAAAXoioDQAAYA9W6+X7bOO2s7jgBnBMHpPcJFmMw3TTPQYAAAAAAAAAAOZI1AYAALBnuwtuvwVuP/auAeBP3CZZJLlxkQ0AAAAAAAAAAPZP1AYAAFBstV6eZRu4nUXkBtDht4htMQ7ToncKAAAAAAAAAACcHlEbAABAs90lt3dJ3mYbur1N8qZvEcBsPCZ5yDZge0hy5xIbAAAAAAAAAAD0E7UBAAAcqF3s9n22oVuyjd3e7v5/n+SH8lEAh+M+ydPu/8Pul2wDtrjABgAAAAAAAAAAh0vUBgAAAAAAAAAAAAAAAECZ190DAAAAAAAAAAAAAAAAADgdojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAAAyojaAAAAAAAAAAAAAAAAACgjagMAAAAAAAAAAAAAAACgjKgNAAAAAAAAAAAAAAAAgDKiNgAAAAAAAAAAAAAAAADKiNoAAAAAAAAAAAAAAAAAKCNqAwAAAAAAAAAAAAAAAKCMqA0AAAAAAAAAAAAAAACAMqI2AAAAAAAAAAAAAAAAAMqI2gAAAAAAAAAAAAAAAAAoI2oDAAAAAAAAAAAAAAAAoIyoDQAAAAAAAAAAAAAAAIAyojYAAAAAAAAAAAAAAAD+w74dCwAAAAAM8reexa7yCGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwCK2p6dAAAgAElEQVQAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAKD27VgAAAAAYJC/9Sx2lUcAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAANyarzAAAAIsSURBVAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYSG0AAAAAAAAAAAAAAAAAbKQ2AAAAAAAAAAAAAAAAADZSGwAAAAAAAAAAAAAAAAAbqQ0AAAAAAAAAAAAAAACAjdQGAAAAAAAAAAAAAAAAwEZqAwAAAAAAAAAAAAAAAGAjtQEAAAAAAAAAAAAAAACwkdoAAAAAAAAAAAAAAAAA2EhtAAAAAAAAAAAAAAAAAGykNgAAAAAAAAAAAAAAAAA2UhsAAAAAAAAAAAAAAAAAG6kNAAAAAAAAAAAAAAAAgI3UBgAAAAAAAAAAAAAAAMBGagMAAAAAAAAAAAAAAABgI7UBAAAAAAAAAAAAAAAAsJHaAAAAAAAAAAAAAAAAANhIbQAAAAAAAAAAAAAAAABspDYAAAAAAAAAAAAAAAAANlIbAAAAAAAAAAAAAAAAABupDQAAAAAAAAAAAAAAAICN1AYAAAAAAAAAAAAAAADARmoDAAAAAAAAAAAAAAAAYCO1AQAAAAAAAAAAAAAAALCR2gAAAAAAAAAAAAAAAADYBIfrqpVPaGivAAAAAElFTkSuQmCC" />
                                        </defs>
                                    </svg>

                                </span>
                            </span>
                        </span>
                    </span>
                    <input type="radio" className="form-radio text-lff_800 hidden" name="radio" value="1" checked={active == 'mpesa' ? true : false} onChange={() => setActive('mpesa')} />
                </label>
            </div>

            <div>
                <div ref={paypal} className={`${active == 'paypal' ? 'block' : 'hidden'} flex justify-center pt-16`}>
                    <PayPal
                        opt={
                            {
                                amount: amount,
                                name: name,
                                email: email,
                                phone: phone
                            }
                        }
                        sent={sent}
                    />
                </div>
                <div ref={mpesa} className={`${active == 'mpesa' ? 'block' : 'hidden'}`}>
                    <div className="w-full mb-5">
                        <label htmlFor="city" className="font-sorts mb-4 text-lg text-lff_900">Name</label>
                        <div className="flex font-sen py-0.5">
                            <input
                                className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                                type="text"
                                placeholder="Name"
                                value={`${name.first} ${name.last}`}
                            // onChange={e => handleAddress('city', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full mb-5">
                        <label htmlFor="city" className="font-sorts mb-4 text-lg text-lff_900">Email</label>
                        <div className="flex font-sen py-0.5">
                            <input
                                className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                                type="text"
                                placeholder="Email Address"
                                value={`${email}`}
                            // onChange={e => handleAddress('city', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full mb-5">
                        <label htmlFor="city" className="font-sorts mb-4 text-lg text-lff_900">Phone</label>
                        <div className='flex'>
                            <input
                                className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                                type="text"
                                placeholder="Phone"
                                value={`${phone}`}
                            // onChange={e => handleAddress('city', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const PayPal = ({ opt, sent }) => {
    const approveOrder = async (data, actions) => {
        return actions.order.capture().then(details => {
            // const name = `${details.payer.name.given_name} ${details.payer.name.surname}`;
            if (details.status == 'COMPLETED') sent(true)
        });
    }

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    // sender_batch_header: {
                    //     sender_batch_id: "Payouts_2018_100007",
                    //     email_subject: "You have a payout!",
                    //     email_message: "You have received a payout! Thanks for using our service!"
                    // },
                    amount: {
                        value: opt.amount,
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: opt.amount,
                            },
                        },
                    },
                    items: [
                        {
                            name: "lff-donation",
                            quantity: "1",
                            unit_amount: {
                                currency_code: "USD",
                                value: opt.amount,
                            },
                            // category: "DONATION",
                            // recipient_type: "PAYPAL_ID",
                            // note: "Thanks for your patronage!",
                            // sender_item_id: "201403140003",
                            // receiver: "G83JXTJ5EHCQ2"
                        },
                    ],
                    shipping: {
                        address: {
                            address_line_1: opt.address,
                            country_code: 'KE',
                            admin_area_1: opt.state,
                            admin_area_2: opt.city,
                            postal_code: opt.postalCode,
                        },
                    },
                },
            ],
            application_context: {
                brand_name: "The Luigi Footprints Foundation",
                shipping_preference: "NO_SHIPPING",
            },
            payer: {
                payer_info: {
                    email: opt.email,
                    first_name: opt.name.first,
                    last_name: opt.name.last
                },
            }
        }).then(orderId => {
            return orderId
        })
    }

    return (
        <PayPalScriptProvider
            options={{
                "client-id": "AfcPQanYEX31-GeZr9cT8-hlF3qquIW5nJ8XEBgfY7dnFuBZFg7idI6XWoIFfixBhu0tJhSRqmLSdZxb",
                components: "buttons",
                currency: "USD",
                intent: "capture",
            }}
        >
            <PayPalButtons
                style={{ layout: "vertical" }}
                disabled={false}
                createOrder={createOrder}
                onApprove={approveOrder}
                forceReRender={[opt]}
            />
        </PayPalScriptProvider >
    );
}

// export async function getStaticProps() {
//     const res = await fetch('http://localhost:8080/api/gen', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
//         .then(res => res.json())
//         .then(data => {
//             console.log(data)
//         })

//     // let data = res.then(response => response.json())

//     return {
//         props: {
//             context: JSON.stringify(res)
//         },
//     }
// }

export default Index