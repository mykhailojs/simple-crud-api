import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

let users = [];

export const handleUserRequests = (req, res) => {
    try {
        const urlParts = req.url.split('/');
        const userId = urlParts[3];
        const isValidUUID = uuidValidate(userId);
        if ((req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE') && urlParts.length === 4 && !isValidUUID) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Invalid userId' }));
            return;
        }

        if (req.method === 'GET' && urlParts.length === 3) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(users));
        } else if (req.method === 'GET' && urlParts.length === 4) {
            const user = users.find(u => u.id === userId);
            if (!user) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'User not found' }));
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(user));
            }
        } else if (req.method === 'POST' && urlParts.length === 3) {
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
                        const newUser = { id: uuidv4(), username, age, hobbies };
                        users.push(newUser);
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(newUser));
                    }
                } catch (error) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Invalid JSON' }));
                }
            });
        } else if (req.method === 'PUT' && urlParts.length === 4) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const { username, age, hobbies } = JSON.parse(body);
                const userIndex = users.findIndex(u => u.id === userId);
                if (userIndex === -1) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'User not found' }));
                } else if (!username || !age || !Array.isArray(hobbies)) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Invalid request body' }));
                } else {
                    users[userIndex] = { id: userId, username, age, hobbies };
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(users[userIndex]));
                }
            });
        } else if (req.method === 'DELETE' && urlParts.length === 4) {
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'User not found' }));
            } else {
                users.splice(userIndex, 1);
                res.statusCode = 204;
                res.end();
            }
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Resource not found' }));
        }
    } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};
