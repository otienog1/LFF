module.exports = {
    mode: "jit",
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                itc: ["ITC Berkeley Oldstyle Std"],
                sorts: ["Old Standard TT"],
                verl: ["Verlag"],
            },
            backgroundColor: (theme) => ({
                lffgreen: "#145A32",
                lffvegas: "#C4B454",
                lffbg: "#FFECBC",
                lffdark: "#292D32",
                lfffooter: "#234A34",
                lfflighter: "#FFF7E1",
            }),
            borderColor: () => ({
                lffgreen: "#145A32",
                lffvegas: "#C4B454",
                lffbg: "#FFECBC",
                lffdark: "#292D32",
            }),
            textColor: () => ({
                primary: "#3F3F3F",
                faded: "#292D32",
                lffbg: "#FFECBC",
                lffgreen: "#145A32",
                lfflight: "#FFFAED",
                lfflighter: "#FFF7E1",
            }),
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
