const http = require('http');
const fs = require('fs');

const delay = (ms) => {
    return new Promise((res) => {
        setTimeout(() => res(), ms);
    })
}

const readFile = (path) => {
    return new Promise((res, rej) => {
        fs.readFile(path, (err, data) => {
            if (err) {rej(err)}
            else res(data);
        })
    })
}
const server = http.createServer(async (req, res) => {
    switch (req.url) {
        case '/favicon.ico':
            const data = await readFile('icon.png')
            res.write(data)
            res.end()
            break;
        case '/home':
            try {
                const homePage = await readFile('pages/home.html')
                res.write(homePage)
            } catch(err) {
                res.write('Something went wrong!')
            }
            res.end()
            break;
        case '/about':
            await delay(3000)
            res.write('ERROR')
            res.end()
            break;
        case '/operators':
            const start = new Date()
            while (new Date() - start < 3000) {
                console.log(new Date() - start)
            }
            res.write('Hello operators!')
            break;
        default:
            res.write('404')
    }
})

server.listen(3000)