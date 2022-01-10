module.exports = {
    mode: "jit",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        screens: {
            'sm': '576px',
            'md': '960px',
            'lg': '1440px',
            'xl': '1600px',
            '2xl': '1920px',
        },
        extend: {
            fontFamily: {
                itc: ["ITC Berkeley Oldstyle Std"],
                // sorts: ["Old Standard TT"],
                // sorts: ["Tenor Sans"],
                sen: ["'Sen', sans-serif"],
                sorts: ["'Sen', sans-serif"],
                poppins: ["poppins"],
                verl: ["Verlag"],
                tenor: ["Tenor Sans"],
            },
            backgroundColor: (theme) => ({
                lffgreen: "#145A32",
                lffvegas: "#C4B454",
                lffbg: "#FFECBC",
                lffdark: "#292D32",
                lfffooter: "#234A34",
                lfflighter: "#FFF7E1",
                lff_100: "#FFFBF2",
                lff_200: "#FFF8E4",
                lff_300: "#FFF4D7",
                lff_400: "#FFF0C9",
                lff_500: "#FFECBC",
                lff_600: "#CCBD96",
                lff_700: "#998E71",
                lff_800: "#665F4B",
                lff_900: "#332F26",
                lff_success: "#3BBA5D",
                lff_danger: "#E94F2C",
                lffgreen_400: "#437B5B",
                lffgreen_500: "#145A32",
                lffgreen_600: "#104828",
                lffvegas_100: "#F3F0DD",
                lffvegas_200: "#E7E1BB",
                lffvegas_300: "#DCD298",
                lffvegas_500: "#C4B454",
                lffvegas_600: "#9D9043",
                lffvegas_700: "#766C32",
            }),
            borderColor: () => ({
                lffgreen: "#145A32",
                lffvegas: "#C4B454",
                lffbg: "#FFECBC",
                lffdark: "#292D32",
                lff_100: "#FFFBF2",
                lff_200: "#FFF8E4",
                lff_300: "#FFF4D7",
                lff_400: "#FFF0C9",
                lff_500: "#FFECBC",
                lff_600: "#CCBD96",
                lff_700: "#998E71",
                lff_800: "#665F4B",
                lff_900: "#332F26",
                lff_success: "#3BBA5D",
                lff_danger: "#E94F2C",
                lffgreen_400: "#437B5B",
                lffgreen_500: "#145A32",
                lffgreen_600: "#104828",
                lffvegas_100: "#F3F0DD",
                lffvegas_200: "#E7E1BB",
                lffvegas_300: "#DCD298",
                lffvegas_500: "#C4B454",
                lffvegas_600: "#9D9043",
                lffvegas_800: "#4E4822",
            }),
            textColor: () => ({
                primary: "#3F3F3F",
                faded: "#292D32",
                lffbg: "#FFECBC",
                lffgreen: "#145A32",
                lfflight: "#FFFAED",
                lfflighter: "#FFF7E1",
                lff_100: "#FFFBF2",
                lff_200: "#FFF8E4",
                lff_300: "#FFF4D7",
                lff_400: "#FFF0C9",
                lff_500: "#FFECBC",
                lff_600: "#CCBD96",
                lff_700: "#998E71",
                lff_800: "#665F4B",
                lff_900: "#332F26",
                lff_success: "#3BBA5D",
                lff_danger: "#E94F2C",
                lffgreen_400: "#437B5B",
                lffgreen_500: "#145A32",
                lffgreen_600: "#104828",
                lffvegas_100: "#F3F0DD",
                lffvegas_200: "#E7E1BB",
                lffvegas_300: "#DCD298",
                lffvegas_500: "#C4B454",
                lffvegas_600: "#9D9043",
                lffvegas_700: "#766C32",
                lffvegas_800: "#4E4822",
                lffvegas_900: "#272411"
            }),
            placeholderColor: {
                lff_100: "#FFFBF2",
                lff_200: "#FFF8E4",
                lff_300: "#FFF4D7",
                lff_400: "#FFF0C9",
                lff_500: "#FFECBC",
                lff_600: "#CCBD96",
                lff_700: "#998E71",
                lff_800: "#665F4B",
                lff_900: "#332F26",
                lff_success: "#3BBA5D",
                lff_danger: "#E94F2C",
                lffvegas_100: "#F3F0DD",
                lffvegas_200: "#E7E1BB",
                lffvegas_300: "#DCD298",
                lffvegas_500: "#C4B454",
                lffvegas_600: "#9D9043",
                lffvegas_900: "#272411"
            },
            keyframes: {
                timer: {
                    to: { 'stroke-dashoffset': '0' },
                }
            },
            animation: {
                timer: 'timer 8s linear forwards',
            }
        },
    },
    corePlugins: {
        // container: false
    },
    plugins: [
        require('@tailwindcss/custom-forms'),
        function ({ addComponents }) {
            addComponents({
                '.container': {
                    maxWidth: '100%',
                    '@screen sm': {
                        maxWidth: '768px',
                    },
                    '@screen md': {
                        maxWidth: '1024px',
                    },
                    '@screen lg': {
                        maxWidth: '1024px',
                    },
                    '@screen xl': {
                        maxWidth: '1280px',
                    },
                    '@screen 2xl': {
                        maxWidth: '1536px',
                    },
                }
            })
        },
        function ({ addVariant, e }) {
            addVariant('third-child', ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    return `.${e(`third-child${separator}${className}`)}:nth-child(3)`
                })
            })
        }
    ]
};
