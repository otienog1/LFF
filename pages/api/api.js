import Cors from 'cors'

const cors = Cors({
    methods: ['GET', 'POST']
})

const initMiddleware = (req, res, callback) => {
    return new Promise((resolve, reject) => {
        callback(req, res, result => {
            if (result instanceof Error)
                return reject(result)
            return resolve(result)
        })
    })
}

const handler = async (req, res) => {
    await initMiddleware(req, res, cors)

    res.json({ message: 'Hello World' })
}

export default handler