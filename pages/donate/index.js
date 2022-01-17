import Head from 'next/head'
import Layout from '../../components/Layout'
import { useState, useEffect, useRef } from 'react'
import Alert from '../../components/Alert'
import { SEND_EMAIL } from '../../data/contact'
import { useMutation } from '@apollo/client'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import countries from '../../components/countries'
import Select from '../../components/Select'

const Index = () => {
    const elem = useRef(null)
    useEffect(() => {
        // elem.current.style.paddingRight = `${(document.documentElement.clientWidth - document.querySelector('.container').offsetWidth) / 2}px`
    }, [])
    return (
        <>
            <Layout preview>
                <Head>
                    <title>Donate 💚 | The Luigi Footprints Foundation</title>
                </Head>

                <div ref={elem} className="w-full px-4 md:w-1/2 mx-auto">
                    <DonationsForm />
                </div>

            </Layout>
        </>
    )
}

const DonationsForm = () => {
    const [firstName, setFirstName] = useState(''),
        [lastName, setLastName] = useState(''),
        [address, setAddress] = useState(''),
        [city, setCity] = useState(''),
        [state, setState] = useState(''),
        [postalCode, setPostalCode] = useState(''),
        [country, setCountry] = useState(''),
        [country_code, setCountry_code] = useState(''),
        [email, setEmail] = useState(''),
        [phone, setPhone] = useState(''),
        [expiryMonthValid, setExpiryMonthValid] = useState(false),
        [alerts, setAlerts] = useState({}),
        [btnDisabled, setBtnDisabled] = useState(true),
        // [recurring, setRecurring] = useState(false),
        [cardNumber, setCardNumber] = useState(''),
        [cardType, setCardType] = useState(''),
        [expiryMonth, setExpiryMonth] = useState(''),
        [expiryYear, setExpiryYear] = useState(''),
        [expiryMonthYear, setExpiryMonthYear] = useState(''),
        [cvn, setCvn] = useState(''),
        [sendEmail] = useMutation(SEND_EMAIL),
        [amount, setAmount] = useState('0.00'),
        [page, setPage] = useState(1),
        CREDIT_CARD_NUMBER_DEFAULT_MASK = "XXXX XXXX XXXX XXXX",
        CREDIT_CARD_NUMBER_VISA_MASK = "XXXX XXXX XXXX XXXX",
        CREDIT_CARD_NUMBER_MASTERCARD_MASK = "XXXX XXXX XXXX XXXX",
        CREDIT_CARD_NUMBER_DISCOVER_MASK = "XXXX XXXX XXXX XXXX",
        CREDIT_CARD_NUMBER_AMEX_MASK = "XXXX XXXX XXXX XXX",
        // CREDIT_CARD_NUMBER_JCB_MASK = "XXXX XXXX XXXX XXXX",
        // CREDIT_CARD_NUMBER_DINERS_MASK = "XXXX XXXX XXXX XX",
        EXPIRY_MASK = "XX / XX",
        CVC_MASK_3 = "XXX",
        CVC_MASK_4 = "XXXX",
        [cardNumberMask, setCardNumberMask] = useState(CREDIT_CARD_NUMBER_DEFAULT_MASK),
        [cvcMask, setCvcMask] = useState(CVC_MASK_3),
        KEYS = {
            "0": 48,
            "9": 57,
            "NUMPAD_0": 96,
            "NUMPAD_9": 105,
            "DELETE": 46,
            "BACKSPACE": 8,
            "ARROW_LEFT": 37,
            "ARROW_RIGHT": 39,
            "ARROW_UP": 38,
            "ARROW_DOWN": 40,
            "HOME": 36,
            "END": 35,
            "TAB": 9,
            "A": 65,
            "X": 88,
            "C": 67,
            "V": 86
        }

    let form = useRef(),
        errorOut = useRef(),
        cvcInput = useRef()

    const handleAmount = amount => {
        setAmount(amount)
        setBtnDisabled(false)
    }

    const handleUserInfo = (key, value) => {
        if (key == 'firstName') setFirstName(value)
        if (key == 'lastName') setLastName(value)
        if (key == 'email') setEmail(value)
        if (key == 'phone') setPhone(value)
        setBtnDisabled(false)
    }

    const handleAddressInfo = (key, value) => {
        if (key == 'country') {
            setCountry(value.label)
            setCountry_code(value.value)
        }
        if (key == 'address') setAddress(value)
        if (key == 'city') setCity(value)
        if (key == 'state') setState(value)
        if (key == 'postalCode') setPostalCode(value)
        setBtnDisabled(false)
    }

    const numbersOnlyString = string => {
        let numbersOnlyString = ""
        for (let i = 0; i < string.length; i++) {
            const currentChar = string.charAt(i),
                isValid = !isNaN(parseInt(currentChar))

            if (isValid) numbersOnlyString += currentChar
        }
        return numbersOnlyString
    }

    const applyMaskFormat = (string, mask) => {
        let formattedString = "",
            numberPos = 0
        for (let j = 0; j < mask.length; j++) {
            let currentMaskChar = mask[j]
            if (currentMaskChar == "X") {
                let digit = string.charAt(numberPos)
                if (!digit) break
                formattedString += string.charAt(numberPos)
                numberPos++
            }
            else
                formattedString += currentMaskChar
        }
        return formattedString
    }

    const cardTypeFromNumber = number => {
        let re
        // re = new RegExp("^30[0-5]")
        // if (number.match(re) != null)
        //     return "Diners - Carte Blanche"

        // re = new RegExp("^(30[6-9]|36|38)")
        // if (number.match(re) != null)
        //     return "Dinners"

        re = new RegExp("^35(2[89]|[3-8][0-9])")
        if (number.match(re) != null)
            return "JCB"

        re = new RegExp("^3[47]")
        if (number.match(re) != null)
            return "AMEX"

        // re = new RegExp("^(4026|417500|4508|4844|491(3|7))")
        // if (number.match(re) != null)
        //     return "Visa Electron"

        re = new RegExp("^4");
        if (number.match(re) != null)
            return "Visa";

        re = new RegExp("^5[1-5]");
        if (number.match(re) != null)
            return "Mastercard";

        re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
        if (number.match(re) != null)
            return "Discover";

        return "";
    }

    const setCardTypeIconFromNumber = number => {
        switch (cardTypeFromNumber(number)) {
            // case "Visa Electron":
            //     setCardType('033')
            case "Visa":
                setCardType('001')
                setCardTypeAsVisa()
                break
            case "Mastercard":
                setCardType('002')
                setCardTypeAsMasterCard()
                break;
            case "AMEX":
                setCardType('003')
                setCardTypeAsAmericanExpress()
                break;
            case "Discover":
                setCardType('004')
                setCardTypeAsDiscover()
                break;
            // case "Diners - Carte Blanche":
            //     setCardType('006')
            // case "Diners":
            //     setCardType('005')
            //     setCardTypeAsDiners()
            //     break;
            // case "JCB":
            //     setCardType('007')
            //     setCardTypeAsJcb()
            //     break;
            default:
                clearCardType()
        }
    }

    const setCvc3 = () => {
        setCvcMask(CVC_MASK_3)
        cvcInput.current.setAttribute("maxlength", CVC_MASK_3.length)
    }

    const setCvc4 = () => {
        setCvcMask(CVC_MASK_4)
        cvcInput.current.setAttribute("maxlength", CVC_MASK_4.length)
    }

    const clearCardType = () => {
        setCardType('')
        setCardNumberMask(CREDIT_CARD_NUMBER_DEFAULT_MASK)
        setCvc3()
    }

    const setCardTypeAsVisa = () => {
        setCardNumberMask(CREDIT_CARD_NUMBER_VISA_MASK)
        setCvc3()
    }

    const setCardTypeAsMasterCard = () => {
        setCardNumberMask(CREDIT_CARD_NUMBER_MASTERCARD_MASK)
        setCvc3()
    }

    const setCardTypeAsAmericanExpress = () => {
        setCardNumberMask(CREDIT_CARD_NUMBER_AMEX_MASK)
        setCvc4()
    }

    const setCardTypeAsDiscover = () => {
        setCardNumberMask(CREDIT_CARD_NUMBER_DISCOVER_MASK)
        setCvc3()
    }

    // const setCardTypeAsDiners = () => {
    //     setCardNumberMask(CREDIT_CARD_NUMBER_DINERS_MASK)
    //     setCvc3()
    // }

    // const setCardTypeAsJcb = () => {
    //     setCardNumberMask(CREDIT_CARD_NUMBER_JCB_MASK)
    //     setCvc3()
    // }

    const keyCodeFromEvent = e => {
        return e.which || e.keyCode
    }

    const keyIsCommandFromEvent = e => {
        return e.ctrlKey || e.metaKey
    }

    const refreshCardNumberFormat = (string) => {
        let numbersOnly = numbersOnlyString(string),
            formattedNumber = applyMaskFormat(numbersOnly, cardNumberMask)
        setCardNumber(formattedNumber)
    }

    const refreshCardTypeIcon = () => {
        setCardTypeIconFromNumber(numbersOnlyString(cardNumber))
    }

    const refreshExpiryMonthYearInput = string => {
        let numbersOnly = numbersOnlyString(string),
            formattedNumber = applyMaskFormat(numbersOnly, EXPIRY_MASK)

        setExpiryMonthYear(formattedNumber)
    }

    const refreshExpiryMonthValidation = () => {
        // setExpiryMonth(_expiryMonth())
        setExpiryYear(expiryMonthYear.length == 7 ? expiryMonthYear.substr(5, 2) : null)
        isExpiryValid(expiryMonth, expiryYear)
            ?
            setExpiryMonthValid(true)
            :
            setExpiryMonthValid(false)
    }

    const refreshCvc = string => {
        var numbersOnly = numbersOnlyString(string);
        var formattedNumber = applyFormatMask(numbersOnly, cardNumberMask)
        setCvn(formattedNumber)
    }

    const _expiryMonth = () => {
        return expiryMonthYear.length >= 2 ? parseInt(expiryMonthYear.substr(0, 2)) : null
    }

    const keyIsTopNumber = e => {
        let keyCode = keyCodeFromEvent(e)
        return keyCode >= KEYS["0"] && keyCode <= KEYS["9"]
    }

    const keyIsKeypadNumber = e => {
        let keyCode = keyCodeFromEvent(e)
        return keyCode >= KEYS["NUMPAD_0"] && keyCode <= KEYS["NUMPAD_9"]
    }

    const keyIsNumber = e => {
        return keyIsTopNumber(e) || keyIsKeypadNumber(e)
    }

    const keyIsDelete = e => {
        return keyCodeFromEvent(e) == KEYS["DELETE"]
    }

    const keyIsBackspace = e => {
        return keyCodeFromEvent(e) == KEYS["BACKSPACE"]
    }

    const keyIsDeletion = e => {
        return keyIsDelete(e) || keyIsBackspace(e)
    }

    const keyIsArrow = e => {
        let keyCode = keyCodeFromEvent(e)
        return keyCode >= KEYS["ARROW_LEFT"] && keyCode <= KEYS["ARROW_DOWN"]
    }

    const keyIsNavigation = e => {
        let keyCode = keyCodeFromEvent(e)
        return keyCode == KEYS["HOME"] || keyCode == KEYS["END"]
    }

    const keyIsKeyboardCommand = e => {
        let keyCode = keyCodeFromEvent(e)
        return keyIsCommandFromEvent(e) && (
            keyCode == KEYS["A"] ||
            keyCode == KEYS["X"] ||
            keyCode == KEYS["C"] ||
            keyCode == KEYS["V"]
        )
    }

    const keyIsTab = e => {
        return keyCodeFromEvent(e) == KEYS["TAB"]
    }

    const filterNumberOnlyKey = e => {
        let isNumber = keyIsNumber(e),
            isDeletion = keyIsDeletion(e),
            isArrow = keyIsArrow(e),
            isNavigation = keyIsNavigation(e),
            isKeyboardCommand = keyIsKeyboardCommand(e),
            isTab = keyIsTab(e)

        if (!isNumber && !isDeletion && !isArrow && !isNavigation && !isKeyboardCommand && !isTab)
            e.preventDefault()
    }

    const caretStartPosition = element => {
        if (typeof element.selectionStart == "number")
            return element.selectionStart
        return false
    }

    const caretEndPosition = element => {
        if (typeof element.selectionEnd == "number")
            return element.selectionEnd
        return false
    }

    const setCaretPosition = (element, caretPos) => {
        if (element != null)
            if (element.createTextRange) {
                let range = element.createTextRange()
                range.move('character', caretPos)
                range.select()
            }
            else {
                if (element.selectionStart) {
                    element.focus()
                    element.setSelectionRange(caretPos, caretPos)
                } else {
                    element.focus()
                }
            }
    }

    const normalizeCaretPosition = (mask, caretPosition) => {
        let numberPos = 0
        if (caretPosition < 0 || caretPosition > mask.length) return 0
        for (let i = 0; i < mask.length; i++) {
            if (i == caretPosition) return numberPos
            if (mask[i] == "X") numberPos++
        }
        return numberPos
    }

    const denormalizeCaretPosition = (mask, caretPosition) => {
        let numberPos = 0
        if (caretPosition < 0 || caretPosition > mask.length) return 0
        for (let i = 0; i < mask.length; i++) {
            if (numberPos == caretPosition) return i
            if (mask[i] == "X") numberPos++
        }
        return mask.length
    }

    const digitFromKeyCode = keyCode => {
        if (keyCode >= KEYS["0"] && keyCode <= KEYS["9"])
            return keyCode - KEYS["0"]

        if (keyCode >= KEYS["NUMPAD_0"] && keyCode <= KEYS["NUMPAD_9"])
            return keyCode - KEYS["NUMPAD_0"]

        return null
    }

    const handleMaskedNumberInputKey = (e, mask, setValue) => {
        filterNumberOnlyKey(e)

        let keyCode = e.which || e.keyCode,
            element = e.target,
            caretStart = caretStartPosition(element),
            caretEnd = caretEndPosition(element),


            normalizedStartCaretPosition = normalizeCaretPosition(mask, caretStart),
            normalizedEndCaretPosition = normalizeCaretPosition(mask, caretEnd),

            newCaretPosition = caretStart,

            isNumber = keyIsNumber(e),
            isDelete = keyIsDelete(e),
            isBackspace = keyIsBackspace(e)

        if (isNumber || isDelete || isBackspace) {
            e.preventDefault()
            let rawText = element.value,
                numbersOnly = numbersOnlyString(rawText),
                digit = digitFromKeyCode(keyCode),
                rangeHighlighted = normalizedEndCaretPosition > normalizedStartCaretPosition
            if (rangeHighlighted)
                numbersOnly = (numbersOnly.slice(0, normalizedStartCaretPosition) + numbersOnly.slice(normalizedEndCaretPosition))

            if (caretStart != mask.length) {
                if (isNumber && rawText.length <= mask.length) {
                    numbersOnly = (numbersOnly.slice(0, normalizedStartCaretPosition) + digit + numbersOnly.slice(normalizedStartCaretPosition))
                    newCaretPosition = Math.max(
                        denormalizeCaretPosition(mask, normalizedStartCaretPosition + 1),
                        denormalizeCaretPosition(mask, normalizedStartCaretPosition + 2) - 1
                    )
                }
                if (isDelete)
                    numbersOnly = (numbersOnly.slice(0, normalizedStartCaretPosition) + numbersOnly.slice(normalizedStartCaretPosition + 1))
            }
            if (caretStart != 0)
                if (isBackspace && !rangeHighlighted) {
                    numbersOnly = (numbersOnly.slice(0, normalizedStartCaretPosition - 1) + numbersOnly.slice(normalizedStartCaretPosition))
                    newCaretPosition = denormalizeCaretPosition(mask, normalizedStartCaretPosition - 1)
                }

            setValue(applyMaskFormat(numbersOnly, mask))

            setCaretPosition(element, newCaretPosition)
        }
    }

    const handleCvn = cvn => setCvn(cvn)

    const handleCreditCardNumberKey = e => {
        handleMaskedNumberInputKey(e, cardNumberMask, setCardNumber)
    }

    const handleCcPaste = e => {
        let data = (e.clipboardData || window.clipboardData).getData('text')
        setTimeout(() => {
            refreshCardNumberFormat(data)
            refreshCardTypeIcon()
        }, 1)
    }

    const handleExpiryPaste = e => {
        let data = (e.clipboardData || window.clipboardData).getData('text')
        setTimeout(() => {
            refreshExpiryMonthYearInput(data)
        }, 1)
    }

    const handleExpiryKey = e => {
        handleMaskedNumberInputKey(e, EXPIRY_MASK, setExpiryMonthYear)
    }

    const handleExpiry = e => {
        handleExpiryKey(e)
        let value = e.target.value

        if (value.length == 1 && parseInt(value) > 1 && keyIsNumber(e)) {
            setExpiryMonthYear(applyMaskFormat(`0${value}`, EXPIRY_MASK))
        }
        setExpiryMonth(_expiryMonth())
        setExpiryYear(value.length == 7 ? value.substr(5, 2) : null)
    }

    const handleCvcKey = e => {
        handleMaskedNumberInputKey(e, cvcMask, setCvn)
    }

    const handleCvc = e => {
        handleCvcKey(e)
    }

    const handleCvcPaste = e => {
        let data = (e.clipboardData || window.clipboardData).getData('text')
        setTimeout(() => {
            refreshCvc(data)
        }, 1)
    }

    const isValidMonth = month => (month >= 1 && month <= 12)

    const isExpiryValid = (month, year) => {
        let today = new Date(),
            currentMonth = (today.getMonth() + 1),
            currentYear = `${today.getFullYear()}`

        if ((`${year}`).length == 2)
            year = currentYear.substring(0, 2) + "" + year

        currentMonth = parseInt(currentMonth)
        currentYear = parseInt(currentYear)
        month = parseInt(month)
        year = parseInt(year)

        return isValidMonth(month) && (
            (year > currentYear) || (year == currentYear && month >= currentMonth)
        )
    }

    const handlePage = string => {
        switch (string) {
            case 'previous':
                setPage(page - 1)
                break;

            case 'next':
                setPage(page + 1)

            default:
                break;
        }
    }

    const handleInputAlerts = (payload) => {
        setAlerts(payload)
    }

    const handleName = name => {
        let fname = firstName, lname = lastName

        if (/\s/g.test(name)) {
            let names = name.split(' ')

            lname = names.pop()
            fname = names.join(' ')
        }

        setFirstName(fname)
        setLastName(lname)
    }

    const handleDonation = async () => {
        const data = {
            card: {
                number: cardNumber,
                expirationMonth: expiryMonth,
                expirationYear: expiryYear,
                cvc: cvn
            },
            amount: {
                totalAmount: amount,
                currency: "USD"
            },
            billTo: {
                firstName: firstName,
                lastName: lastName,
                address1: address,
                locality: state,
                administrativeArea: city,
                postalCode: postalCode,
                country: country_code,
                email: email,
                phoneNumber: phone
            },
            payment: {
                recurring: false,
                frequency: "monthly"
            }
        }

        sendEmail({
            variables: {
                to: "otienog1@gmail.com,otienog1@yahoo.com",
                from: email,
                subject: `New donation from ${firstName} ${lastName}`,
                body: `
                <p><strong>THIS IS A TEST EMAIL!</strong><br />
                    A donation has been sent from the LFF Website's donations Form! The details are listed below.
                </p>
                <table>
                <tbody>
                <tr>
                <td>Card Holder's Name<td>
                <td> ${firstName} ${lastName}<td>
                </tr>
                <tr>
                <td>Email<td>
                <td> ${email}<td>
                </tr>
                <tr>
                <td>Phone<td>
                <td> ${phone}<td>
                </tr>
                <tr>
                <td>Country<td>
                <td> ${country} ${country_code}<td>
                </tr>
                <tr>
                <td>Address<td>
                <td> ${address}<td>
                </tr>
                <tr>
                <td>City<td>
                <td> ${city}<td>
                </tr>
                <tr>
                <td>State<td>
                <td> ${state}<td>
                </tr>
                <tr>
                <td>Postal Code<td>
                <td> ${postalCode}<td>
                </tr>
                <tr>
                <td>Amount<td>
                <td> USD ${amount}<td>
                </tr>
                <tr>
                <td>Card Number<td>
                <td> ${cardNumber}<td>
                </tr>
                <tr>
                <td>Expiry<td>
                <td> ${expiryMonth} / ${expiryYear}<td>
                </tr>
                <tr>
                <td>CVV<td>
                <td> ${cvn}<td>
                </tr>
                </tbody>
                </table>`
            }
        }).then(() => {
            setFirstName('')
            setLastName('')
            setEmail('')
            setPhone('')
            setCardNumber('')
            setCountry('')
            setCountry_code('')
            setAddress('')
            setCity('')
            setState('')
            setPostalCode('')
            setExpiryMonth('')
            setExpiryYear('')
            setExpiryMonthYear('')
            setCvn('')
        })

        // console.log(data)

        // await fetch('http://localhost:8080/api/payment', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // }).then(response => response.json().then(data => {
        //     if ('data' in data) {

        //         let title, message, type;
        //         if (data.data.status == 'AUTHORIZED') {
        //             title = 'Payment Authorized'
        //             message = 'Payment request has been authorized successfully'
        //             type = 'success'
        //         }

        //         if (data.data.status == 'DECLINED') {
        //             title = 'Payment Request Declined'
        //             message = data.data.errorInformation.message
        //             type = 'error'
        //         }

        //         setAlerts({
        //             title: title,
        //             message: {
        //                 message: message
        //             },
        //             type: type
        //         })
        //         return

        //     } else if ('error' in data) {
        //         const message = data.error.response.text,
        //             parsedMessage = JSON.parse(message)

        //         let title;
        //         if (parsedMessage.reason == 'INVALID_DATA')
        //             title = 'Invalid data supplied in the request'

        //         setAlerts({
        //             title: title,
        //             message: {
        //                 message: parsedMessage.message
        //             },
        //             type: 'error'
        //         })
        //     }
        // })).catch(() => setAlerts({
        //     title: 'Unknown error occured',
        //     message: {
        //         message: 'Please reload the page and try Again'
        //     },
        //     type: 'error'
        // }))
    }

    return (
        <div ref={form} className="flex min-h-screen items-center py-8">
            <div className="w-full">
                <div className="flex justify-between font-sen text-lff_700 tracking-widest">
                    <span className={`${page == 1 ? 'text-lff_900' : ''}`}>1. Donations</span>
                    <span className={`${page == 2 ? 'text-lff_900' : ''}`}>2. Details</span>
                    <span className={`${page == 3 ? 'text-lff_900' : ''}`}>3. Address</span>
                    <span className={`${page == 4 ? 'text-lff_900' : ''}`}>4. Confirm</span>
                </div>

                <div className={`${page === 1 ? `block` : `hidden`}`}>
                    <DonationAmount
                        handleAmount={handleAmount}
                        amount={amount}
                        alert={alerts}
                    />
                </div>

                <div className={`${page === 2 ? `block` : `hidden`}`}>
                    <UserInfo
                        handleUserInfo={handleUserInfo}
                        details={{
                            fname: firstName,
                            lname: lastName,
                            email: email,
                            phone: phone
                        }}
                        alert={alerts}
                    />
                </div>

                <div className={`${page === 3 ? `block` : `hidden`}`}>
                    <Address
                        handleAddress={handleAddressInfo}
                        address={{
                            address: address,
                            country: country,
                            city: city,
                            state: state,
                            postalCode: postalCode
                        }}
                        alert={alerts}
                    />
                </div>

                <div className={`${page === 4 ? `block` : `hidden`}`}>
                    <PaymentInfo
                        cardNumber={cardNumber}
                        cardType={cardType}
                        handleCcPaste={handleCcPaste}
                        refreshCardTypeIcon={refreshCardTypeIcon}
                        expiryMonthYear={expiryMonthYear}
                        cvcInput={cvcInput}
                        handleCreditCardNumberKey={handleCreditCardNumberKey}
                        handleExpiry={handleExpiry}
                        handleExpiryPaste={handleExpiryPaste}
                        refreshExpiryMonthValidation={refreshExpiryMonthValidation}
                        cvn={cvn}
                        handleCvn={handleCvn}
                        name={{
                            first: firstName,
                            last: lastName
                        }}
                        handleName={handleName}
                        alert={alerts}
                        amount={amount}
                        state={state}
                        city={city}
                        country={country}
                        email={email}
                        phone={phone}
                        address={address}
                        postalCode={postalCode}
                        page={page}
                    />
                </div>

                <Navigation
                    page={page}
                    handlePage={handlePage}
                    amount={amount}
                    userInfo={{
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phone: phone
                    }}
                    addressInfo={{
                        country: country,
                        address: address,
                        city: city,
                        state: state,
                        postalCode: postalCode
                    }}
                    paymentInfo={{
                        name: `${firstName} ${lastName}`,
                        cardNumber: cardNumber,
                        expiryMonthYear: expiryMonthYear,
                        cvn: cvn
                    }}
                    handleDonation={handleDonation}
                    handleInputAlerts={handleInputAlerts}

                />
            </div>
        </div >
    )
}

