import express from 'express';
const app = express()
const port = 3000
const HTTP_REQUESTS = {
    OK_200: 200,

}

const jsonMiddleware = express.json();
app.use(jsonMiddleware)

const db = {
    users:[{id: 1, name: 'John', email: 'john@gmail.com'},
    {id: 2, name: 'Max', email: 'john@gmail.com'},
    {id: 3, name: 'Week', email: 'john@gmail.com'},
    {id: 4, name: 'Lock', email: 'john@gmail.com'},
]};

app.get('/users', (req, res) => {
    let foundUsers = db.users;
    if(req?.query?.title){
        foundUsers = db.users.filter((user) => user.name.
        indexOf(req?.query?.title as string) > -1);
    }
    res.json(foundUsers)
})

app.get('/users/:id', (req, res) => {

    const foundUser = db.users.find((user) => user.id === +req.params.id)
    if(!foundUser) {
        res.sendStatus(404)
        return;
    }
    res.json(foundUser)
})

app.post('/users', (req, res) => {
    if(!req.body.name) {
        res.sendStatus(404)
        return;
    }

    const newUser = {id: +new Date(), ...req.body}
    db.users.push(newUser);
    res.status(201)
    res.json(newUser);
});

app.delete('/users/:id', (req, res) => {
    db.users = db.users.filter((user) => user.id !== +req.params.id)

    res.sendStatus(204)
});

app.put('/users/:id', (req, res) => {
    if(!req.body.name) {
        res.sendStatus(400)
        return;
    }
    const foundUser = db.users.find((user) => user.id === +req.params.id)
    if(!foundUser) {
        res.sendStatus(404)
        return;
    }
    foundUser.name = req.body.name;
    res.json(foundUser)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
