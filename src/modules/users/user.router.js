import {handlerError} from "../../helpers/handler-error.js";
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';



let userDb = [];

export const handleUserRequests = async (req, res) => {
    try {

        const path = req.url.split('/');
        const userId = path[3];
        const isValidId = uuidValidate(userId);

        if ((req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE') && path.length === 4 && !isValidId) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Invalid userId' }));
            return;
        }

        if (req.method === 'GET' && path.length === 3) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(userDb));
        } else if (req.method === 'GET' && path.length === 4) {
            const user = userDb.find(u => u.id === userId);
            if (!user) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'User not found' }));
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(user));
            }
        } else if (req.method === 'POST' && path.length === 3) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const { username, age, hobbies } = JSON.parse(body);
                    if (!username || !age || !Array.isArray(hobbies)) {
                        res.statusCode = 400;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Invalid request body' }));
                    } else {
                        const createdUser = { id: uuidv4(), username, age, hobbies };
                        userDb.push(createdUser);
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(createdUser));
                    }
                } catch (error) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Invalid JSON' }));
                }
            });
        } else if (req.method === 'PUT' && path.length === 4) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const { username, age, hobbies } = JSON.parse(body);
                const index = userDb.findIndex(u => u.id === userId);
                if (index === -1) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'User not found' }));
                } else if (!username || !age || !Array.isArray(hobbies)) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Invalid request body' }));
                } else {
                    userDb[index] = { id: userId, username, age, hobbies };
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(userDb[index]));
                }
            });
        } else if (req.method === 'DELETE' && path.length === 4) {
            const index = userDb.findIndex(u => u.id === userId);
            if (index === -1) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'User not found' }));
            } else {
                userDb.splice(index, 1);
                res.statusCode = 204;
                res.end();
            }
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Resource not found' }));
        }
    } catch (err) {
        handlerError(res, err);
    }
};