const Navigation = ({ page, handlePage, amount, userInfo, addressInfo, paymentInfo, handleDonation, handleInputAlerts }) => {

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

        if (page == 2)
            for (let [key, value] of Object.entries(userInfo)) {
                if (isEmpty(value)) {
                    if (key == 'firstName')
                        error = 'First Name is required'
                    else if (key == 'lastName')
                        error = 'First Name is required'
                    else if (key == 'email')
                        error = 'Email address is required'
                    else if (key == 'phone')
                        error = 'Phone number is required'

                    alerts.message[`${key}`] = error

                    alerts.type = 'error'
                }
            }

        if (page == 3)
            for (let [key, value] of Object.entries(addressInfo)) {
                if (isEmpty(value)) {
                    if (key == 'country')
                        error = 'Country is required'
                    else if (key == 'address')
                        error = 'Address is required'
                    else if (key == 'city')
                        error = 'City address is required'
                    else if (key == 'state')
                        error = 'State number is required'
                    else if (key == 'postalCode')
                        error = 'Postal Code number is required'

                    alerts.message[`${key}`] = error
                    alerts.type = 'error'
                }
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
        if (page == 4)
            for (let [key, value] of Object.entries(paymentInfo)) {
                if (isEmpty(value)) {
                    if (key == 'name')
                        error = 'Name is required'
                    else if (key == 'cardNumber')
                        error = 'Card number is required'
                    else if (key == 'expiryMonthYear')
                        error = 'Expiration address is required'
                    else if (key == 'cvn')
                        error = 'CVC is required'

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
        handleDonation()
        handleInputAlerts(alerts = {})
    }

    let amountF = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })

    return (
        <div className={`flex ${page > 1 ? `justify-between` : `justify-end`} mt-20`}>
            <button
                className={`${page > 1 ? `flex` : `hidden`} text-lff_800 flex font-sen items-center text-base bg-transparentpy-3 space-x-3 w-48`}
                onClick={() => previous()}
            >
                <span className="">
                    <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.83984 1.35327L0.839844 9.35327L8.83984 17.3533" stroke="#3F3F3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
                <span className="h-5">PREVIOUS</span>
            </button>
            <button
                className="donate-button text-lff_800 flex font-sen items-center text-sm  py-4 space-x-3 border-solid border border-lff_800 w-48 justify-center bg-lff_200 hover:bg-lff_400 disabled:opacity-50"
                onClick={() => page == 4 ? donate() : next()}
            // disabled={disabled ? true : false}
            >
                {page == 4 ? (
                    <>
                        <span className="">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.4135 13.8736C8.18683 13.9536 7.8135 13.9536 7.58683 13.8736C5.6535 13.2136 1.3335 10.4602 1.3335 5.79356C1.3335 3.73356 2.9935 2.06689 5.04016 2.06689C6.2535 2.06689 7.32683 2.65356 8.00016 3.56023C8.6735 2.65356 9.7535 2.06689 10.9602 2.06689C13.0068 2.06689 14.6668 3.73356 14.6668 5.79356C14.6668 10.4602 10.3468 13.2136 8.4135 13.8736Z" fill="#F6FFEB" stroke="#3F3F3F" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span className="h-5">DONATE <span className="">{amountF.format(amount)}</span></span>
                    </>
                ) : (
                    <>
                        <span className="h-5">NEXT</span>
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
    )
}

const DonationAmount = ({ handleAmount, amount, alert }) => {
    let amountInput = useRef()

    const clearAmount = () => amountInput.current.value = ""

    let amountF = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })

    const _amounts1 = ['10.00', '50.00', '100.00']
    const _amounts2 = ['1000.00', '5000.00', '10000.00']

    return (
        <>
            <div className="font-sorts text-3xl my-16 text-lff_900">Donation Amount: {amountF.format(amount)}</div>

            <div className={`${Object.keys(alert).length == 0 ? `hidden` : `flex`}`}>
                <Alert alert={alert} />
            </div>

            <div className="flex text-center flex-wrap space-x-4 mb-4 flex-grow">

                {_amounts1.map((_amount, i) => (
                    <div
                        onClick={() => { handleAmount(_amount); clearAmount() }}
                        className={
                            `${Number(amount) === Number(_amount) ? `bg-lff_500 text-lff_800 border-lff_800 ` : `bg-transparent text-lff_700 border-lff_600`} 
                            hover:bg-lff_500 hover:text-lff_800 hover:border-lff_800 transition-all duration-500 ease-in-out 
                            flex font-sen text-base  py-4 border border-solid  justify-center cursor-pointer tracking-widest flex-grow z-50`
                        }
                        key={i}
                    >{amountF.format(_amount)}</div>

                ))}
            </div>
            <div className="flex text-center flex-wrap space-x-4 flex-grow">

                {_amounts2.map((_amount, i) => (
                    <div
                        onClick={() => { handleAmount(_amount); clearAmount() }}
                        className={
                            `${Number(amount) === Number(_amount) ? `bg-lff_500 text-lff_800 border-lff_800 ` : `bg-transparent text-lff_700 border-lff_600`} 
                            hover:bg-lff_500 hover:text-lff_800 hover:border-lff_800 transition-all duration-500 ease-in-out 
                            flex font-sen text-base  py-4 border border-solid  justify-center cursor-pointer tracking-widest flex-grow z-50`
                        }
                        key={i}
                    >{amountF.format(_amount)}</div>

                ))}
            </div>

            <div className="w-full z-50 relative">
                {/* <span className="block text-lff_800 font-sorts mt-16 text-xl">Other Amount</span> */}
                <div className="flex font-sen text-base mt-16">
                    <span className="-mr-1 py-1.5">$</span>
                    <input
                        ref={amountInput}
                        className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 px-4 leading-tight focus:outline-none placeholder-lff_700 text-lff_800 w-full"
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

const UserInfo = ({ handleUserInfo, details, alert, hasError }) => {
    return (
        <>
            <div className="font-sorts text-3xl my-10 text-lff_900">User details</div>

            <div className={`${Object.keys(alert).length == 0 ? `hidden` : `flex`}`}>
                <Alert alert={alert} />
            </div>

            <div className="flex justify-between flex-col relative z-50">
                <div className="w-full mb-5">
                    <label htmlFor="fname" className="font-sorts mb-4 text-lg text-lff_900">First Name</label>
                    <input
                        id="fname"
                        className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                        type="text"
                        placeholder="Enter your First Name"
                        onChange={e => handleUserInfo('firstName', e.target.value)}
                        value={details.fname}
                    />
                </div>
                <div className="w-full mb-5">
                    <label htmlFor="lname" className="font-sorts mb-4 text-lg text-lff_900">Last Name</label>
                    <input
                        id="lname"
                        className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                        type="text"
                        placeholder="Enter your Last Name"
                        onChange={e => handleUserInfo('lastName', e.target.value)}
                        value={details.lname}
                    />
                </div>
                <div className="w-full mb-5" >
                    <label htmlFor="email" className="font-sorts mb-4 text-lg text-lff_900">Email</label>
                    <input
                        id="email"
                        className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                        type="email"
                        placeholder="Enter your Email"
                        onChange={e => handleUserInfo('email', e.target.value)}
                        value={details.email}
                    />
                </div >
                <div className="w-full">
                    <label htmlFor="phone" className="font-sorts mb-4 text-lg text-lff_900">Phone</label>
                    <input
                        id="phone"
                        className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                        type="tel"
                        placeholder="Enter your phone number"
                        onChange={e => handleUserInfo('phone', e.target.value)}
                        value={details.phone}
                    />
                </div>
            </div>
        </>
    )
}

const Address = ({ handleAddress, address, alert }) => {
    const [country, setCountry] = useState('')

    useEffect(() => {
        if (country.length > 0) handleAddress('country', country[0])
    }, [country])

    return (
        <>
            <div className="font-sorts text-3xl my-10 text-lff_900">Contact details</div>

            <div className={`${Object.keys(alert).length == 0 ? `hidden` : `flex`}`}>
                <Alert alert={alert} />
            </div>

            <div className="flex justify-between flex-col relative z-50">
                <div className="w-full mb-5">
                    <label htmlFor="country" className="font-sorts mb-4 text-lg text-lff_900">Country</label>
                    <Select options={countries} name="country" placeholder="Enter your country" handleValue={setCountry} />
                </div>
                <div className="w-full mb-5">
                    <label htmlFor="address" className="font-sorts mb-4 text-lg text-lff_900">Address</label>
                    <div className="flex font-sen py-0.5">
                        <input
                            id="address"
                            className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                            type="text"
                            placeholder="Enter your address"
                            value={address.address}
                            onChange={e => handleAddress('address', e.target.value)}
                        />
                    </div>

                </div>
                <div className="w-full mb-5">
                    <label htmlFor="city" className="font-sorts mb-4 text-lg text-lff_900">City</label>
                    <div className="flex font-sen py-0.5">
                        <input
                            id="city"
                            className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                            type="text"
                            placeholder="Enter your city"
                            value={address.city}
                            onChange={e => handleAddress('city', e.target.value)}
                        />
                    </div>

                </div>
                <div className="w-full mb-5">
                    <label htmlFor="state" className="font-sorts mb-4 text-lg text-lff_900">State</label>
                    <div className="flex font-sen py-0.5">
                        <input
                            id="state"
                            className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                            type="text"
                            placeholder="Enter your state"
                            value={address.state}
                            onChange={e => handleAddress('state', e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="postalCode" className="font-sorts mb-4 text-lg text-lff_900">Postal Code</label>
                    <div className="flex font-sen py-0.5">
                        <input
                            id="postalCode"
                            className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                            type="number"
                            placeholder="Enter your postal code"
                            value={address.postalCode}
                            onChange={e => handleAddress('postalCode', e.target.value)}
                        />
                    </div>

                </div>
            </div>
        </>
    )
}

const PaymentInfo = ({
    cardNumber,
    cardType,
    expiryMonthYear,
    cvcInput,
    refreshCardTypeIcon,
    handleCreditCardNumberKey,
    handleExpiry,
    handleExpiryPaste,
    refreshExpiryMonthValidation,
    cvn,
    handleCvn,
    name,
    handleName,
    alert,
    state,
    city,
    country,
    email,
    phone,
    address,
    postalCode,
    amount,
    page,
}) => {
    const [active, setActive] = useState('card')
    const paypal = useRef(null)

    useEffect(() => {
        paypal.current.children[0].style.width = '50%'

        if (active == 'paypal' && page == 4) {
            document.querySelector('.donate-button').classList.add('hidden')
        }
        else {
            document.querySelector('.donate-button').classList.remove('hidden')
        }
    }, [active, page])

    return (
        <>
            <div className="font-sorts text-3xl my-10 text-lff_900">Payment method</div>

            <div className={`${Object.keys(alert).length == 0 ? `hidden` : `flex`}`}>
                <Alert alert={alert} />
            </div>

            <div className="flex mb-8 space-x-8">
                <label className={`${active == `card` ? `bg-lff_400` : ''} flex border border-solid border-lff_700 rounded-sm items-center w-1/2 p-4 justify-between cursor-pointer z-50`}>
                    <span className="flex items-center">
                        <span>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 12.7573H33" stroke="#1D854A" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 24.7573H12" stroke="#1D854A" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15.75 24.7573H21.75" stroke="#1D854A" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.66 5.25732H26.325C31.665 5.25732 33 6.57732 33 11.8423V24.1573C33 29.4223 31.665 30.7423 26.34 30.7423H9.66C4.335 30.7573 3 29.4373 3 24.1723V11.8423C3 6.57732 4.335 5.25732 9.66 5.25732Z" stroke="#1D854A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                    <input type="radio" className="form-radio text-lff_800" name="radio" value="1" checked={active == 'card' ? true : false} onChange={() => setActive('card')} />
                </label>
                <label className={`${active == `paypal` ? `bg-lff_400` : ''} flex border border-solid border-lff_700 rounded-sm items-center w-1/2 p-4 justify-between cursor-pointer z-50`}>
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
                    <input type="radio" className="form-radio text-lff_800" name="radio" value="1" onChange={() => setActive('paypal')} />
                </label>
            </div>

            <div>
                <div className={`${active == 'card' ? 'block' : 'hidden'}`}>
                    <div className="w-full relative z-50 mb-5">
                        <label htmlFor="cardholder" className="font-sorts mb-4 text-lg text-lff_900">Cardholder Name</label>
                        <input
                            id="cardholder"
                            className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                            type="text"
                            placeholder={`${name.first} ${name.last}`}
                            onChange={e => handleName(e.target.value)}
                        />
                    </div>
                    <div className="w-full relative z-50 mb-5">
                        <label htmlFor="cardnumber" className="font-sorts mb-4 text-lg text-lff_900">Card Number</label>
                        <div className="flex items-center">
                            <input
                                id="cardnumber"
                                className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                                type="tel"
                                placeholder="xxxx xxxx xxxx xxxx"
                                onKeyDown={e => handleCreditCardNumberKey(e)}
                                onKeyUp={() => refreshCardTypeIcon()}
                                onPaste={e => handleCcPaste(e)}
                                value={cardNumber}
                            />
                            <div className="">
                                <span className={cardType === '001' ? 'flex' : 'hidden'}>
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
                                <span className={cardType === '002' ? 'flex' : 'hidden'}>
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
                                <span className={cardType === '003' ? 'flex' : 'hidden'}>
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
                                <span className={cardType === '004' ? 'flex' : 'hidden'}>
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
                            </div>
                        </div>

                    </div>
                    <div className="w-full flex space-x-16 relative z-50">
                        <div className="w-1/2">
                            <label htmlFor="expiry" className="font-sorts mb-4 text-lg text-lff_900">Expiry</label>
                            <input
                                id="expiry"
                                className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                                type="tel"
                                placeholder="mm / yy"
                                onKeyDown={e => handleExpiry(e)}
                                onBlur={() => refreshExpiryMonthValidation()}
                                onPaste={e => handleExpiryPaste(e)}
                                value={expiryMonthYear}
                            />
                        </div>
                        <div className="w-1/2 relative z-50">
                            <label htmlFor="cvn" className="font-sorts mb-4 text-lg text-lff_900">CVC</label>
                            <input
                                ref={cvcInput}
                                id="cvn"
                                className="appearance-none font-sen bg-transparent border-b border-solid border-lff_700 focus:border-lff_800 py-2 focus:outline-none placeholder-lff_700 text-lff_800 w-full"
                                type="password"
                                placeholder="xxx"
                                onChange={e => handleCvn(e.target.value)}
                                value={cvn}
                            />
                        </div>
                    </div>
                </div>
                <div ref={paypal} className={`${active == 'paypal' ? 'block' : 'hidden'} flex justify-center py-16`}>
                    <PayPal
                        opt={
                            {
                                amount: amount,
                                name: name,
                                address: address,
                                city: city,
                                state: state,
                                country: country,
                                postalCode: postalCode,
                                email: email,
                                phone: phone
                            }
                        }
                    />
                </div>
            </div>
        </>
    )
}

const PayPal = ({ opt }) => {
    const approveOrder = async (data, actions) => {
        return actions.order.capture().then(details => {
            const name = `${details.payer.name.given_name} ${details.payer.name.surname}`;
            console.log(details)
        });
    }

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
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
                            category: "DONATION"
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
                "client-id": "Aa5CY17icgSMkET-vRSn6f-BI3bEi0aRgwFRFY5fbufk6AXA4HBFB9vRJt-I0CmWiGWVThzHlTOEzNpo",
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