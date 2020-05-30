const puppeteer = require('puppeteer');

const fs = require('fs');
const path = require('path');

class DiscordService {

    constructor() {
    }

    async checkUsers() {

        console.log('Checando...');

        const pathBanda = path.resolve(__dirname, `../banda.json`);

        let banda;

        if ( fs.existsSync(pathBanda) ) {
            banda = JSON.parse(fs.readFileSync(pathBanda));
        } else {
            banda = [];
        }

        try {
            const browser = await puppeteer.launch({ 
                args: ['--no-sandbox']
            });
    
            const page = await browser.newPage();
    
            await page.goto(`https://rol.fenixzone.com/u/${ banda[0].jugador }`, {
                timeout: 0,
                waitUntil: 'networkidle2'
            });
    
            await page.waitForNavigation({
                waitUntil: 'domcontentloaded'
            });
    
            page.removeAllListeners('response');
    
            for ( let i = 0; i < banda.length; i++ ) {
                await page.goto(`https://rol.fenixzone.com/u/${ banda[i].jugador }`, {
                    timeout: 0,
                    waitUntil: ['networkidle2', 'domcontentloaded']
                });
                const connected = await page.evaluate(() => {
                    return document.querySelector('.uc') !== null
                });
                console.log(banda[i].jugador, connected);
                banda[i] = {
                    jugador: banda[i].jugador,
                    estado: connected
                };
            }
            await browser.close();
    
            console.log(banda);
    
            return banda.filter( i => i.estado );
            
        } catch(err) {
            console.log(err);
            return null;
        }
    }
}

module.exports = DiscordService;    