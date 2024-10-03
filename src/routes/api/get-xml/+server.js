import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({url}) {    
    const an_url = url.search.substring(5);
    console.log("AN_URL: " + an_url)
    if (!an_url) throw error(400, 'O parâmetro url não consta na requisição');
    try {
        console.log("routes>>api>>get-xml>>server")
        let response = await fetch(an_url, { method: "GET",  headers: {"Content-type": 'application/xml'}})
        if (response.status == 403) 
            response = await fetch(an_url)
        if(!response.ok) throw error(500, `O servidor não conseguiu responder adequadamente a requisição ${an_url}`);
        const content = await response.text()
        return new Response(content, {status: 200, headers: {'content-type': 'application/xml'}});
    } catch (erro) {
        throw erro
    }
  }