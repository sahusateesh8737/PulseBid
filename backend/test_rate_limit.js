const express = require('express');
const { authRateLimiter } = require('./src/middleware/rateLimiter');
const app = express();
app.post('/test', authRateLimiter, (req, res) => res.json({ success: true }));

const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log('Server started on port', port);
    
    let successCount = 0;
    let rateLimitCount = 0;
    
    for (let i = 0; i < 20; i++) {
        const res = await fetch(`http://127.0.0.1:${port}/test`, { method: 'POST' });
        if (res.status === 200) successCount++;
        else if (res.status === 429) rateLimitCount++;
    }
    
    console.log(`Success: ${successCount}, Rate Limited: ${rateLimitCount}`);
    server.close();
});
