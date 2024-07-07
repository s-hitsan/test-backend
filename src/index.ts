import express, {Response} from 'express';
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {CreateUserModel, UpdateUserModel, GetUserQueryModel, DeleteUserModel, UserViewModel} from "./models";
import {URIParamUserIdModel} from "./models/URIParamsUserIdModel";
export const app = express()
const port = process.env.PORT || 3000;
export const HTTP_REQUESTS = {
    OK_200: 200,
}

const jsonMiddleware = express.json();
app.use(jsonMiddleware)

type UserType = {
    id: number;
    name: string;
    email: string;
}

const db: {users: UserType[]} = {
    users:[{id: 1, name: 'John', email: 'john@gmail.com'},
    {id: 2, name: 'Max', email: 'john@gmail.com'},
    {id: 3, name: 'Week', email: 'john@gmail.com'},
    {id: 4, name: 'Lock', email: 'john@gmail.com'},
]};

app.get('/users', (req: RequestWithQuery<GetUserQueryModel>, res: Response<UserViewModel[]>) => {
    let foundUsers = db.users;
    if(req.query.name){
        foundUsers = db.users.filter((user) => user.name.
        indexOf(req.query.name as string) > -1);
    }
    res.json(foundUsers)
})

app.delete('/__test__/data', (req, res) => {
    db.users = [];
    res.sendStatus(200);
})

app.get('/users/:id', (req: RequestWithParams<URIParamUserIdModel>, res) => {

    const foundUser = db.users.find((user) => user.id === +req.params.id)
    if(!foundUser) {
        res.sendStatus(404)
        return;
    }
    res.json(foundUser)
})

app.post('/users', (req: RequestWithBody<CreateUserModel>, res: Response<UserViewModel>) => {
    if(!req.body.name) {
        res.sendStatus(401)
        return;
    }

    const newUser = {id: +new Date(), ...req.body}
    db.users.push(newUser);
    res.status(201)
    res.json(newUser);
});

app.delete('/users/:id', (req: RequestWithParams<DeleteUserModel>, res) => {
    db.users = db.users.filter((user) => user.id !== +req.params.id)

    res.sendStatus(204)
});

app.put('/users/:id', (req: RequestWithParamsAndBody<URIParamUserIdModel, UpdateUserModel>, res: Response<UserViewModel>) => {
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
