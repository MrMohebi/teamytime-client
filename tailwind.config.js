module.exports = {
    important: true,
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {

            maxWidth: {
                'btn-max-width': '26rem',
            },
            colors: {


                'background': '#151E27',
                'primary-dark': '#202E3B',
                'secondary': '#1D2731',
                'text-blue-light': '#D8EEFF',
                'deactive-border': '#304050',
                'hint-text': '#4E5760',
                'red': '#EB6868',

                'primary': '#68B4EB',
                'primary-light': '#f1f5f8',
                'default': '#f0f2f5',
                'notEmphasis': '#9db1c0',
                'white': '#fefeff',
            },
        }
    },
    plugins: [],
}
