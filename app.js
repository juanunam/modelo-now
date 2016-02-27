'use strict';

const Express = require('express');

const app = Express();

app.set('etag', 'strong');

app.get('/', (req, res) => {
	res.send('Hello world.');
});

app.listen(3000, () => console.log('Server running on port 3000.'));

