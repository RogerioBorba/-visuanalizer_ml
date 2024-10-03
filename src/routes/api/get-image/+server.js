import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({url}) {    
    try {
        if (url.search.length == 0) {
            const msg = 'O parâmetro url não consta na requisição'
            console.log(msg)
            throw error(400, {message: msg});
        }
        const an_url = url.search.substring(5);
        console.log("AN_URL: " + an_url)
        if (!an_url) { 
            const msg = 'O parâmetro url não consta na requisição'
            console.log(msg)
            throw error(400, {message: msg});
        }
        const targetUrl = decodeURIComponent(an_url);
        // Envie a requisição ao servidor de destino
        console.log("routes>>api>>get-image>>server")
        const response = await fetch(targetUrl);
        // Verifique se o conteúdo retornado é uma imagem
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.startsWith('image/')) {
            // Força o Content-Type para image/png
            const imageBuffer = await response.arrayBuffer(); // Obtém a imagem como buffer
            return new Response(imageBuffer, {
                status: response.status,
                headers: {
                    'Content-Type': contentType,
                }
            });
        } else {
            const msg = 'O conteúdo solicitado não é uma imagem.'
            console.log(msg)
            return new Response(msg, { status: 400 });
        }
    } catch (err) {
        const msg = 'Erro ao acessar o servidor de destino';
        console.log(err)
        return new Response(err.body.message, { status: err.status });
    }
};
